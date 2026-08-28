// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useState, useRef, useEffect } from 'react';
import {
    mapType,
    useSchemaProvider,
} from '../../common/provider/schemaProvider';
import { randomId } from '../../common/utils/helpers';
import { useResourceContext } from 'react-admin';

export const getSpecSchema = (schemas: any[], kind: string | undefined) => {
    return schemas ? schemas.find(s => s.kind === kind)?.schema : {};
};

export const getUiSchema = (schemas: any[], kind: string | undefined) => {
    return schemas ? schemas.find(s => s.kind === kind)?.uiSchema : {};
};

export const useGetExtensions = (
    resource?: string
): { data?: any[]; isLoading?: boolean; error?: any } => {
    const schemaProvider = useSchemaProvider();
    const [schemas, setSchemas] = useState<any[]>();
    const resourceName = useResourceContext({ resource: resource });

    const isLoading = useRef(true);
    const error = useRef<any>(null);

    useEffect(() => {
        if (schemaProvider) {
            isLoading.current = true;
            schemaProvider
                .list('extensions')
                .then(res => {
                    let ll = res || [];
                    if (resourceName) {
                        const rid = mapType(resourceName).toUpperCase();

                        ll = ll.filter(s => {
                            if (s.appliesTo) {
                                return s.appliesTo.includes(rid);
                            }

                            if (s.appliesNotTo) {
                                return !s.appliesNotTo.includes(rid);
                            }

                            return true;
                        });
                    }

                    setSchemas(ll);
                    isLoading.current = false;
                })
                .catch(e => (error.current = e));
        }
    }, [resource, schemaProvider]);

    return {
        data: schemas,
        isLoading: isLoading.current,
        error: error.current,
    };
};
