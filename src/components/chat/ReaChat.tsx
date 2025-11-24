// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler

// SPDX-License-Identifier: Apache-2.0

import {
    Chat,
    ChatInput,
    SessionMessages,
    SessionMessagePanel,
    SessionMessagesHeader,
    Session,
    SessionGroups,
    SessionsList,
    NewSessionButton,
} from 'reachat';
import { useCallback, useEffect, useRef, useState } from 'react';
import './chatTheme.css';
import OpenAI from 'openai';
import { theme as reatheme, ThemeProvider } from 'reablocks';
import { chatTheme } from './chatTheme';
import { FilePreviewBanner, StyledAttachIcon } from './ChatFileComponents';

interface FileData {
    name: string;
    size: number;
    type: string;
    url: string;
}
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt', '.csv', '.png', '.jpg'];
const API_KEY: string =
    (globalThis as any).VITE_OPENAI_API_KEY ||
    import.meta.env.VITE_OPENAI_API_KEY ||
    '';
const API_BASE_URL: string =
    (globalThis as any).VITE_OPENAI_BASE_URL ||
    import.meta.env.VITE_OPENAI_BASE_URL ||
    '';

export const ReaChat = () => {
    return (
        <ThemeProvider theme={reatheme}>
            <OpenAIChat />
        </ThemeProvider>
    );
};

const OpenAIChat = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setIsLoading] = useState<boolean>(false);
    const [activeSessionId, setActiveSessionId] = useState<string>(
        Date.now().toString()
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const openai = useRef<OpenAI | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (API_KEY) {
            openai.current = new OpenAI({
                apiKey: API_KEY,
                baseURL: API_BASE_URL,
                dangerouslyAllowBrowser: true, // For demo purposes only
            });
        }
    }, []);

    const handleNewSession = useCallback(() => {
        setActiveSessionId(Date.now().toString());
        setSelectedFile(null);
    }, []);

    const handleSessionSelect = useCallback(
        (id: string) => setActiveSessionId(id),
        []
    );

    const handleDeleteSession = useCallback(
        (sessionId: string) => {
            setSessions(prev => prev.filter(s => s.id !== sessionId));
            if (sessionId === activeSessionId) handleNewSession();
        },
        [activeSessionId, handleNewSession]
    );

    const handleStop = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsLoading(false);
    }, []);

    const handleNewMessage = useCallback(
        async (message: string) => {
            if (!openai.current)
                return console.error('OpenAI client not initialized');

            if (!message) return;

            let fileData: FileData | undefined;
            if (selectedFile) {
                fileData = {
                    name: selectedFile.name,
                    size: selectedFile.size,
                    type: selectedFile.type,
                    url: URL.createObjectURL(selectedFile),
                };
            }

            setIsLoading(true);
            setSelectedFile(null);
            abortControllerRef.current = new AbortController();

            const currentSessionId = activeSessionId;
            const conversationId = Date.now().toString();

            const updateSessionState = (currentResponse: string) => {
                setSessions(prevSessions => {
                    const newConversation = {
                        title: message,
                        id: conversationId,
                        question: message,
                        response: currentResponse,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        ...(fileData ? { files: [fileData] } : {}),
                    };

                    const sessionIndex = prevSessions.findIndex(
                        s => s.id === currentSessionId
                    );

                    if (sessionIndex === -1) {
                        return [
                            {
                                id: currentSessionId,
                                title: message,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                conversations: [newConversation],
                            },
                            ...prevSessions,
                        ];
                    }

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

                    updatedSessions[sessionIndex] = {
                        ...session,
                        conversations,
                    };
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
                    {
                        signal: abortControllerRef.current.signal,
                    }
                );

                let accumulatedResponse = '';

                let lastUpdateTime = 0;
                const THROTTLE_MS = 100; // We update UI max every 100ms

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
                if (error.name === 'AbortError') {
                    console.log('Stream stopped by user.');
                } else {
                    console.error('Error calling OpenAI API:', error);
                }
            } finally {
                setIsLoading(false);
                abortControllerRef.current = null;
            }
        },
        [activeSessionId, selectedFile]
    );

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
            onFileUpload={setSelectedFile}
            onStopMessage={handleStop}
        >
            <SessionsList>
                <NewSessionButton newSessionText="New Chat" />
                <SessionGroups />
            </SessionsList>

            <SessionMessagePanel>
                <SessionMessagesHeader />
                <SessionMessages />
                {selectedFile && (
                    <FilePreviewBanner
                        file={selectedFile}
                        onRemove={() => setSelectedFile(null)}
                    />
                )}
                <ChatInput
                    placeholder="Type your message..."
                    allowedFiles={ALLOWED_EXTENSIONS}
                    attachIcon={<StyledAttachIcon hasFile={!!selectedFile} />}
                />
            </SessionMessagePanel>
        </Chat>
    );
};
