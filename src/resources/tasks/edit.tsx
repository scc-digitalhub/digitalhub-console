import {
    Edit,
    Labeled,
    RecordContextProvider,
    SaveButton,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    Toolbar,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { JsonSchemaField, JsonSchemaInput } from '../../components/JsonSchema';
import { getSchemaTask, taskSpecUiSchema } from './types';
import { Stack } from '@mui/system';
import { useState, useEffect } from 'react';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { getFunctionUiSpec } from '../functions/types';
import { checkCpuRequestError } from '../../components/resourceInput/CoreResourceCpuWidget';
import { CoreResourceFieldWidget } from '../../components/resourceInput/CoreResourceFieldWidget';
import { checkGpuRequestError } from '../../components/resourceInput/CoreResourceGpuWidget';
import { checkMemRequestError } from '../../components/resourceInput/CoreResourceMemWidget';
import { KeyValueFieldWidget } from '../../components/resourceInput/KeyValueFieldWidget';
import { VolumeResourceFieldWidget } from '../../components/resourceInput/VolumeResourceFieldWidget';

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
    const translate = useTranslate();

    function customValidate(formData, errors) {
        if (checkCpuRequestError(formData)) {
            errors.k8s.resources.cpu.addError(translate('resources.tasks.errors.requestMinorLimits'));
        }
        if (checkMemRequestError(formData)) {
            errors.k8s.resources.mem.addError(translate('resources.tasks.errors.requestMinorLimits'));
        }
        if (checkGpuRequestError(formData)) {
            errors.k8s.resources.gpu.addError("");
        }
        return errors;
      }
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
                    uiSchema={taskSpecUiSchema}
                    customValidate={customValidate} 
                />
            )}
        </SimpleForm>
    );
};
