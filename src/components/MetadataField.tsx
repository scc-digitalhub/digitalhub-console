import { Box } from '@mui/material';
import { createMetadataViewUiSchema } from '../common/schemas';
import { useGetSchemas } from '../controllers/schemaController';
import { useRecordContext } from 'react-admin';
import { JsonSchemaField } from './JsonSchema';

export const MetadataField = ({ prompt }: any) => {
    const record = useRecordContext();
    const { data: schemas, isLoading, error } = useGetSchemas('metadata');
    const metadataKinds = schemas
        ? schemas.map(s => ({
              id: s.kind,
              name: s.kind,
              schema: s.schema,
          }))
        : [];
    return (
        <Box>
            {metadataKinds?.map(r => {
                return (
                    <JsonSchemaField
                        key={r.id}
                        source="metadata"
                        schema={r.schema}
                        uiSchema={{
                            ...createMetadataViewUiSchema(record?.metadata),
                            'ui:expandable': 'metadata.base' !== r.id,
                        }}
                        label={false}
                    />
                );
            })}
        </Box>
    );
};
