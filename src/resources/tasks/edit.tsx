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
import {  ErrorListProps } from "@rjsf/utils";

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
    
      
    function customValidate(formData, errors,uiSchema) {
        if (checkCpuRequestError(formData)) {
            errors.k8s.resources.cpu.requests.addError(translate('resources.tasks.errors.requestMinorLimits'));
        }
        if (checkMemRequestError(formData)) {
            errors.k8s.resources.mem.requests.addError(translate('resources.tasks.errors.requestMinorLimits'));
        }
        if (checkGpuRequestError(formData)) {
            errors.k8s.resources.gpu.requests.addError("");
        }
        return errors;
      }

    useEffect(() => {
        if (schemaProvider && record) {
            schemaProvider.get(resource, kind).then(s => setSpec(s));
        }
    }, [record, schemaProvider]);
    function ErrorListTemplate(props: ErrorListProps) {
        const { errors } = props;
        return (
          <div>
            <h2>Custom error list</h2>
            <ul>
              {errors.map(error => (
                  <li key={error.stack}>
                    {error.stack}
                  </li>
                ))}
            </ul>
          </div>
        );
      }
    return (
        <SimpleForm toolbar={<TaskToolbar />} >
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
                    templates={{ ErrorListTemplate }}
                    customValidate={customValidate} 
                />
            )}
        </SimpleForm>
    );
};
