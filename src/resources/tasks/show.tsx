import {
    DeleteWithConfirmButton,
    Labeled,
    Show,
    SimpleShowLayout,
    TextField,
    TopToolbar,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { Grid, Stack, Typography } from '@mui/material';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { useEffect, useState } from 'react';
import { JsonSchemaField } from '@dslab/ra-jsonschema-input';
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
            <Labeled>
                <TextField source="key" />
            </Labeled>
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
