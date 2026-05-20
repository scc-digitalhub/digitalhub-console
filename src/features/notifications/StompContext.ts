// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext } from 'react';
import { Client as StompClient } from '@stomp/stompjs';

// StompClientContext: only the STOMP client instance.
// Stable — only changes on reconnect. Consumed by ListBaseLive, ShowBaseLive.
export const StompClientContext = createContext<StompClient | undefined>(
    undefined
);

export const useStompClientContext = () => {
    return useContext(StompClientContext);
};

// StompContext: messages + actions. Re-renders on every message flush.
// Only consumed by NotificationArea.
interface StompContextValue {
    messages: any[];
    remove: (message: any) => void;
    removeAll: (message: any[]) => void;
    markAsRead: (message: any) => void;
    markAllAsRead: (message: any[]) => void;
}

export const StompContext = createContext<StompContextValue | undefined>(
    undefined
);

export const useStompContext = () => {
    const stompContext = useContext(StompContext);
    if (stompContext === undefined) {
        throw new Error('useStompContext must be used inside a StompContext');
    }
    return stompContext;
};
