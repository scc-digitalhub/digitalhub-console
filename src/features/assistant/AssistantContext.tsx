// SPDX-FileCopyrightText: © 2026 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    ReactNode,
} from 'react';
import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { useAgentRuntime, UseAgentRuntimeResult } from './useAgentRuntime';

export interface ModalSize {
    width: number;
    height: number;
}

const DEFAULT_MODAL_SIZE: ModalSize = {
    width: 500,
    height: 680,
};

interface AssistantContextType extends UseAgentRuntimeResult {
    isOpen: boolean;
    openAssistant: () => void;
    closeAssistant: () => void;
    toggleAssistant: () => void;
    modalSize: ModalSize;
    setModalSize: React.Dispatch<React.SetStateAction<ModalSize>>;
}

const AssistantContext = createContext<AssistantContextType | undefined>(
    undefined
);

export const AssistantProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [modalSize, setModalSize] = useState<ModalSize>(DEFAULT_MODAL_SIZE);
    const agentRuntime = useAgentRuntime();

    const openAssistant = useCallback(() => setIsOpen(true), []);
    const closeAssistant = useCallback(() => setIsOpen(false), []);
    const toggleAssistant = useCallback(() => setIsOpen(prev => !prev), []);

    const value: AssistantContextType = useMemo(
        () => ({
            ...agentRuntime,
            isOpen,
            openAssistant,
            closeAssistant,
            toggleAssistant,
            modalSize,
            setModalSize,
        }),
        [
            agentRuntime,
            isOpen,
            openAssistant,
            closeAssistant,
            toggleAssistant,
            modalSize,
        ]
    );

    return (
        <AssistantContext.Provider value={value}>
            <AssistantRuntimeProvider runtime={agentRuntime.runtime}>
                {children}
            </AssistantRuntimeProvider>
        </AssistantContext.Provider>
    );
};

export const useAssistant = (): AssistantContextType => {
    const context = useContext(AssistantContext);
    if (!context) {
        throw new Error(
            'useAssistant must be used within an AssistantProvider'
        );
    }
    return context;
};
