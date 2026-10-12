// SPDX-FileCopyrightText: © 2026 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

export const getAgentUrl = (): string => {
    return (
        (globalThis as any).REACT_APP_AGENT_URL ||
        (process.env.REACT_APP_AGENT_URL as string) ||
        (import.meta as any).env?.VITE_AGENT_URL ||
        'http://localhost:2024'
    );
};

const THREAD_STORAGE_KEY = 'dh.agent.thread_id';

export const getStoredThreadId = (): string | undefined => {
    try {
        const stored = localStorage.getItem(THREAD_STORAGE_KEY);
        if (stored && stored.trim()) {
            return stored.trim();
        }
    } catch {
        // LocalStorage not available or blocked
    }
    return undefined;
};

export const setStoredThreadId = (threadId: string): void => {
    try {
        localStorage.setItem(THREAD_STORAGE_KEY, threadId.trim());
    } catch {
        // Ignore storage error
    }
};

export const clearStoredThreadId = (): void => {
    try {
        localStorage.removeItem(THREAD_STORAGE_KEY);
    } catch {
        // Ignore storage error
    }
};

const MESSAGES_STORAGE_KEY_PREFIX = 'dh.agent.messages.';

export const getStoredMessages = (threadId: string): any[] => {
    try {
        const stored = localStorage.getItem(
            MESSAGES_STORAGE_KEY_PREFIX + threadId
        );
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch {
        // LocalStorage not available or blocked
    }
    return [];
};

export const setStoredMessages = (threadId: string, messages: any[]): void => {
    try {
        localStorage.setItem(
            MESSAGES_STORAGE_KEY_PREFIX + threadId,
            JSON.stringify(messages)
        );
    } catch {
        // Ignore storage error
    }
};

export const clearStoredMessages = (threadId: string): void => {
    try {
        localStorage.removeItem(MESSAGES_STORAGE_KEY_PREFIX + threadId);
    } catch {
        // Ignore storage error
    }
};
