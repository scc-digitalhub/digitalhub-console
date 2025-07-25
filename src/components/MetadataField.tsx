// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box } from '@mui/material';
import { createMetadataViewUiSchema } from '../common/schemas';
import { useGetSchemas } from '../controllers/schemaController';
import { useRecordContext } from 'react-admin';
import { JsonSchemaField } from './JsonSchema';
import { Fragment } from 'react/jsx-runtime';

export const MetadataField = () => {
    const record = useRecordContext();
    const { data: schemas } = useGetSchemas('metadatas');
    const metadataKinds = schemas
        ? schemas
              .map(s => ({
                  id: s.kind,
                  name: s.kind,
                  schema: s.schema,
              }))
              .sort((a, b) =>
                  a.id === 'metadata.base'
                      ? -1
                      : b.id === 'metadata.base'
                      ? 1
                      : a.id.localeCompare(b.id)
              )
        : [];
    return (
        <Box>
            {metadataKinds?.map(r => {
                const uiSchema = createMetadataViewUiSchema(
                    record?.metadata,
                    r.schema,
                    r.id
                );

                //hide if no fields are visibile
                if (uiSchema['ui:hide']) {
                    return <Fragment key={r.id}></Fragment>;
                }

                return (
                    <JsonSchemaField
                        key={r.id}
                        source="metadata"
                        schema={{ ...r.schema, title: '' }}
                        uiSchema={uiSchema}
                        label={false}
                    />
                );
            })}
        </Box>
    );
};
