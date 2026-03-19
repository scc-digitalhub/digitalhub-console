// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Stack } from '@mui/material';
import {
    ArrayField,
    Labeled,
    SingleFieldList,
    TextField,
    useRecordContext,
} from 'react-admin';
import { useGetSchemas } from '../../common/jsonSchema/schemaController';
import { getSpecSchema, getUiSchema } from './utils';
import { IdField } from '../../common/components/fields/IdField';
import { JsonSchemaField } from '../../common/jsonSchema/components/JsonSchema';

export const ExtensionsField = (props: {
    resource?: string;
    record?: any;
    source?: string;
}) => {
    const { source = 'extensions' } = props;
    const record = useRecordContext();

    //check if any extension is available
    const { data: schemas, isLoading } = useGetSchemas('extensions');

    const field = record ? record[source] : null;
    if (!field || isLoading || !schemas) {
        return <></>;
    }

    return (
        <ArrayField source={source} label="fields.extensions.title">
            <SingleFieldList linkType={false}>
                <ExtensionsFieldItem schemas={schemas} />
            </SingleFieldList>
        </ArrayField>
    );
};

export const ExtensionsFieldItem = (props: { schemas: any[] }) => {
    const { schemas = [] } = props;
    const record = useRecordContext();

    const kinds = schemas
        ?.map(s => ({
            id: s.kind,
            name: s.kind,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    if (!record || !schemas) {
        return <></>;
    }

    const buildUiSchema = (schemas: any[], kind: string) => {
        let uischema = getUiSchema(schemas, kind);
        if (!uischema) {
            return {};
        }

        //replace all html fields with html-preview widget
        Object.keys(uischema).forEach(key => {
            if (uischema[key]['ui:widget'] === 'html') {
                uischema[key]['ui:widget'] = 'html-preview';
            }
            if (uischema[key]['ui:widget'] === 'json') {
                uischema[key]['ui:widget'] = 'json-preview';
            }
        });
        console.log('uischema', uischema);
        return uischema;
    };

    return (
        <Box
            sx={{
                borderBottom: 2,
                borderColor: 'divider',
                padding: 2,
                marginBottom: 2,
            }}
        >
            <Stack direction={'row'} spacing={3}>
                <Labeled>
                    <TextField source="kind" />
                </Labeled>

                <Labeled>
                    <IdField source="id" />
                </Labeled>
            </Stack>

            <Labeled>
                <IdField source="name" />
            </Labeled>

            <JsonSchemaField
                source="spec"
                schema={getSpecSchema(schemas, record.kind)}
                uiSchema={buildUiSchema(schemas, record.kind)}
                label={false}
            />
        </Box>
    );
};
