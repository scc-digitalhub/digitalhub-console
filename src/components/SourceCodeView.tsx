// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { RecordContextProvider } from 'react-admin';
import { JsonSchemaField } from './JsonSchema';

export const SourceCodeView = (props: {
    sourceCode?: any;
    fabSourceCode?: any;
    schema: any;
    uiSchema: any;
}) => {
    const {
        sourceCode,
        fabSourceCode,
        schema: schemaFromProps,
        uiSchema,
    } = props;
    const values = { spec: { source: sourceCode, fab_source: fabSourceCode } };
    const schema = schemaFromProps
        ? JSON.parse(JSON.stringify(schemaFromProps))
        : {};

    if ('properties' in schema) {
        if (sourceCode) {
            schema.properties = {
                source: schemaFromProps?.properties.source,
            };
        }
        if (fabSourceCode) {
            schema.properties = {
                fab_source: schemaFromProps?.properties.fab_source,
            };
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
