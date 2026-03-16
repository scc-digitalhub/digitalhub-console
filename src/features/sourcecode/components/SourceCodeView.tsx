// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { RecordContextProvider } from 'react-admin';
import { JsonSchemaField } from '../../../common/jsonSchema/components/JsonSchema';

export const SourceCodeView = (props: SourceCodeViewProps) => {
    const {
        field,
        code,
        additionalFields,
        schema: schemaFromProps,
        uiSchema,
    } = props;
    const values = {
        spec: { [field]: code, ...additionalFields },
    };
    const schema = schemaFromProps
        ? JSON.parse(JSON.stringify(schemaFromProps))
        : {};

    if ('properties' in schema) {
        schema.properties = { [field]: schemaFromProps?.properties[field] };
        if (additionalFields) {
            Object.keys(additionalFields).forEach(
                k => (schema.properties[k] = schemaFromProps?.properties[k])
            );
        }
    }

    return (
        <RecordContextProvider value={values}>
            {schemaFromProps && (
                <JsonSchemaField
                    source="spec"
                    schema={{ ...schema, title: '' }}
                    uiSchema={uiSchema}
                    label={false}
                />
            )}
        </RecordContextProvider>
    );
};

type SourceCodeViewProps = {
    /**
     * Name of the code field inside schema
     */
    field: string;
    /**
     * Code
     */
    code: any;
    /**
     * Fields to display in addition to code
     */
    additionalFields?: any;
    schema: any;
    uiSchema: any;
};
