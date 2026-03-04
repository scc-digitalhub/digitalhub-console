// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler

// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext } from 'react';
import { Session } from 'reachat';

interface ChatContextValue {
    sessions: Session[];
    activeSessionId: string | null;
    setActiveSessionId: (id: string | null) => void;
    updateSession: (session: Session) => void;
    removeSession: (sessionId: string) => void;
    getSessionsByRunId: (runId: string) => Session[];
    ensureSessionForRun: (runId: string) => void;
}

export const ChatContext = createContext<ChatContextValue | undefined>(
    undefined
);

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error(
            'useChatContext must be used inside a ChatContextProvider'
        );
    }
    return context;
};
