// SPDX-FileCopyrightText: © 2026 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { RootSelectorContext } from '@dslab/ra-root-selector';
import { Client } from '@langchain/langgraph-sdk';
import { useLangGraphRuntime } from '@assistant-ui/react-langgraph';
import type {
    RemoteThreadListAdapter,
    RemoteThreadMetadata,
} from '@assistant-ui/core';
import {
    getAgentUrl,
    getStoredThreadId,
    setStoredThreadId,
    clearStoredThreadId,
    getStoredMessages,
    setStoredMessages,
    clearStoredMessages,
} from './config';

export interface UseAgentRuntimeResult {
    runtime: ReturnType<typeof useLangGraphRuntime>;
    agentUrl: string;
    currentThreadId?: string;
    resetThread: () => void;
    currentProject?: string;
}

export const extractProjectFromPath = (
    pathname: string
): string | undefined => {
    const match = pathname.match(/\/-\/([^/?#]+)/);
    if (!match || !match[1]) return undefined;
    const project = decodeURIComponent(match[1]).trim();
    return project || undefined;
};

export const normalizeLangChainMessage = (msg: any): any => {
    if (!msg || typeof msg !== 'object') return msg;

    let type = msg.type;
    const role = msg.role;

    if (
        type === 'AIMessage' ||
        type === 'AIMessageChunk' ||
        role === 'assistant'
    ) {
        type = 'ai';
    } else if (type === 'HumanMessage' || role === 'user') {
        type = 'human';
    } else if (type === 'ToolMessage' || role === 'tool') {
        type = 'tool';
    } else if (type === 'SystemMessage' || role === 'system') {
        type = 'system';
    } else if (type === 'RemoveMessage') {
        type = 'remove';
    } else if (!type && role) {
        type = role === 'user' ? 'human' : role === 'assistant' ? 'ai' : role;
    }

    if (
        !type ||
        (type !== 'human' &&
            type !== 'ai' &&
            type !== 'tool' &&
            type !== 'system' &&
            type !== 'remove')
    ) {
        type = 'human';
    }

    return {
        ...msg,
        type,
        id:
            msg.id ||
            (typeof crypto !== 'undefined' && crypto.randomUUID
                ? crypto.randomUUID()
                : `msg_${Date.now()}_${Math.random()
                      .toString(36)
                      .substring(2, 9)}`),
    };
};

export const useAgentRuntime = (): UseAgentRuntimeResult => {
    const agentUrl = useMemo(() => getAgentUrl(), []);
    const [currentThreadId, setCurrentThreadId] = useState<string | undefined>(
        () => getStoredThreadId()
    );

    const rootContext = useContext(RootSelectorContext);
    const location = useLocation();
    const currentProject = useMemo(() => {
        return rootContext?.root || extractProjectFromPath(location.pathname);
    }, [rootContext?.root, location.pathname]);

    const currentProjectRef = useRef<string | undefined>(currentProject);
    useEffect(() => {
        currentProjectRef.current = currentProject;
    }, [currentProject]);

    const client = useMemo(() => {
        return new Client({
            apiUrl: agentUrl,
        });
    }, [agentUrl]);

    const streamCallback = useMemo(() => {
        return async (messages: any[], config: any) => {
            const { externalId } = await config.initialize();
            if (!externalId)
                throw new Error('Thread has not been initialized.');

            const proj = currentProjectRef.current;
            const inputState = config.state || {};

            const payload: any = {
                input: {
                    ...inputState,
                    ...(messages.length ? { messages } : {}),
                    project: proj || null,
                },
                project: proj || null,
                streamMode: ['messages', 'updates'],
                signal: config.abortSignal,
                onDisconnect: 'cancel',
                ...(config.command != null && { command: config.command }),
                ...(config.checkpointId != null && {
                    checkpoint: { checkpoint_id: config.checkpointId },
                }),
                config: {
                    ...(config.runConfig || {}),
                    configurable: {
                        ...(config.runConfig?.configurable || {}),
                        project: proj || null,
                    },
                },
            };

            return client.runs.stream(externalId, 'agent', payload);
        };
    }, [client]);

    const threadListAdapter = useMemo<RemoteThreadListAdapter>(() => {
        return {
            list: async () => {
                const storedId = getStoredThreadId();
                try {
                    const threads = await client.threads.search({ limit: 20 });
                    if (Array.isArray(threads) && threads.length > 0) {
                        const list: RemoteThreadMetadata[] = threads.map(t => ({
                            remoteId: t.thread_id,
                            externalId: t.thread_id,
                            status: 'regular' as const,
                            lastMessageAt: t.updated_at
                                ? new Date(t.updated_at)
                                : undefined,
                            title: (t.metadata as any)?.title,
                        }));
                        if (
                            storedId &&
                            !list.some(t => t.remoteId === storedId)
                        ) {
                            list.unshift({
                                remoteId: storedId,
                                externalId: storedId,
                                status: 'regular' as const,
                            });
                        }
                        return { threads: list };
                    }
                } catch (err) {
                    console.warn(
                        'Failed to list threads via LangGraph SDK:',
                        err
                    );
                }

                if (storedId) {
                    return {
                        threads: [
                            {
                                remoteId: storedId,
                                externalId: storedId,
                                status: 'regular' as const,
                            },
                        ],
                    };
                }
                return { threads: [] };
            },
            fetch: async (threadId: string) => {
                try {
                    const thread = await client.threads.get(threadId);
                    return {
                        remoteId: thread.thread_id,
                        externalId: thread.thread_id,
                        status: 'regular' as const,
                        lastMessageAt: thread.updated_at
                            ? new Date(thread.updated_at)
                            : undefined,
                        title: (thread.metadata as any)?.title,
                    };
                } catch {
                    return {
                        remoteId: threadId,
                        externalId: threadId,
                        status: 'regular' as const,
                    };
                }
            },
            initialize: async (threadId: string) => {
                try {
                    const thread = await client.threads.create();
                    const newId = thread?.thread_id;
                    if (newId) {
                        setCurrentThreadId(newId);
                        setStoredThreadId(newId);
                        return { remoteId: newId, externalId: newId };
                    }
                } catch (err) {
                    console.warn(
                        'Failed to create thread via LangGraph SDK:',
                        err
                    );
                }
                const fallbackId = threadId || `thread_${Date.now()}`;
                setCurrentThreadId(fallbackId);
                setStoredThreadId(fallbackId);
                return { remoteId: fallbackId, externalId: fallbackId };
            },
            rename: async () => {},
            archive: async () => {},
            unarchive: async () => {},
            delete: async (remoteId: string) => {
                try {
                    await client.threads.delete(remoteId);
                } catch (err) {
                    console.warn(
                        'Failed to delete thread via LangGraph SDK:',
                        err
                    );
                }
                clearStoredMessages(remoteId);
                if (getStoredThreadId() === remoteId) {
                    clearStoredThreadId();
                    setCurrentThreadId(undefined);
                }
            },
            generateTitle: async () => {
                return new ReadableStream({
                    start(controller) {
                        controller.close();
                    },
                });
            },
        };
    }, [client]);

    const runtime = useLangGraphRuntime({
        threadId: currentThreadId,
        onThreadIdChange: newId => {
            setCurrentThreadId(newId);
            if (newId) {
                setStoredThreadId(newId);
            } else {
                clearStoredThreadId();
            }
        },
        stream: streamCallback,
        unstable_threadListAdapter: threadListAdapter,
        load: async threadId => {
            try {
                const state = await client.threads.getState(threadId);
                const rawMsgs = (state?.values as any)?.messages ?? [];
                if (Array.isArray(rawMsgs) && rawMsgs.length > 0) {
                    const normalized = rawMsgs.map(normalizeLangChainMessage);
                    setStoredMessages(threadId, normalized);
                    return {
                        messages: normalized,
                        interrupts: [],
                    };
                }
            } catch (err) {
                console.warn(
                    'Failed to load thread state via LangGraph SDK:',
                    err
                );
            }
            const cached = getStoredMessages(threadId);
            return {
                messages: cached,
                interrupts: [],
            };
        },
        eventHandlers: {
            onValues: (values: any) => {
                const msgs = values?.messages;
                const activeId = currentThreadId || getStoredThreadId();
                if (activeId && Array.isArray(msgs) && msgs.length > 0) {
                    const normalized = msgs.map(normalizeLangChainMessage);
                    setStoredMessages(activeId, normalized);
                }
            },
        },
        unstable_allowCancellation: true,
    });

    const resetThread = useCallback(() => {
        const id = currentThreadId || getStoredThreadId();
        if (id) {
            clearStoredMessages(id);
        }
        clearStoredThreadId();
        setCurrentThreadId(undefined);
        runtime.threads.switchToNewThread().catch(() => {});
    }, [currentThreadId, runtime]);

    return {
        runtime,
        agentUrl,
        currentThreadId,
        resetThread,
        currentProject,
    };
};
