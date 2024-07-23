import { ReactElement, createContext, useMemo } from 'react';
import { Client as StompClient } from '@stomp/stompjs';
import { Link, useCreatePath, useNotify } from 'react-admin';
import { Alert } from '@mui/material';
import { StateColors } from '../components/StateChips';

interface StompContextValue {
    client: StompClient;
    connect: () => void;
    disconnect: () => Promise<void>;
}

const StompContext = createContext<StompContextValue | undefined>(undefined);

export const StompContextProvider = (props: StompContextProviderParams) => {
    const { children, stompClient } = props;
    const notify = useNotify();
    const createPath = useCreatePath();

    const stompContext = useMemo(() => {
        stompClient.onConnect = frame => {
            console.log('successfully connected to stomp');
            const subscription = stompClient.subscribe(
                '/topic/runs',
                message => {
                    const entity = JSON.parse(message.body);
                    const state: String = entity.status.state;
                    console.log(
                        'received stomp message',
                        entity.id,
                        entity.status.state
                    );
                    //TODO con autenticazione, confrontare utente della run con utente autenticato per filtrare
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
                }
            );
        };

        stompClient.onStompError = frame => {
            console.log('Broker reported error: ' + frame.headers['message']);
            console.log('Additional details: ' + frame.body);
        };

        stompClient.activate();

        return {
            client: stompClient,
            connect: () => stompClient.activate(),
            disconnect: () => stompClient.deactivate(),
        };
    }, [stompClient]);

    return (
        <StompContext.Provider value={stompContext}>
            {children}
        </StompContext.Provider>
    );
};

type StompContextProviderParams = {
    children: ReactElement;
    stompClient: StompClient;
};
