// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Typography } from '@mui/material';
import { lazy, Suspense, useId, useState } from 'react';
import { useStore } from 'react-admin';
import type { ReaChatProps } from './components/ReaChat';
import type { Conversation } from 'reachat';

// Lazy-load ReaChat so the full reachat chain (framer-motion,
// react-syntax-highlighter, openai, reablocks, …) is only fetched
// when the chat panel is actually opened.
const ReaChat = lazy(() =>
    import('./components/ReaChat').then(m => ({ default: m.ReaChat }))
);

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
            <Suspense fallback={null}>
                <ReaChat
                    modelName={modelName}
                    {...rest}
                    conversations={conversations}
                    setConversations={setConversations}
                />
            </Suspense>
        </>
    );
};
