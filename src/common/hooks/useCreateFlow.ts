// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export type CreateFlowMode = 'selector' | 'scratch' | 'template';

interface CreateFlowState {
    mode: CreateFlowMode;
    childDocs: any[];
    template: any | null;
}

export const useCreateFlow = () => {
    const location = useLocation();
    const hubTemplate = location.state?.hubTemplate;
    const { childDocs, ...cleanTemplate } = hubTemplate ?? {};

    const [state, setState] = useState<CreateFlowState>(() => ({
        mode: hubTemplate ? 'template' : 'selector',
        template: hubTemplate ? cleanTemplate : null,
        childDocs: childDocs ?? [],
    }));

    const startFromScratch = useCallback(() => {
        setState({ mode: 'scratch', template: null, childDocs: [] });
    }, []);

    const startFromTemplate = useCallback((template: any) => {
        setState({ mode: 'template', template, childDocs: [] });
    }, []);

    const reset = useCallback(() => {
        setState({ mode: 'selector', template: null, childDocs: [] });
    }, []);

    return {
        mode: state.mode,
        template: state.template,
        childDocs: state.childDocs,
        isSelector: state.mode === 'selector',
        isFromTemplate: state.mode === 'template',
        startFromScratch,
        startFromTemplate,
        reset,
    };
};