// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext } from 'react';
import { Client as StompClient } from '@stomp/stompjs';

interface StompContextValue {
    client: StompClient;
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
