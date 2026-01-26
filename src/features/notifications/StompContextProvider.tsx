// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { Client as StompClient } from '@stomp/stompjs';
import {
    Link,
    useCreatePath,
    useNotify,
    useTranslate,
    localStorageStore,
    useGetResourceLabel,
} from 'react-admin';
import { Alert } from '@mui/material';
import { StateColors } from '../../common/components/StateChips';
import { AuthorizationAwareAuthProvider } from '@dslab/ra-auth-oidc';
import { useRootSelector } from '@dslab/ra-root-selector';
import { StompContext } from './StompContext';

const filterOnStates = (message: any) => {
    const ignore = ['DELETING', 'BUILT', 'STOP', 'RESUME'];
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
        onMessage,
        onReceive: onReceiveTransformer = filterOnStates,
    } = props;
    const { root } = useRootSelector();
    const notify = useNotify();
    const createPath = useCreatePath();
    const store = localStorageStore();
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();

    const [messages, setMessages] = useState<any[]>([]);
    const stompClientRef = useRef<StompClient | null>(null);

    //keep storage in sync with root
    const storeKey = useRef<string>('');
    useEffect(() => {
        if (root) {
            storeKey.current = 'dh.notifications.messages.' + root;
            setMessages(store.getItem(storeKey.current) || []);
        }
    }, [root]);
    const storeMessages = value => {
        if (storeKey.current) {
            store.setItem(storeKey.current, value);
        }
    };

    const onStateChanged = (message: any) => {
        const resource = message.resource;
        const record = message.record;

        const state = record?.status?.state;
        const resourceName = translate(`resources.${resource}.forcedCaseName`, {
            smart_count: 0,
            _: getResourceLabel(resource, 1),
        });

        if (!state) {
            return;
        }

        const msg = translate('messages.notifications.stateMessage', {
            state,
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

    const onReceive = message => {
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

        //push as first element in stack
        setMessages(prev => {
            const value = [
                {
                    ...notification,
                    isRead: false,
                },
                ...prev,
            ];
            //store
            storeMessages(value);
            return value;
        });

        //notify
        if (onMessage) {
            onMessage(notification);
        } else {
            //default alert
            onStateChanged(notification);
        }
    };

    const removeMessage = message => {
        if (message?.id) {
            setMessages(prev => {
                const value = prev.filter(m => message.id !== m.id);
                //store
                storeMessages(value);
                return value;
            });
        }
    };

    const removeAllMessages = messages => {
        if (messages) {
            const ids = messages.map(m => m.id);
            setMessages(prev => {
                const value = prev.filter(m => !ids.includes(m.id));
                //store
                storeMessages(value);
                return value;
            });
        }
    };

    const updateMessages = (fn: (msg) => any) => {
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
    };

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

        return {
            client: stompClientRef.current,
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

    return (
        <StompContext.Provider
            value={stompContext ? { ...stompContext, messages } : undefined}
        >
            {children}
        </StompContext.Provider>
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
