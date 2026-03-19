// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export type CreateFlowMode = 'selector' | 'scratch' | 'template';

interface CreateFlowState {
    mode: CreateFlowMode;
    template: any | null;
}

export const useCreateFlow = () => {
    const location = useLocation();
    const hubTemplate = location.state?.hubTemplate;
    const [state, setState] = useState<CreateFlowState>(() => ({
        mode: hubTemplate ? 'template' : 'selector',
        template: hubTemplate ?? null,
    }));

    const startFromScratch = useCallback(() => {
        setState({ mode: 'scratch', template: null });
    }, []);

    const startFromTemplate = useCallback((template: any) => {
        setState({ mode: 'template', template });
    }, []);

    const reset = useCallback(() => {
        setState({ mode: 'selector', template: null });
    }, []);

    return {
        mode: state.mode,
        template: state.template,
        isSelector: state.mode === 'selector',
        isFromTemplate: state.mode === 'template',
        startFromScratch,
        startFromTemplate,
        reset,
    };
};