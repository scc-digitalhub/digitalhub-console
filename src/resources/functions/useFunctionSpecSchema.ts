// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';
import { required, useResourceContext } from 'react-admin';
import { useSchemaProvider } from '../../common/provider/schemaProvider';
import { stripProperties } from '../../common/jsonSchema/utils';
import { createPathValidator } from '../../features/files/upload/utils';

/**
 * Loads the spec JSON schema for the given function kind and splits out the
 * `path` property, which is rendered separately by StorePathInput.
 *
 * Returns:
 * - `schema` / `uiSchema`: spec schema without `path`, for SpecInput
 * - `pathSchema`: the original `path` property schema (undefined if the kind has no path)
 * - `pathValidators`: validators for the path field, derived from the schema
 */
export const useFunctionSpecSchema = (kind?: string) => {
    const resource = useResourceContext();
    const provider = useSchemaProvider();
    // Tagged with the kind it was loaded for, to ignore results for a previous kind
    const [result, setResult] = useState<{
        kind: string;
        schema: any;
        uiSchema: any;
    }>();

    useEffect(() => {
        let active = true;
        setResult(undefined);
        if (kind && resource && provider) {
            provider
                .get(resource, kind)
                .then(value => {
                    if (active) {
                        setResult({
                            kind,
                            schema: value?.schema,
                            uiSchema: value?.uiSchema,
                        });
                    }
                })
                .catch(() => {
                    if (active) setResult(undefined);
                });
        }
        return () => {
            active = false;
        };
    }, [kind, resource, provider]);

    return useMemo(() => {
        const original = result?.kind === kind ? result?.schema : undefined;
        const pathSchema = original?.properties?.path;
        const pathValidator = pathSchema
            ? createPathValidator(pathSchema)
            : undefined;
        return {
            schema: original ? stripProperties(original, ['path']) : undefined,
            uiSchema: result?.kind === kind ? result?.uiSchema : undefined,
            pathSchema,
            pathValidators: [
                ...(original?.required?.includes('path') ? [required()] : []),
                ...(pathValidator ? [pathValidator] : []),
            ],
        };
    }, [result, kind]);
};
