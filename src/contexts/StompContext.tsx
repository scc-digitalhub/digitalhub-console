import {
    ReactElement,
    createContext,
    useContext,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Client as StompClient, messageCallbackType } from '@stomp/stompjs';
import { Link, useCreatePath, useNotify, useTranslate } from 'react-admin';
import { Alert } from '@mui/material';
import { StateColors } from '../components/StateChips';
import { AuthorizationAwareAuthProvider } from '@dslab/ra-auth-oidc';
import { useRootSelector } from '@dslab/ra-root-selector';
import { localStorageStore } from 'react-admin';

interface StompContextValue {
    client: StompClient;
    connect: () => void;
    disconnect: () => Promise<void>;
    messages: any[];
    setMessages: React.Dispatch<React.SetStateAction<any[]>>;
}

const StompContext = createContext<StompContextValue | undefined>(undefined);

export const StompContextProvider = (props: StompContextProviderParams) => {
    const { children, authProvider, websocketUrl } = props;
    const { root } = useRootSelector();
    const notify = useNotify();
    const createPath = useCreatePath();
    const store = localStorageStore('dh');
    const translate = useTranslate();

    const [messages, setMessages] = useState<any[]>(
        store.getItem('dh.notifications.messages.' + root, [])
    );

    const messageCallback: messageCallbackType = message => {
        const entity = JSON.parse(message.body);
        const state: String = entity.status.state;
        console.log('received stomp message', entity.id, entity.status.state);

        // if (root) {
        setMessages(prev => {
            const val = [
                {
                    ...entity,
                    notificationId: `${entity.id}_${state}`,
                    notificationType: 'run',
                    isRead: false,
                },
                ...prev,
            ];
            store.setItem('dh.notifications.messages.' + root, val);
            return val;
        });
        // }

        const alertContent =
            state === 'DELETED' ? (
                translate('messages.notifications.runAlertMessage', {
                    id: entity.id,
                    state: state,
                })
            ) : (
                <Link
                    to={createPath({
                        resource: 'runs',
                        id: entity.id,
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

    const stompClientRef = useRef<StompClient | null>(null);
    if (stompClientRef.current === null && websocketUrl) {
        stompClientRef.current = new StompClient({
            brokerURL: websocketUrl,
        });
    }

    // TODO effetto per gestire doppia creazione del client in dev mode chiudendo una connessione, ma messages non viene aggiornato
    // useEffect(() => {
    //     if (stompClientRef.current === null) {
    //         stompClientRef.current = new StompClient({
    //             brokerURL: websocketUrl,
    //         });
    //     }

    //     return () => {
    //         stompClientRef.current?.deactivate();
    //         stompClientRef.current = null;
    //     };
    // }, []);

    const stompContext = useMemo(() => {
        if (stompClientRef.current === null) {
            return undefined;
        }

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
            console.log('successfully connected to stomp');
            const subscription = stompClientRef.current?.subscribe(
                '/user/runs',
                messageCallback
            );
        };

        stompClientRef.current.onStompError = frame => {
            console.log('Broker reported error: ' + frame.headers['message']);
            console.log('Additional details: ' + frame.body);
        };

        stompClientRef.current.activate();

        return {
            client: stompClientRef.current,
            connect: stompClientRef.current.activate,
            disconnect: stompClientRef.current.deactivate,
            // messages: root ? messages[root] : [],
        };
    }, [authProvider /*, root*/]);

    return (
        <StompContext.Provider
            value={
                stompContext
                    ? { ...stompContext, messages, setMessages }
                    : undefined
            }
        >
            {children}
        </StompContext.Provider>
    );
};

type StompContextProviderParams = {
    children: ReactElement;
    authProvider: AuthorizationAwareAuthProvider | undefined;
    websocketUrl: string;
};

export const useStompContext = () => {
    const stompContext = useContext(StompContext);
    if (stompContext === undefined) {
        throw new Error('useStompContext must be used inside a StompContext');
    }
    return stompContext;
};
