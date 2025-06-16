// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { useEffect, useRef } from 'react';
import {
    AdminChildren,
    getStorage,
    useRemoveFromStore,
} from 'react-admin';
import { isEqual } from 'lodash';

export const StoreResetter = ({ children }: { children?: AdminChildren }) => {
    const { root } = useRootSelector();
    const remove = useRemoveFromStore();
    const prevRoot = useRef<string | null>(null);

    useEffect(() => {
        if (!isEqual(root, prevRoot.current)) {
            console.log('resetting selection state');
            prevRoot.current = root ?? null;

            //clear selection state
            const storageKeys = Object.keys(getStorage());
            storageKeys.forEach(k => {
                if (k.endsWith('selectedIds')) {
                    const keyParts = k.split('.');
                    remove(`${keyParts[1]}.selectedIds`);
                }
            });
        }
    }, [remove, root]);

    return <>{children}</>;
};
