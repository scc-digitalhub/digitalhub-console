// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { StepperForm } from '@dslab/ra-stepper';
import {
    FormDataConsumer,
    required,
    TextInput,
    useGetResourceLabel,
    useTranslate,
} from 'react-admin';
import { getTaskUiSpec } from '../tasks/types';
import { getTriggerUiSpec } from './types';
import { toYaml } from '@dslab/ra-export-record-button';
import { JsonSchemaInput } from '../../common/jsonSchema/components/JsonSchema';
import { useGetSchemas } from '../../common/jsonSchema/schemaController';
import { AceEditorField, AceEditorInput } from '@dslab/ra-ace-editor';
import yaml from 'yaml';
import { isAlphaNumeric, isValidAgainstSchema } from '../../common/utils/helper';
import Ajv2020 from 'ajv/dist/2020';
import { customizeValidator } from '@rjsf/validator-ajv8';
import { StepperToolbar } from '../../common/components/toolbars/StepperToolbar';
import { getRunUiSpec } from '../runs/types';
import { KindSelector } from '../../common/components/KindSelector';
import { Stack } from '@mui/material';
import {
    filterProperties,
    filterProps,
} from '../../common/jsonSchema/schemas';

const ajv = customizeValidator({ AjvClass: Ajv2020 });

export const TriggerCreateForm = (props: {
    runSchema: any;
    taskSchema: any;
}) => {
    const { runSchema: runSchemaProps, taskSchema } = props;
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    //filter task properties from run schema
    const runSchema = filterProps(runSchemaProps, taskSchema);
    const { data: schemas } = useGetSchemas('triggers');
    const kinds = schemas
        ? schemas.map(s => ({
              id: s.kind,
              name: s.kind,
          }))
        : [];

    const getSpecSchema = (kind: string | undefined) => {
        return schemas
            ? schemas.find(s => s.id === 'TRIGGER:' + kind)?.schema
            : undefined;
    };
    const getUiSchema = (kind: string | undefined) => {
        if (!kind) {
            return undefined;
        }

        const schema = getSpecSchema(kind);
        if (!schema) {
            return undefined;
        }

        return getTriggerUiSpec(schema, taskSchema);
    };

    return (
        <StepperForm
            toolbar={<StepperToolbar saveProps={{ alwaysEnable: true }} />}
        >
            <StepperForm.Step label={getResourceLabel('triggers', 1)}>
                <Stack direction={'row'} spacing={3} pt={4}>
                    <TextInput
                        source="name"
                        validate={[required(), isAlphaNumeric()]}
                    />
                    <KindSelector kinds={kinds} />
                </Stack>
                <FormDataConsumer<{ kind: string }>>
                    {({ formData }) => {
                        if (formData?.kind) {
                            return (
                                <JsonSchemaInput
                                    source="spec"
                                    schema={filterProperties(
                                        getSpecSchema(formData.kind),
                                        ['template'] //we filter template to avoid collision with spec.template below
                                    )}
                                    uiSchema={getUiSchema(formData.kind)}
                                />
                            );
                        }
                    }}
                </FormDataConsumer>
            </StepperForm.Step>
            <StepperForm.Step label={getResourceLabel('tasks', 1)}>
                <JsonSchemaInput
                    source="spec.template"
                    schema={taskSchema}
                    uiSchema={getTaskUiSpec(taskSchema)}
                />
            </StepperForm.Step>
            <StepperForm.Step label={getResourceLabel('runs', 1)}>
                <JsonSchemaInput
                    source="spec.template"
                    schema={runSchema}
                    uiSchema={getRunUiSpec(runSchema)}
                />
            </StepperForm.Step>
            <StepperForm.Step label={translate('fields.summary')} optional>
                <FormDataConsumer>
                    {({ formData }) => {
                        if (formData?.kind) {
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
                                            getSpecSchema(formData.kind)
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
