// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler

// SPDX-License-Identifier: Apache-2.0

import {
    Chat,
    ChatInput,
    SessionMessages,
    SessionMessagePanel,
    SessionMessagesHeader,
    SessionMessage,
    MessageQuestion,
    MessageResponse,
    MessageSources,
    MessageActions,
} from 'reachat';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import OpenAI from 'openai';
import { theme as reatheme, ThemeProvider } from 'reablocks';
import { alpha, CSSProperties, useTheme } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslate } from 'react-admin';
import { ErrorDisplay } from './ErrorDisplay';
import { createChatTheme } from '../chatTheme';
import '../chatTheme.css';
import { useChatContext } from './ChatContext';

const API_KEY: string =
    (globalThis as any).VITE_OPENAI_API_KEY ||
    import.meta.env.VITE_OPENAI_API_KEY ||
    '';

const API_BASE_URL: string =
    (globalThis as any).VITE_OPENAI_BASE_URL ||
    import.meta.env.VITE_OPENAI_BASE_URL ||
    '';

const THROTTLE_MS = 100;

const CriticalErrorFallback = ({ error, retry }: any) => {
    return <ErrorDisplay error={error} onRetry={retry} />;
};

export const ReaChat = () => {
    return (
        <ThemeProvider theme={reatheme}>
            <ErrorBoundary FallbackComponent={CriticalErrorFallback}>
                <OpenAIChat />
            </ErrorBoundary>
        </ThemeProvider>
    );
};

const OpenAIChat = () => {
    const { id } = useParams();
    const currentRunId = id || 'general-session';
    const { sessions, updateSession, ensureSessionForRun } = useChatContext();

    const [loading, setIsLoading] = useState<boolean>(false);

    const isRegeneratingRef = useRef(false);

    useEffect(() => {
        ensureSessionForRun(currentRunId);
    }, [currentRunId, ensureSessionForRun]);

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

    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const primaryColor = theme.palette.primary.main;
    const translate = useTranslate();

    const cssVariables = {
        '--primary': primaryColor,
        '--primary-hover': theme.palette.primary.dark,
        '--primary-alpha': alpha(primaryColor, 0.15),
        '--primary-hover-alpha': alpha(primaryColor, 0.1),
    } as CSSProperties;

    const dynamicChatTheme = createChatTheme();

    const handleStop = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsLoading(false);
    }, []);

    const handleCopy = useCallback((text?: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text).catch(err => console.error(err));
    }, []);

    const handleNewMessage = useCallback(
        async (message: string) => {
            if (!openai.current) return console.error('OpenAI not initialized');
            if (!message) return;

            const currentSession = sessions.find(s => s.id === currentRunId);
            if (!currentSession) return;

            setIsLoading(true);
            abortControllerRef.current = new AbortController();

            let baseConversations = currentSession.conversations;
            if (isRegeneratingRef.current) {
                baseConversations = baseConversations.slice(0, -1);
                isRegeneratingRef.current = false;
            }

            const conversationId = Date.now().toString();

            const updateSessionState = (
                currentResponse: string,
                isError: boolean = false
            ) => {
                const newConversation = {
                    id: conversationId,
                    question: message,
                    response: currentResponse,
                    isError: isError,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                const conversations = [...baseConversations, newConversation];

                updateSession({
                    ...currentSession,
                    updatedAt: new Date(),
                    conversations,
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
                    updateSessionState(error?.message, true);
                }
            } finally {
                setIsLoading(false);
                abortControllerRef.current = null;
            }
        },
        [currentRunId, sessions, updateSession]
    );

    const handleRegenerate = useCallback(
        (question: string) => {
            if (loading || !question) return;

            isRegeneratingRef.current = true;
            handleNewMessage(question);
        },
        [loading, handleNewMessage]
    );

    return (
        <div
            className={isDarkMode ? 'dark' : ''}
            style={{ height: '100%', ...cssVariables }}
        >
            <Chat
                sessions={sessions}
                activeSessionId={currentRunId}
                isLoading={loading}
                onSendMessage={handleNewMessage}
                theme={dynamicChatTheme}
                viewType="chat"
                onStopMessage={handleStop}
                style={{ maxHeight: '60vh' }}
            >
                <SessionMessagePanel>
                    <SessionMessagesHeader />
                    <SessionMessages>
                        {(conversations: any[]) =>
                            conversations.map((conversation, index) => {
                                const isLast =
                                    index === conversations.length - 1;
                                const isError = conversation.isError;

                                return (
                                    <SessionMessage
                                        conversation={conversation}
                                        isLast={isLast}
                                        key={conversation.id}
                                    >
                                        <MessageQuestion
                                            question={conversation.question}
                                        />

                                        {isError ? (
                                            <ErrorDisplay
                                                error={
                                                    new Error(
                                                        conversation.response
                                                    )
                                                }
                                                onRetry={
                                                    isLast
                                                        ? () =>
                                                              handleRegenerate(
                                                                  conversation.question
                                                              )
                                                        : undefined
                                                }
                                            />
                                        ) : (
                                            <MessageResponse
                                                response={conversation.response}
                                                isLoading={isLast && loading}
                                            />
                                        )}

                                        <MessageSources
                                            sources={conversation.sources}
                                        />

                                        {!isError && (
                                            <MessageActions
                                                question={conversation.question}
                                                response={conversation.response}
                                                onCopy={() =>
                                                    handleCopy(
                                                        conversation.response
                                                    )
                                                }
                                                onRefresh={() =>
                                                    handleRegenerate(
                                                        conversation.question
                                                    )
                                                }
                                            />
                                        )}
                                    </SessionMessage>
                                );
                            })
                        }
                    </SessionMessages>

                    <ChatInput
                        placeholder={translate(
                            'messages.chat.type_your_message'
                        )}
                    />
                </SessionMessagePanel>
            </Chat>
        </div>
    );
};
