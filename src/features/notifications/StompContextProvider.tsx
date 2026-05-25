// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Client as StompClient } from '@stomp/stompjs';
import {
    Link,
    useCreatePath,
    useNotify,
    useNotificationContext,
    useTranslate,
    useGetResourceLabel,
} from 'react-admin';
import { Alert } from '@mui/material';
import { StateColors } from '../../common/components/StateChips';
import { AuthorizationAwareAuthProvider } from '@dslab/ra-auth-oidc';
import { useRootSelector } from '@dslab/ra-root-selector';
import { StompContext, StompClientContext } from './StompContext';
import { localForageStore } from '../../common/provider/localForageStore';
const store = localForageStore();

const MAX_MESSAGES = 300;
const MAX_TIME_OFFSET = 180; // seconds
const MAX_NOTIFICATION_QUEUE = 5;
const STORE_DEBOUNCE_MS = 500;
const BATCH_FLUSH_MS = 1000;

const filterOnStates = (message: any) => {
    const ignore = ['DELETING', 'BUILT', 'STOP', 'PENDING', 'CREATED'];
    if (
        message.record?.status?.state &&
        ignore.includes(message.record.status.state)
    ) {
        return false;
    }

    return message;
};

export const StompContextProvider = (props: StompContextProviderParams) => {
    const {
        children,
        authProvider,
        websocketUrl,
        topics,
        onMessage: onMessageProp,
        onReceive: onReceiveTransformer = filterOnStates,
    } = props;
    const { root } = useRootSelector();
    const notify = useNotify();
    const { notifications } = useNotificationContext();
    const createPath = useCreatePath();
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();

    const [messages, setMessages] = useState<any[]>([]);
    const [stompClient, setStompClient] = useState<StompClient | undefined>(
        undefined
    );
    const stompClientRef = useRef<StompClient | null>(null);
    const incomingBufferRef = useRef<any[]>([]);
    const batchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const storeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingStoreRef = useRef<any[] | null>(null);
    const flushIncomingRef = useRef<() => void>(() => {});

    //keep storage in sync with root
    const storeKey = useRef<string>('');
    useEffect(() => {
        if (root) {
            storeKey.current = 'dh.notifications.messages.' + root;
            setMessages(store.getItem(storeKey.current) || []);
        }
    }, [root]);
    const storeMessages = useCallback((value: any[]) => {
        if (!storeKey.current) return;
        pendingStoreRef.current = value;
        if (storeTimerRef.current) clearTimeout(storeTimerRef.current);
        storeTimerRef.current = setTimeout(() => {
            if (pendingStoreRef.current !== null && storeKey.current) {
                store.setItem(storeKey.current, pendingStoreRef.current);
                pendingStoreRef.current = null;
            }
        }, STORE_DEBOUNCE_MS);
    }, []);

    const onStateChanged = (message: any) => {
        const ts = message.timestamp
            ? Date.now() - new Date(message.timestamp).getTime()
            : 0;
        if (ts > MAX_TIME_OFFSET * 1000) {
            return;
        }

        const resource = message.resource;
        const record = message.record;

        const name = record.name || record.id;
        const state = record?.status?.state;
        const resourceName = translate(`resources.${resource}.forcedCaseName`, {
            smart_count: 0,
            _: getResourceLabel(resource, 1),
        });

        if (!state) {
            return;
        }

        const msg = translate('messages.notifications.popup', {
            state,
            name,
            resource: resourceName,
        });

        const alertContent =
            state === 'DELETED' ? (
                <span> {msg}</span>
            ) : (
                <Link
                    to={createPath({
                        resource: resource,
                        id: record.id,
                        type: 'show',
                    })}
                >
                    {msg}
                </Link>
            );

        if (notifications.length >= MAX_NOTIFICATION_QUEUE) {
            return;
        }

        notify(
            <Alert severity={StateColors[state.toUpperCase()]}>
                {alertContent}
            </Alert>,
            {
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
            }
        );
    };

    const onMessage = onMessageProp ?? onStateChanged;

    const flushIncoming = () => {
        batchTimerRef.current = null;
        const pending = incomingBufferRef.current;
        if (pending.length === 0) return;
        incomingBufferRef.current = [];
        // toReversed() so newest (last pushed) is at head, without mutating pending
        const batch = pending.toReversed();

        // single state update for the whole batch
        setMessages(prev => {
            const value = [...batch, ...prev].slice(0, MAX_MESSAGES);
            storeMessages(value);
            return value;
        });

        // notify for every message in the batch
        batch.forEach(notification => onMessage(notification));
    };
    // keep ref current so the scheduled timer always calls the latest closure
    flushIncomingRef.current = flushIncoming;

    const onReceive = (message: any) => {
        let notification = JSON.parse(message.body);

        if (notification?.record?.project !== root) {
            return;
        }

        if (onReceiveTransformer) {
            //let callback transform or filter
            notification = onReceiveTransformer(notification);
            if (notification === false) {
                //skip
                return;
            }
        }

        // accumulate in buffer — push to tail (O(1)), reversed on flush
        incomingBufferRef.current.push({ ...notification, isRead: false });

        // schedule a single flush if not already pending
        if (!batchTimerRef.current) {
            batchTimerRef.current = setTimeout(
                () => flushIncomingRef.current(),
                BATCH_FLUSH_MS
            );
        }
    };

    const removeMessage = useCallback(
        message => {
            if (message?.id) {
                setMessages(prev => {
                    const value = prev.filter(m => message.id !== m.id);
                    //store
                    storeMessages(value);
                    return value;
                });
            }
        },
        [storeMessages]
    );

    const removeAllMessages = useCallback(
        messages => {
            if (messages) {
                const ids = messages.map(m => m.id);
                setMessages(prev => {
                    const value = prev.filter(m => !ids.includes(m.id));
                    //store
                    storeMessages(value);
                    return value;
                });
            }
        },
        [storeMessages]
    );

    const updateMessages = useCallback(
        (fn: (msg) => any) => {
            return (messages: any[]) => {
                if (!messages) {
                    return;
                }

                const updated = messages.map(message => fn(message));

                setMessages(prev => {
                    //replace all updated
                    const value = prev.map(
                        m => updated.find(u => u.id == m.id) || m
                    );

                    //store
                    storeMessages(value);
                    return value;
                });
            };
        },
        [storeMessages]
    );

    const stompContext = useMemo(() => {
        if (!websocketUrl) {
            return undefined;
        }

        if (stompClientRef.current) {
            //disconnect
            stompClientRef.current.deactivate();
        }

        //define client
        stompClientRef.current = new StompClient({
            brokerURL: websocketUrl,
        });
        stompClientRef.current.beforeConnect = async () => {
            if (authProvider && stompClientRef.current) {
                const authHeader = await authProvider.getAuthorization();
                if (authHeader) {
                    stompClientRef.current.connectHeaders = {
                        Authorization: authHeader,
                    };
                }
            }
        };

        stompClientRef.current.onConnect = frame => {
            topics.forEach(t => {
                stompClientRef.current?.subscribe(t, onReceive);
            });
        };

        stompClientRef.current.onStompError = frame => {
            console.log('Broker reported error: ' + frame.headers['message']);
            console.log('Additional details: ' + frame.body);
        };

        //connect
        stompClientRef.current.activate();
        setStompClient(stompClientRef.current);

        return {
            remove: removeMessage,
            removeAll: removeAllMessages,
            markAsRead: (msg: any) =>
                updateMessages(msg => {
                    return { ...msg, isRead: true };
                })([msg]),
            markAllAsRead: (msgs: any[]) =>
                updateMessages(msg => {
                    return { ...msg, isRead: true };
                })(msgs),
        };
    }, [authProvider]);

    const contextValue = useMemo(
        () => (stompContext ? { ...stompContext, messages } : undefined),
        [stompContext, messages]
    );

    return (
        <StompClientContext.Provider value={stompClient}>
            <StompContext.Provider value={contextValue}>
                {children}
            </StompContext.Provider>
        </StompClientContext.Provider>
    );
};

export type StompContextProviderParams = {
    children: ReactElement;
    authProvider: AuthorizationAwareAuthProvider | undefined;
    websocketUrl: string;
    topics: string[];
    onMessage?: (message: any) => void;
    onReceive?: (message: any) => any | false;
};
