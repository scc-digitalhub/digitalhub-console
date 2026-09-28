// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import deepEqual from 'deep-is';
import { useEffect, useState } from 'react';
import { InputProps, useRecordContext, useResourceContext } from 'react-admin';
import { useWatch } from 'react-hook-form';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { JsonSchemaInput } from './JsonSchema';
import { get } from 'lodash';
import { EmptyMessage } from '../../components/layout/EmptyMessage';

export const SpecInput = (
    props: InputProps & {
        source: string;
        onDirty?: (state: boolean) => void;
        schema?: any;
        uiSchema?: any;
        kind?: string;
        label?: string;
        helperText?: string;
    }
) => {
    const {
        source,
        onDirty,
        schema: schemaProp,
        uiSchema: uiSchemaProp,
        kind,
        label = 'fields.spec.title',
        helperText,
    } = props;
    const resource = useResourceContext();
    const record = useRecordContext();
    const value = useWatch({ name: source, defaultValue: {} });
    const schemaProvider = useSchemaProvider();
    const [schema, setSchema] = useState<any>(schemaProp);
    const [uiSchema, setUiSchema] = useState<any>(uiSchemaProp);

    useEffect(() => {
        if (!kind) {
            return;
        }
        if (schemaProp) {
            setSchema(schemaProp);
        }
        if (uiSchemaProp) {
            setUiSchema(uiSchemaProp);
        }
        if (schemaProvider && resource && (!schema || !uiSchema)) {
            schemaProvider.get(resource, kind).then(s => {
                if (!schema) {
                    setSchema(s?.schema);
                }
                if (!uiSchema) {
                    setUiSchema(s?.uiSchema);
                }
            });
        }
    }, [kind, schemaProvider, schemaProp, uiSchemaProp, resource]);

    useEffect(() => {
        if (onDirty && record) {
            onDirty(!deepEqual(get(record, source, {}), value));
        }
    }, [onDirty, record, source, value]);

    if (!kind || !schema) {
        return <EmptyMessage message="resources.common.emptySpec" />;
    }

    const jsonSchema = { ...schema, title: label };
    if (helperText !== undefined) {
        jsonSchema['description'] = helperText;
    }
    return (
        <JsonSchemaInput
            source={source}
            schema={jsonSchema}
            uiSchema={uiSchema}
        />
    );
};
