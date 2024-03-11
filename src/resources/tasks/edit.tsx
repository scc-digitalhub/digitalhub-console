import {
    Edit,
    Labeled,
    RecordContextProvider,
    SaveButton,
    SimpleForm,
    TextField,
    Toolbar,
    useRecordContext,
    useResourceContext,
} from 'react-admin';
import { JsonSchemaField, JsonSchemaInput } from '@dslab/ra-jsonschema-input';
import { getSchemaTask } from './types';
import { Stack } from '@mui/system';
import { useState, useEffect } from 'react';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { getFunctionUiSpec } from '../functions/types';

export interface TaskProp {
    record?: any;
}

const TaskToolbar = () => {
    return (
        <Toolbar>
            <SaveButton />
        </Toolbar>
    );
};

export const TaskEditComponent = () => {
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
        <SimpleForm toolbar={<TaskToolbar />}>
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
                <JsonSchemaInput
                    source="spec"
                    schema={spec.schema}
                    label={false}
                />
            )}
        </SimpleForm>
    );
};

//prendere props dall'esterno, incluse le opzioni <TaskEdit queryOption={query options come function=dbt://prj1/funct2:2de05c83-4831-46a7-8929-9264e6889185}>
/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
export const TaskEdit = () => {
    const recordProp = useRecordContext();
    const kind = recordProp?.kind || undefined;
    const schema = getSchemaTask(recordProp?.kind);

    console.log(kind);
    return (
        <Edit>
            <RecordContextProvider value={recordProp}>
                <SimpleForm toolbar={<TaskToolbar />}>
                    <TextField source="kind"></TextField>
                    <JsonSchemaInput source="spec" schema={schema} />
                </SimpleForm>
            </RecordContextProvider>
        </Edit>
    );
};
