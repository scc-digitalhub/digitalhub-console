// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useResourceContext } from 'react-admin';
import { useSchemaProvider } from '../provider/schemaProvider';

export const useKinds = (): string[] | undefined => {
    const resource = useResourceContext();
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<string[] | undefined>(undefined);

    useEffect(() => {
        if (schemaProvider && resource) {
            schemaProvider
                .kinds(resource)
                .then(res => {
                    if (res) {
                        setKinds(res.sort((a, b) => a.localeCompare(b)));
                    }
                })
                .catch(() => {});
        }
    }, [resource, schemaProvider]);

    return kinds;
};
