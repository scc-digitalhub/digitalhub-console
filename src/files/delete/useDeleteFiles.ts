// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { useCallback } from 'react';
import { useFileContext } from '../FileContext';

type DeleteFilesFunction = (paths: string[]) => Promise<void>;

export const useDeleteFiles = (): DeleteFilesFunction => {
    const { provider } = useFileContext();
    const { root } = useRootSelector();

    return useCallback(
        paths => {
            return provider.deleteFiles({ meta: { root } }, paths);
        },
        [provider, root]
    );
};
