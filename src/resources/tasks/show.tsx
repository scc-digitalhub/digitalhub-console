import {
    Labeled,
    SimpleShowLayout,
    TextField,
    useRecordContext,
    useResourceContext,
} from 'react-admin';
import { Stack } from '@mui/material';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { useEffect, useState } from 'react';
import { JsonSchemaField } from '../../components/JsonSchema';
import { getTaskSpec } from './types';

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
            <Labeled>
                <TextField source="key" />
            </Labeled>
            {spec && (
                <JsonSchemaField
                    source="spec"
                    schema={{...spec.schema, title:'Spec'}}
                    uiSchema={getTaskSpec(spec.schema)}
                    label={false}
                />
            )}
        </SimpleShowLayout>
    );
};
