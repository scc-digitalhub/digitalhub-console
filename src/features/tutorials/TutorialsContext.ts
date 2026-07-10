// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext } from 'react';
import { ListControllerResult } from 'react-admin';

export type TutorialsContextValue = ListControllerResult & {
    selectedTutorial: any;
    selectTutorial: (tutorial: any) => void;
};

export const TutorialsContext = createContext<
    TutorialsContextValue | undefined
>(undefined);

export const useTutorialsContext = () => {
    const tutorialsContext = useContext(TutorialsContext);
    if (tutorialsContext === undefined) {
        throw new Error(
            'useTutorialsContext must be used inside a TutorialsContextProvider'
        );
    }
    return tutorialsContext;
};
