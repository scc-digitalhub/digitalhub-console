// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { useCallback } from 'react';
import { useFileContext } from '../FileContext';

type GetStoresFunction = () => Promise<string[]>;

export const useGetStores = (): GetStoresFunction => {
    const { provider } = useFileContext();
    const { root } = useRootSelector();

    return useCallback(() => {
        return provider.stores({ meta: { root } });
    }, [provider, root]);
};
