// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler

// SPDX-License-Identifier: Apache-2.0

import { ReactElement, useEffect, useState, useCallback } from 'react';
import { Session } from 'reachat';
import { ChatContext } from './ChatContext';

const STORAGE_KEY = 'chat-sessions';

const loadSavedSessions = (): Session[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved, (key, value) => {
                if (key === 'createdAt' || key === 'updatedAt') {
                    return new Date(value);
                }
                return value;
            });
        }
    } catch (e) {
        console.error('Failed to load chat sessions', e);
    }
    return [];
};

export const ChatContextProvider = ({
    children,
}: {
    children: ReactElement;
}) => {
    const [sessions, setSessions] = useState<Session[]>(loadSavedSessions);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

    useEffect(() => {
        if (sessions.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
        }
    }, [sessions]);

    const updateSession = useCallback((updatedSession: Session) => {
        setSessions(prev => {
            const index = prev.findIndex(s => s.id === updatedSession.id);
            if (index === -1) {
                return [...prev, updatedSession];
            }
            const newSessions = [...prev];
            newSessions[index] = updatedSession;
            return newSessions;
        });
    }, []);

    const removeSession = useCallback((sessionId: string) => {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
    }, []);

    const getSessionsByRunId = useCallback(
        (runId: string) => {
            return sessions.filter(s => s.id === runId);
        },
        [sessions]
    );

    const ensureSessionForRun = useCallback((runId: string) => {
        setSessions(prev => {
            const exists = prev.find(s => s.id === runId);
            if (exists) return prev;

            const newSession: Session = {
                id: runId,
                title: `Run ${runId}`,
                createdAt: new Date(),
                updatedAt: new Date(),
                conversations: [],
            };
            return [...prev, newSession];
        });
    }, []);

    const contextValue = {
        sessions,
        activeSessionId,
        setActiveSessionId,
        updateSession,
        removeSession,
        getSessionsByRunId,
        ensureSessionForRun,
    };

    return (
        <ChatContext.Provider value={contextValue}>
            {children}
        </ChatContext.Provider>
    );
};
