import { ReactElement, createContext, useContext, useMemo, useRef, useState } from 'react';
import { Client as StompClient, messageCallbackType } from '@stomp/stompjs';
import { Link, useCreatePath, useNotify } from 'react-admin';
import { Alert } from '@mui/material';
import { StateColors } from '../components/StateChips';
import { AuthorizationAwareAuthProvider } from '@dslab/ra-auth-oidc';

interface StompContextValue {
    client: StompClient;
    connect: () => void;
    disconnect: () => Promise<void>;
    messages: any[];
}

const StompContext = createContext<StompContextValue | undefined>(undefined);

export const StompContextProvider = (props: StompContextProviderParams) => {
    const { children, authProvider, websocketUrl } = props;
    const notify = useNotify();
    const createPath = useCreatePath();
    const [messages, setMessages] = useState<any[]>([]);

    const messageCallback: messageCallbackType = message => {
        const entity = JSON.parse(message.body);
        const state: String = entity.status.state;
        console.log('received stomp message', entity.id, entity.status.state);

        setMessages(prev => [...prev, entity]);

        const alertContent =
            state === 'DELETED' ? (
                `Run ${entity.id} status changed to ${state}`
            ) : (
                <Link
                    to={createPath({
                        resource: 'runs',
                        id: entity.id,
                        type: 'show',
                    })}
                >
                    Run status changed to {state}
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

    //TODO check if enough
    if (!websocketUrl) {
        return (
            <StompContext.Provider value={undefined}>
                {children}
            </StompContext.Provider>
        );
    }

    const stompClientRef = useRef<StompClient | null>(null);
    if (stompClientRef.current === null) {
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
                const identity = authProvider.getIdentity ? await authProvider.getIdentity() : undefined;
                if (authHeader) {
                    let headers = { Authorization: authHeader };
                    if (identity) {
                        headers['user'] = identity.id;
                    }
                    stompClientRef.current.connectHeaders = headers;
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
        };
    }, [authProvider]);

    return (
        <StompContext.Provider value={stompContext ? {...stompContext, messages} : undefined}>
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
        throw new Error(
            'useStompContext must be used inside a StompContext'
        );
    }
    return stompContext;
};
