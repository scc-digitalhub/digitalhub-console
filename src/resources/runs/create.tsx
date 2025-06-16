// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { StepperForm } from '@dslab/ra-stepper';
import {
    FormDataConsumer,
    required,
    useGetResourceLabel,
    useTranslate,
} from 'react-admin';
import { getTaskUiSpec } from '../tasks/types';
import { getRunUiSpec } from './types';
import { toYaml } from '@dslab/ra-export-record-button';
import { JsonSchemaInput } from '../../components/JsonSchema';
import { useGetManySchemas } from '../../controllers/schemaController';
import { AceEditorField, AceEditorInput } from '@dslab/ra-ace-editor';
import yaml from 'yaml';
import { isValidAgainstSchema } from '../../common/helper';
import Ajv2020 from 'ajv/dist/2020';
import { customizeValidator } from '@rjsf/validator-ajv8';
import { StepperToolbar } from '../../components/toolbars/StepperToolbar';

const ajv = customizeValidator({ AjvClass: Ajv2020 });

export const RunCreateForm = (props: {
    runtime: string;
    runSchema: any;
    taskSchema: any;
}) => {
    const { runtime, runSchema, taskSchema } = props;
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();

    const { data: schemas } = useGetManySchemas([
        { resource: 'runs', runtime },
    ]);
    const schema = schemas ? schemas.find(s => s.entity === 'RUN') : null;

    return (
        <StepperForm
            toolbar={<StepperToolbar saveProps={{ alwaysEnable: true }} />}
        >
            <StepperForm.Step label={getResourceLabel('tasks', 1)}>
                <JsonSchemaInput
                    source="spec"
                    schema={taskSchema}
                    uiSchema={getTaskUiSpec(taskSchema)}
                />
            </StepperForm.Step>
            <StepperForm.Step label={getResourceLabel('runs', 1)}>
                <JsonSchemaInput
                    source="spec"
                    schema={runSchema}
                    uiSchema={getRunUiSpec(runSchema)}
                />
            </StepperForm.Step>
            <StepperForm.Step label={translate('fields.summary')} optional>
                <FormDataConsumer>
                    {({ formData }) => {
                        if (schema) {
                            //let users edit and then validate against schema
                            return (
                                <AceEditorInput
                                    mode="yaml"
                                    theme="github"
                                    source="spec"
                                    parse={toYaml}
                                    format={yaml.parse}
                                    validate={[
                                        required(),
                                        isValidAgainstSchema(
                                            ajv,
                                            schema?.schema
                                        ),
                                    ]}
                                />
                            );
                        } else {
                            //read-only view
                            const r = { spec: btoa(toYaml(formData?.spec)) };
                            return (
                                <AceEditorField
                                    mode="yaml"
                                    source="spec"
                                    record={r}
                                    parse={atob}
                                />
                            );
                        }
                    }}
                </FormDataConsumer>
            </StepperForm.Step>
        </StepperForm>
    );
};
