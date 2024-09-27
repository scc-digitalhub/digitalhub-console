import {
    ReactElement,
    createContext,
    useContext,
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
    useTranslate,
    localStorageStore,
} from 'react-admin';
import { Alert } from '@mui/material';
import { StateColors } from '../components/StateChips';
import { AuthorizationAwareAuthProvider } from '@dslab/ra-auth-oidc';
import { useRootSelector } from '@dslab/ra-root-selector';

interface StompContextValue {
    client: StompClient;
    // connect: () => void;
    // disconnect: () => Promise<void>;
    messages: any[];
    // setMessages: React.Dispatch<React.SetStateAction<any[]>>;
    remove: (message: any) => void;
    markAsRead: (message: any) => void;
    markAllAsRead: (message: any[]) => void;
}

const StompContext = createContext<StompContextValue | undefined>(undefined);

export const StompContextProvider = (props: StompContextProviderParams) => {
    const { children, authProvider, websocketUrl, topics, onMessage } = props;
    const { root } = useRootSelector();
    const notify = useNotify();
    const createPath = useCreatePath();
    const store = localStorageStore();
    const translate = useTranslate();

    const [messages, setMessages] = useState<any[]>([]);
    const stompClientRef = useRef<StompClient | null>(null);

    //keep storage in sync with root
    const storeKey = useRef<string>('');
    useEffect(() => {
        if (root) {
            storeKey.current = 'dh.notifications.messages.' + root;
            setMessages(store.getItem(storeKey.current));
        }
    }, [root]);
    const storeMessages = value => {
        if (storeKey.current) {
            store.setItem(storeKey.current, value);
        }
    };

    const alertMessage = (message: any) => {
        const resource = message.resource;
        const record = message.record;

        const state = record?.status?.state;

        if (!state) {
            return;
        }

        const alertContent =
            state === 'DELETED' ? (
                translate('messages.notifications.runAlertMessage', {
                    id: record.id,
                    state: state,
                })
            ) : (
                <Link
                    to={createPath({
                        resource: resource,
                        id: record.id,
                        type: 'show',
                    })}
                >
                    {translate('messages.notifications.runMessage', {
                        state: state,
                    })}
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
        const notification = JSON.parse(message.body);

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
            alertMessage(notification);
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
            connect: stompClientRef.current.activate,
            disconnect: stompClientRef.current.deactivate,
            remove: removeMessage,
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
};

export const useStompContext = () => {
    const stompContext = useContext(StompContext);
    if (stompContext === undefined) {
        throw new Error('useStompContext must be used inside a StompContext');
    }
    return stompContext;
};
