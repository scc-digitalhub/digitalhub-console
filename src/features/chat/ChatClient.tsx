import { Typography } from '@mui/material';
import { ChatContextProvider } from './ChatContextProvider';
import { ReaChat, ReaChatProps } from './components/ReaChat';

export type ChatClientProps = ReaChatProps & {
    storageKey?: string;
};

export const ChatClient = (props: ChatClientProps) => {
    const { storageKey, modelName, ...rest } = props;
    return (
        <>
            {modelName && (
                <Typography id="client-dialog-model">{modelName}</Typography>
            )}
            <ChatContextProvider>
                <ReaChat modelName={modelName} {...rest} />
            </ChatContextProvider>
        </>
    );
};
