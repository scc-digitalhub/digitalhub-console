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

    base: twMerge(
        defaultTheme.base,
        'bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden'
    ),

    sessions: {
        ...defaultTheme.sessions,
        console: twMerge(
            defaultTheme.sessions.console,
            'bg-gray-50 dark:bg-gray-900 w-[280px] border-r border-gray-200 dark:border-gray-700'
        ),
        session: {
            ...defaultTheme.sessions.session,
            base: twMerge(
                defaultTheme.sessions.session.base,
                'rounded-lg px-3 py-3 text-sm font-medium transition-all text-gray-600 hover:bg-purple-50 hover:text-purple-700'
            ),
            active: twMerge(
                defaultTheme.sessions.session.active,
                'bg-purple-100 text-purple-800 border-l-4 border-purple-600 shadow-sm'
            ),
            delete: 'text-gray-400 hover:text-red-500 p-1',
        },
    },

    messages: {
        ...defaultTheme.messages,
        base: twMerge(
            defaultTheme.messages.base,
            'bg-white dark:bg-gray-900 p-4'
        ),
        message: {
            ...defaultTheme.messages.message,
            base: twMerge(
                defaultTheme.messages.message.base,
                'mb-6 gap-3 max-w-3xl mx-auto w-full'
            ),

            question: twMerge(
                defaultTheme.messages.message.question,
                'bg-purple-600 text-white shadow-md rounded-2xl rounded-tr-sm px-5 py-3 text-base leading-relaxed ml-auto max-w-[80%]'
            ),

            response: twMerge(
                defaultTheme.messages.message.response,
                'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl rounded-tl-sm px-5 py-4 mr-auto max-w-[80%] text-base leading-relaxed'
            ),

            footer: {
                ...defaultTheme.messages.message.footer,
                base: 'flex gap-3 mt-2 px-1 text-gray-400',
                copy: 'hover:text-purple-600 transition-colors cursor-pointer',
                refresh:
                    'hover:text-purple-600 transition-colors cursor-pointer',
                upvote: 'hover:text-green-600 transition-colors cursor-pointer',
                downvote: 'hover:text-red-600 transition-colors cursor-pointer',
            },
        },
    },

    input: {
        ...defaultTheme.input,
        base: twMerge(
            defaultTheme.input.base,
            'bg-white dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700'
        ),
        input: twMerge(
            defaultTheme.input.input,
            'bg-white dark:bg-gray-800 text-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all shadow-inner'
        ),
        actions: {
            ...defaultTheme.input.actions,
            base: 'flex items-center gap-2 ml-3',
            send: 'bg-purple-600 hover:bg-purple-700 text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-md transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
            stop: 'border border-red-500 text-red-500 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-red-50',
        },
    },
};
