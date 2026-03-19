// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { RecordContextProvider } from 'react-admin';
import { JsonSchemaField } from '../../../common/jsonSchema/components/JsonSchema';
import { JsonSchemaFieldProps } from '@dslab/ra-jsonschema-input';

export const FilteredJsonSchemaField = (
    props: FilteredJsonSchemaFieldProps
) => {
    const { record, sourceName, fields, schema: schemaFromProps, uiSchema } = props;
    const schema = schemaFromProps
        ? JSON.parse(JSON.stringify(schemaFromProps))
        : {};

    if ('properties' in schema) {
        schema.properties = {};
        fields.forEach(
            f => (schema.properties[f] = schemaFromProps?.['properties'][f])
        );
    }

    return (
        <RecordContextProvider value={record}>
            <JsonSchemaField
                source={sourceName}
                schema={{ ...schema, title: '' }}
                uiSchema={uiSchema}
                label={false}
            />
        </RecordContextProvider>
    );
};

type FilteredJsonSchemaFieldProps = Pick<
    JsonSchemaFieldProps,
    'schema' | 'uiSchema'
> & {
    record: Record<string, any>;
    /**
     * List of fields that will be picked from schema
     */
    fields: string[];
    /**
     * Source inside record (not using FieldProps.source to avoid label)
     */
    sourceName: string;
};
