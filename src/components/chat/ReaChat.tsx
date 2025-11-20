// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler

// SPDX-License-Identifier: Apache-2.0

import {
    Chat,
    ChatInput,
    SessionMessages,
    SessionMessagePanel,
    SessionMessagesHeader,
    chatTheme as defaultTheme,
    ChatTheme,
    Session,
    SessionGroups,
    SessionsList,
    NewSessionButton,
} from 'reachat';
import { useCallback, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import './chatTheme.css';
import OpenAI from 'openai';
import { theme as reatheme, ThemeProvider } from 'reablocks';

export const ReaChat = () => {
    return (
        <ThemeProvider theme={reatheme}>
            <OpenAIChat />
        </ThemeProvider>
    );
};

const API_KEY: string =
    (globalThis as any).VITE_OPENAI_API_KEY ||
    import.meta.env.VITE_OPENAI_API_KEY ||
    '';

const API_BASE_URL: string =
    (globalThis as any).VITE_OPENAI_BASE_URL ||
    import.meta.env.VITE_OPENAI_BASE_URL ||
    '';

const OpenAIChat = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [apiKey, setApiKey] = useState(API_KEY);
    const [loading, setIsLoading] = useState<boolean>(false);
    const openai = useRef<OpenAI | null>(null);
    const [activeSessionId, setActiveSessionId] = useState<string>(
        Date.now().toString()
    );

    useEffect(() => {
        if (apiKey) {
            openai.current = new OpenAI({
                apiKey: apiKey,
                baseURL: API_BASE_URL,
                dangerouslyAllowBrowser: true, // For demo purposes only
            });
        }
    }, [apiKey]);

    const handleNewSession = useCallback(() => {
        const newId = Date.now().toString();
        setActiveSessionId(newId);
    }, []);

    const handleNewMessage = useCallback(
        async (message: string) => {
            const currentSessionId = activeSessionId;

            if (!openai.current) {
                console.error('OpenAI client not initialized');
                return;
            }

            setIsLoading(true);
            const conversationId = Date.now().toString();

            setSessions(prevSessions => {
                const sessionIndex = prevSessions.findIndex(
                    s => s.id === currentSessionId
                );

                const newConversation = {
                    id: conversationId,
                    question: message,
                    response: '',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                if (sessionIndex === -1) {
                    return [
                        {
                            id: currentSessionId,
                            title: message.slice(0, 30),
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            conversations: [newConversation],
                        },
                        ...prevSessions,
                    ];
                } else {
                    const updatedSessions = [...prevSessions];
                    updatedSessions[sessionIndex] = {
                        ...updatedSessions[sessionIndex],
                        conversations: [
                            ...updatedSessions[sessionIndex].conversations,
                            newConversation,
                        ],
                    };
                    return updatedSessions;
                }
            });

            try {
                const stream = await openai.current.chat.completions.create({
                    model: 'qwen-test-cpu',
                    messages: [{ role: 'user', content: message }],
                    stream: true,
                });

                let accumulatedResponse = '';

                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    accumulatedResponse += content;

                    setSessions(prevSessions => {
                        const sessionIndex = prevSessions.findIndex(
                            s => s.id === currentSessionId
                        );
                        if (sessionIndex === -1) return prevSessions;

                        const updatedSessions = [...prevSessions];
                        const session = updatedSessions[sessionIndex];
                        const conversationIndex =
                            session.conversations.findIndex(
                                c => c.id === conversationId
                            );

                        if (conversationIndex !== -1) {
                            const newConversations = [...session.conversations];
                            newConversations[conversationIndex] = {
                                ...newConversations[conversationIndex],
                                response: accumulatedResponse,
                                updatedAt: new Date(),
                            };

                            updatedSessions[sessionIndex] = {
                                ...session,
                                conversations: newConversations,
                            };
                        }
                        return updatedSessions;
                    });
                }
            } catch (error) {
                console.error('Error calling OpenAI API:', error);
            } finally {
                setIsLoading(false);
            }
        },
        [openai, activeSessionId]
    );
    const handleDeleteSession = useCallback(
        (sessionId: string) => {
            setSessions(prevSessions =>
                prevSessions.filter(s => s.id !== sessionId)
            );
            if (sessionId === activeSessionId) {
                handleNewSession();
            }
        },
        [activeSessionId, handleNewSession]
    );

    const handleSessionSelect = useCallback((sessionId: string) => {
        setActiveSessionId(sessionId);
    }, []);

    return (
        <Chat
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={handleSessionSelect}
            isLoading={loading}
            onSendMessage={handleNewMessage}
            theme={chatTheme}
            onDeleteSession={handleDeleteSession}
            onNewSession={handleNewSession}
            viewType="console"
        >
            <SessionsList>
                <NewSessionButton newSessionText="New Chat" />
                <SessionGroups />
            </SessionsList>
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
        create: twMerge(
            defaultTheme.sessions.create,
            'flex items-center justify-center w-full gap-2 px-4 py-3 mb-4 font-medium text-white transition-all rounded-lg shadow-md bg-[#E0701B] hover:bg-[#cc5f17] hover:shadow-lg active:scale-95 cursor-pointer mx-auto'
        ),
        session: {
            ...defaultTheme.sessions.session,
            base: twMerge(
                defaultTheme.sessions.session.base,
                'rounded-lg px-3 py-3 text-sm font-medium transition-all text-gray-600 mx-2 cursor-pointer',
                'hover:bg-[#E0701B]/10 '
            ),
            active: twMerge(
                defaultTheme.sessions.session.active,
                'bg-[#E0701B]/15 border-l-4 border-[#E0701B] shadow-sm'
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
                'bg-[#E0701B] text-white shadow-md rounded-2xl rounded-tr-sm px-5 py-3 text-base leading-relaxed ml-auto max-w-[80%]'
            ),

            response: twMerge(
                defaultTheme.messages.message.response,
                'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl rounded-tl-sm px-5 py-4 mr-auto max-w-[80%] text-base leading-relaxed'
            ),

            footer: {
                ...defaultTheme.messages.message.footer,
                base: 'flex gap-3 mt-2 px-1 text-gray-400',
                copy: 'hover:text-[#E0701B] transition-colors cursor-pointer',
                refresh:
                    'hover:text-[#E0701B] transition-colors cursor-pointer',
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
            send: 'bg-[#E0701B] hover:bg-[#cc5f17] text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-md transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
            stop: 'border border-red-500 text-red-500 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-red-50',
        },
    },
};
