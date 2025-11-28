// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler

// SPDX-License-Identifier: Apache-2.0

import {
    Chat,
    ChatInput,
    SessionMessages,
    SessionMessagePanel,
    SessionMessagesHeader,
    Session,
    SessionMessage,
    MessageQuestion,
    MessageResponse,
    MessageSources,
    MessageActions,
} from 'reachat';
import { useCallback, useEffect, useRef, useState } from 'react';
import './chatTheme.css';
import OpenAI from 'openai';
import { theme as reatheme, ThemeProvider } from 'reablocks';
import { chatTheme } from './chatTheme';

const API_KEY: string =
    (globalThis as any).VITE_OPENAI_API_KEY ||
    import.meta.env.VITE_OPENAI_API_KEY ||
    '';

const API_BASE_URL: string =
    (globalThis as any).VITE_OPENAI_BASE_URL ||
    import.meta.env.VITE_OPENAI_BASE_URL ||
    '';

const SINGLE_SESSION_ID = 'main-session';
const THROTTLE_MS = 100;
const DEFAULT_SESSION_TITLE = 'What is in your mind?';

export const ReaChat = () => {
    return (
        <ThemeProvider theme={reatheme}>
            <OpenAIChat />
        </ThemeProvider>
    );
};

const OpenAIChat = () => {
    const [sessions, setSessions] = useState<Session[]>([
        {
            id: SINGLE_SESSION_ID,
            title: DEFAULT_SESSION_TITLE,
            createdAt: new Date(),
            updatedAt: new Date(),
            conversations: [],
        },
    ]);

    const [loading, setIsLoading] = useState<boolean>(false);
    const openai = useRef<OpenAI | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (API_KEY) {
            openai.current = new OpenAI({
                apiKey: API_KEY,
                baseURL: API_BASE_URL,
                dangerouslyAllowBrowser: true,
            });
        }
    }, []);

    const handleStop = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsLoading(false);
    }, []);

    const handleCopy = useCallback((text?: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text).catch(err => {
            console.error('Failed to copy:', err);
        });
    }, []);

    const handleRegenerate = useCallback(
        (question: string) => {
            if (loading || !question) return;
            setSessions(prev => {
                const updated = [...prev];
                const idx = updated.findIndex(s => s.id === SINGLE_SESSION_ID);
                if (idx !== -1) {
                    updated[idx] = {
                        ...updated[idx],
                        conversations: updated[idx].conversations.slice(0, -1),
                    };
                }
                return updated;
            });

            handleNewMessage(question);
        },
        [loading]
    );

    const handleNewMessage = useCallback(async (message: string) => {
        if (!openai.current) return console.error('OpenAI not initialized');
        if (!message) return;

        setIsLoading(true);
        abortControllerRef.current = new AbortController();

        const conversationId = Date.now().toString();

        const updateSessionState = (currentResponse: string) => {
            setSessions(prevSessions => {
                const sessionIndex = prevSessions.findIndex(
                    s => s.id === SINGLE_SESSION_ID
                );
                if (sessionIndex === -1) return prevSessions;

                const newConversation = {
                    title: message,
                    id: conversationId,
                    question: message,
                    response: currentResponse,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                const updatedSessions = [...prevSessions];
                const session = updatedSessions[sessionIndex];
                const conversations = [...session.conversations];
                const convIndex = conversations.findIndex(
                    c => c.id === conversationId
                );

                if (convIndex === -1) {
                    conversations.push(newConversation);
                } else {
                    conversations[convIndex] = {
                        ...conversations[convIndex],
                        response: currentResponse,
                        updatedAt: new Date(),
                    };
                }

                updatedSessions[sessionIndex] = { ...session, conversations };
                return updatedSessions;
            });
        };

        updateSessionState('');

        try {
            const stream = await openai.current.chat.completions.create(
                {
                    model: 'qwen-test-cpu',
                    messages: [{ role: 'user', content: message }],
                    stream: true,
                },
                { signal: abortControllerRef.current.signal }
            );

            let accumulatedResponse = '';
            let lastUpdateTime = 0;

            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                accumulatedResponse += content;
                const now = Date.now();
                if (now - lastUpdateTime > THROTTLE_MS) {
                    updateSessionState(accumulatedResponse);
                    lastUpdateTime = now;
                }
            }
            updateSessionState(accumulatedResponse);
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error('Error calling OpenAI API:', error);
            }
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    }, []);

    return (
        <Chat
            sessions={sessions}
            activeSessionId={SINGLE_SESSION_ID}
            isLoading={loading}
            onSendMessage={handleNewMessage}
            theme={chatTheme}
            viewType="chat"
            onStopMessage={handleStop}
            style={{ maxHeight: '60vh' }}
        >
            <SessionMessagePanel>
                <SessionMessagesHeader />
                <SessionMessages>
                    {(conversations: any[]) =>
                        conversations.map((conversation, index) => (
                            <SessionMessage
                                conversation={conversation}
                                isLast={index === conversations.length - 1}
                                key={conversation.id}
                            >
                                <MessageQuestion
                                    question={conversation.question}
                                />
                                <MessageResponse
                                    response={conversation.response}
                                    isLoading={
                                        index === conversations.length - 1 &&
                                        loading
                                    }
                                />

                                <MessageSources
                                    sources={conversation.sources}
                                />

                                <MessageActions
                                    question={conversation.question}
                                    response={conversation.response}
                                    onCopy={() =>
                                        handleCopy(conversation.response)
                                    }
                                    onRefresh={() =>
                                        handleRegenerate(conversation.question)
                                    }
                                />
                            </SessionMessage>
                        ))
                    }
                </SessionMessages>

                <ChatInput placeholder="Type your message..." />
            </SessionMessagePanel>
        </Chat>
    );
};
