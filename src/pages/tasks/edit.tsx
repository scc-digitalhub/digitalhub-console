// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Labeled,
    SaveButton,
    SimpleForm,
    TextField,
    Toolbar,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { JsonSchemaInput } from '../../common/jsonSchema/components/JsonSchema';
import { getTaskUiSpec } from './types';
import { Stack } from '@mui/system';
import { useState, useEffect } from 'react';
import { useSchemaProvider } from '../../common/provider/schemaProvider';
import { checkCpuRequestError } from '../../common/jsonSchema/components/widgets/CoreResourceCpuWidget';
import { checkGpuRequestError } from '../../common/jsonSchema/components/widgets/CoreResourceGpuWidget';
import { checkMemRequestError } from '../../common/jsonSchema/components/widgets/CoreResourceMemWidget';


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

    function customValidate(formData, errors, uiSchema) {
        if (checkCpuRequestError(formData)) {
            errors.k8s.resources.cpu.requests.addError(
                translate('resources.tasks.errors.requestMinorLimits')
            );
        }
        if (checkMemRequestError(formData)) {
            errors.k8s.resources.mem.requests.addError(
                translate('resources.tasks.errors.requestMinorLimits')
            );
        }
        if (checkGpuRequestError(formData)) {
            errors.k8s.resources.gpu.requests.addError('');
        }
        return errors;
    }
    useEffect(() => {
        if (schemaProvider && record && resource) {
            schemaProvider.get(resource, kind).then(s => setSpec(s));
        }
    }, [record, schemaProvider, resource]);

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
                    schema={{ ...spec.schema, title: 'Spec' }}
                    label={false}
                    uiSchema={getTaskUiSpec(spec.schema)}
                    customValidate={customValidate}
                />
            )}
        </SimpleForm>
    );
};
