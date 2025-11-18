// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler

// SPDX-License-Identifier: Apache-2.0

import {
    Chat,
    ChatInput,
    SessionMessages,
    SessionMessagePanel,
    SessionMessagesHeader,
    Conversation,
    chatTheme as defaultTheme,
    ChatTheme,
    Session,
} from 'reachat';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import './chatTheme.css';
import { theme as reatheme, ThemeProvider } from 'reablocks';

export const ReaChat = () => {
    return (
        <ThemeProvider theme={reatheme}>
            <ActualChat />
        </ThemeProvider>
    );
};

export const ActualChat = () => {
    const [sessions, setSessions] = useState<Session[]>([
        {
            id: '1',
            title: `New Session #${1}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            conversations: [],
        },
    ]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleNewMessage = (message: string) => {
        setLoading(true);
        const current = sessions.find(s => s.id === '1');
        if (current) {
            const newMessage: Conversation = {
                id: `${current.id}-${current.conversations.length}`,
                question: message,
                response: 'this is an example response',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const updated = {
                ...current,
                conversations: [...current.conversations, newMessage],
            };
            setSessions([...sessions.filter(s => s.id !== '1'), updated]);
        }
        setLoading(false);
    };

    return (
        <Chat
            sessions={sessions}
            activeSessionId="1"
            isLoading={loading}
            onSendMessage={handleNewMessage}
            theme={chatTheme}
        >
            <SessionMessagePanel>
                <SessionMessagesHeader />
                <SessionMessages />
                <ChatInput />
            </SessionMessagePanel>
        </Chat>
    );
};

const chatTheme: ChatTheme = {
    ...defaultTheme,
    sessions: {
        ...defaultTheme.sessions,
        console: twMerge(defaultTheme.sessions.console, 'min-w-[300px]'),
        session: {
            ...defaultTheme.sessions.session,
            delete: '[&>svg]:w-4 [&>svg]:h-4 opacity-70 hover:opacity-100 transition-opacity',
        },
    },
    messages: {
        ...defaultTheme.messages,
        base: 'py-4 pr-4',
        message: {
            ...defaultTheme.messages.message,
            question: twMerge(
                defaultTheme.messages.message.question,
                'text-purple-300 text-lg'
            ),
            response: 'border-l border-purple-300 pl-4',
        },
    },
};
