import { JsonSchemaField } from '@dslab/ra-jsonschema-input';
import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    Labeled,
    SimpleShowLayout,
    TextField,
    useRecordContext,
    useResourceContext,
} from 'react-admin';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { getFunctionUiSpec } from '../functions/types';

export const TaskShowComponent = () => {
    const resource = useResourceContext();
    const record = useRecordContext();
    const schemaProvider = useSchemaProvider();
    const [spec, setSpec] = useState<any>();
    const kind = record?.kind || null;

    useEffect(() => {
        if (schemaProvider && record) {
            schemaProvider.get(resource, kind).then(s => setSpec(s));
        }
    }, [record, schemaProvider]);

    return (
        <SimpleShowLayout>
            <Stack direction={'row'} spacing={3}>
                <Labeled>
                    <TextField source="name" />
                </Labeled>

                <Labeled>
                    <TextField source="kind" />
                </Labeled>
            </Stack>

            <TextField source="key" />

            {spec && (
                <JsonSchemaField
                    source="spec"
                    schema={spec.schema}
                    uiSchema={getFunctionUiSpec(kind)}
                    label={false}
                />
            )}
        </SimpleShowLayout>
    );
};
