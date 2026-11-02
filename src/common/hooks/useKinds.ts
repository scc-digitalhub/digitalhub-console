// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useResourceContext } from 'react-admin';
import { useSchemaProvider } from '../provider/schemaProvider';

export const useKinds = (
    props: {
        resource?: string;
        runtime?: string;
    } = {}
): string[] | undefined => {
    const resource = useResourceContext(props);
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<string[] | undefined>(undefined);

    useEffect(() => {
        if (schemaProvider && resource) {
            schemaProvider
                .kinds(resource, props.runtime)
                .then(res => {
                    if (res) {
                        setKinds(res.sort((a, b) => a.localeCompare(b)));
                    }
                })
                .catch(() => {});
        }
    }, [resource, schemaProvider, props.runtime]);

    return kinds;
};
