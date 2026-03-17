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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import OpenAI from 'openai';
import { theme as reatheme, ThemeProvider } from 'reablocks';
import { alpha, useTheme, CSSProperties } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslate } from 'react-admin';
import { ErrorDisplay } from './ErrorDisplay';
import { createChatTheme } from '../chatTheme';
import '../chatTheme.css';
import { useChatContext } from '../ChatContext';

const API_KEY: string =
    (globalThis as any).VITE_OPENAI_API_KEY ||
    import.meta.env.VITE_OPENAI_API_KEY ||
    '';

const API_BASE_URL: string =
    (globalThis as any).VITE_OPENAI_BASE_URL ||
    import.meta.env.VITE_OPENAI_BASE_URL ||
    '';

const THROTTLE_MS = 100;

const CriticalErrorFallback = ({ error, retry }: any) => (
    <ErrorDisplay error={error} onRetry={retry} />
);

interface ReaChatProps {
    modelName: string;
    baseUrl?: string;
}

export const ReaChat = ({ modelName, baseUrl }: ReaChatProps) => (
    <ThemeProvider theme={reatheme}>
        <ErrorBoundary FallbackComponent={CriticalErrorFallback}>
            <OpenAIChat modelName={modelName} baseUrl={baseUrl} />
        </ErrorBoundary>
    </ThemeProvider>
);

const OpenAIChat = ({ modelName, baseUrl }: ReaChatProps) => {
    const { id } = useParams();
    const currentRunId = id || 'general-session';
    const { sessions, updateSession, ensureSessionForRun } = useChatContext();
    const translate = useTranslate();
    const theme = useTheme();

    const [loading, setIsLoading] = useState<boolean>(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const openai = useMemo(() => {
        if (!API_KEY) return null;
        return new OpenAI({
            apiKey: API_KEY,
            baseURL: API_BASE_URL || baseUrl,
            dangerouslyAllowBrowser: true,
        });
    }, [baseUrl]);

    useEffect(() => {
        ensureSessionForRun(currentRunId);
    }, [currentRunId, ensureSessionForRun]);

    const handleStop = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsLoading(false);
    }, []);

    const handleCopy = useCallback((text?: string) => {
        if (text) navigator.clipboard.writeText(text).catch(console.error);
    }, []);

    const processMessage = useCallback(
        async (message: string, isRegeneration: boolean = false) => {
            if (!openai) return console.error('OpenAI not initialized');
            if (!message) return;

            const currentSession = sessions.find(s => s.id === currentRunId);
            if (!currentSession) return;

            setIsLoading(true);
            abortControllerRef.current = new AbortController();

            const baseConversations = isRegeneration
                ? currentSession.conversations.slice(0, -1)
                : currentSession.conversations;

            const conversationId = Date.now().toString();

            const updateSessionState = (
                currentResponse: string,
                isError: boolean = false
            ) => {
                const newConversation = {
                    id: conversationId,
                    question: message,
                    response: currentResponse,
                    isError,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                updateSession({
                    ...currentSession,
                    updatedAt: new Date(),
                    conversations: [...baseConversations, newConversation],
                });
            };

            updateSessionState('');

            let accumulatedResponse = '';
            let lastUpdateTime = 0;

            try {
                const stream = await openai.chat.completions.create(
                    {
                        model: modelName,
                        messages: [{ role: 'user', content: message }],
                        stream: true,
                    },
                    { signal: abortControllerRef.current.signal }
                );

                for await (const chunk of stream) {
                    accumulatedResponse +=
                        chunk.choices[0]?.delta?.content || '';
                    const now = Date.now();
                    if (now - lastUpdateTime > THROTTLE_MS) {
                        updateSessionState(accumulatedResponse);
                        lastUpdateTime = now;
                    }
                }
                updateSessionState(accumulatedResponse);
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    const finalMessage = accumulatedResponse
                        ? `${accumulatedResponse}\n\n[Error: ${error?.message}]`
                        : error?.message;

                    updateSessionState(finalMessage, true);
                }
            } finally {
                setIsLoading(false);
                abortControllerRef.current = null;
            }
        },
        [currentRunId, sessions, updateSession, modelName, openai]
    );

    const handleNewMessage = useCallback(
        (message: string) => processMessage(message, false),
        [processMessage]
    );

    const handleRegenerate = useCallback(
        (question: string) => {
            if (!loading && question) processMessage(question, true);
        },
        [loading, processMessage]
    );

    const isDarkMode = theme.palette.mode === 'dark';
    const dynamicChatTheme = useMemo(() => createChatTheme(), []);
    const cssVariables = useMemo(
        () =>
            ({
                '--primary': theme.palette.primary.main,
                '--primary-hover': theme.palette.primary.dark,
                '--primary-alpha': alpha(theme.palette.primary.main, 0.15),
                '--primary-hover-alpha': alpha(theme.palette.primary.main, 0.1),
            } as CSSProperties),
        [theme.palette.primary]
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
