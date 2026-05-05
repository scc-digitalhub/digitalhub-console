import { Typography } from '@mui/material';
import { ReaChat, ReaChatProps } from './components/ReaChat';
import { useId, useState } from 'react';
import { useStore } from 'react-admin';
import { Conversation } from 'reachat';

export type ChatClientProps = Omit<
    ReaChatProps,
    'conversations' | 'setConversations'
> & {
    storageKey?: string | false;
};

export const ChatClient = (props: ChatClientProps) => {
    const { storageKey, modelName, ...rest } = props;
    const instanceId = useId();
    const [localHistory, setLocalHistory] = useState<Conversation[]>([]);
    const [storedHistory, setStoredHistory] = useStore<Conversation[]>(
        storageKey || instanceId,
        []
    );
    const conversations = storageKey ? storedHistory : localHistory;
    const setConversations =
        storageKey == false
            ? () => []
            : storageKey
            ? setStoredHistory
            : setLocalHistory;

    return (
        <>
            {modelName && (
                <Typography variant="body2" id="client-dialog-model">
                    {modelName}
                </Typography>
            )}
            <ReaChat
                modelName={modelName}
                {...rest}
                conversations={conversations}
                setConversations={setConversations}
            />
        </>
    );
};
