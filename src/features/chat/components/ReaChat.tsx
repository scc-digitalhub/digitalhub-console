// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Chat,
    ChatInput,
    SessionMessages,
    SessionMessagePanel,
    SessionMessage,
    MessageQuestion,
    MessageResponse,
    MessageSources,
    MessageActions,
    Conversation,
} from 'reachat';
import { useCallback, useMemo, useRef, useState } from 'react';
import OpenAI from 'openai';
import { theme as reatheme, ThemeProvider } from 'reablocks';
import {
    alpha,
    useTheme,
    CSSProperties,
    Typography,
    IconButton,
} from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';
import { Toolbar, useTranslate } from 'react-admin';
import { ErrorDisplay } from './ErrorDisplay';
import { createChatTheme } from '../chatTheme';
import '../chatTheme.css';
import { useHttpClientProvider } from '../../httpclients/HttpClientContext';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import ClearAllIcon from '@mui/icons-material/ClearAll';

const THROTTLE_MS = 100;

const CriticalErrorFallback = ({ error, retry }: any) => (
    <ErrorDisplay error={error} onRetry={retry} />
);

export interface ReaChatProps {
    modelName: string;
    baseUrl?: string;
    conversations: Conversation[];
    setConversations: (conversations: Conversation[]) => void;
}

export const ReaChat = (props: ReaChatProps) => (
    <ThemeProvider theme={reatheme}>
        <ErrorBoundary FallbackComponent={CriticalErrorFallback}>
            <OpenAIChat {...props} />
        </ErrorBoundary>
    </ThemeProvider>
);

const OpenAIChat = (props: ReaChatProps) => {
    const { modelName, baseUrl, conversations = [], setConversations } = props;
    const httpClientProvider = useHttpClientProvider();
    const translate = useTranslate();
    const theme = useTheme();

    const [loading, setIsLoading] = useState<boolean>(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    //keep conversations in ref to access the latest state in async callbacks without dependency
    const conversationsRef = useRef(conversations);
    conversationsRef.current = conversations;
    const loadingRef = useRef(loading);
    loadingRef.current = loading;
    const openai = useMemo(() => {
        const customFetch = (
            input: string | URL | Request,
            init?: Parameters<typeof fetch>[1]
        ) => {
            let url: string;
            if (typeof input === 'string') {
                url = input;
            } else if (input instanceof URL) {
                url = input.toString();
            } else {
                url = input.url;
            }
            return httpClientProvider.fetch(url, init as any);
        };
        return new OpenAI({
            apiKey: '--- IGNORE ---',
            baseURL: baseUrl,
            dangerouslyAllowBrowser: true,
            fetch: customFetch,
        });
    }, [baseUrl, httpClientProvider]);

    //single static session
    const currentRunId = 'default';
    const session = useMemo(
        () => ({
            id: currentRunId,
            title: `Run ${currentRunId}`,
            createdAt:
                conversations != null && conversations.length > 0
                    ? conversations.at(0)?.createdAt
                    : new Date(),
            updatedAt:
                conversations != null && conversations.length > 0
                    ? conversations.at(-1)?.updatedAt
                    : new Date(),
            conversations,
        }),
        [conversations]
    );

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

            //loading
            setIsLoading(true);
            abortControllerRef.current = new AbortController();

            const baseConversations = isRegeneration
                ? conversationsRef.current.slice(0, -1)
                : conversationsRef.current;

            const conversationId = Date.now().toString();
            const createdAt = new Date();

            const updateSessionState = (
                currentResponse: string,
                isError: boolean = false
            ) => {
                const newConversation = {
                    id: conversationId,
                    question: message,
                    response: currentResponse,
                    isError,
                    createdAt,
                    updatedAt: new Date(),
                };

                setConversations([...baseConversations, newConversation]);
            };

            updateSessionState('');

            let accumulatedResponse = '';
            let lastUpdateTime = 0;

            try {
                const messages = [] as Array<ChatCompletionMessageParam>;
                //restore history except last message if regeneration, which is replaced with the new one
                baseConversations.forEach(conv => {
                    messages.push({ role: 'user', content: conv.question });
                    if (conv.response) {
                        messages.push({
                            role: 'assistant',
                            content: conv.response,
                        });
                    }
                });

                messages.push({ role: 'user', content: message });
                const stream = await openai.chat.completions.create(
                    {
                        model: modelName,
                        messages: messages,
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
        [modelName, openai, setConversations]
    );

    const handleNewMessage = useCallback(
        (message: string) => processMessage(message, false),
        [processMessage]
    );

    const handleRegenerate = useCallback(
        (question: string) => {
            if (!loadingRef.current && question) processMessage(question, true);
        },
        [processMessage]
    );

    const handleDeleteSession = useCallback(() => {
        setConversations([]);
    }, [setConversations]);

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
                sessions={[session]}
                activeSessionId={currentRunId}
                isLoading={loading}
                onSendMessage={handleNewMessage}
                onStopMessage={handleStop}
                onDeleteSession={handleDeleteSession}
                theme={dynamicChatTheme}
                viewType="chat"
                // style={{ maxHeight: '60vh' }}
            >
                <SessionMessagePanel>
                    {/* <SessionMessagesHeader /> */}
                    <Toolbar
                        sx={{
                            background: 'transparent',
                            justifyContent: 'flex-end',
                            gap: 1,
                            mb: 1,
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            {translate('ra.action.clear_array_input')}
                        </Typography>
                        <IconButton
                            aria-label={translate(
                                'ra.action.clear_array_input'
                            )}
                            title={translate('ra.action.clear_array_input')}
                            onClick={() => handleDeleteSession()}
                            disabled={
                                !conversations || conversations.length === 0
                            }
                            size="small"
                        >
                            <ClearAllIcon fontSize="small" />
                        </IconButton>
                    </Toolbar>
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
