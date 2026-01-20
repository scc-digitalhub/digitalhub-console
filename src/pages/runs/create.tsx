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
import { AceEditorField, AceEditorInput } from '@dslab/ra-ace-editor';
import yaml from 'yaml';
import { isValidAgainstSchema } from '../../common/utils/helper';
import Ajv2020 from 'ajv/dist/2020';
import { customizeValidator } from '@rjsf/validator-ajv8';
import { StepperToolbar } from '../../common/components/toolbars/StepperToolbar';
import { JsonSchemaInput } from '@dslab/ra-jsonschema-input';
import { filterProps } from '../../common/jsonSchema/schemas';

const ajv = customizeValidator({ AjvClass: Ajv2020 });

export const RunCreateForm = (props: { runSchema: any; taskSchema: any }) => {
    const { runSchema: runSchemaProps, taskSchema } = props;
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    //filter task properties from run schema
    const runSchema = filterProps(runSchemaProps, taskSchema);

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
                        if (runSchemaProps) {
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
                                            runSchemaProps?.schema
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
