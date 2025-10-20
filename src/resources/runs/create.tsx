// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { StepperForm } from '@dslab/ra-stepper';
import {
    AutocompleteInput,
    FormDataConsumer,
    ReferenceInput,
    required,
    useGetList,
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
import { useRootSelector } from '@dslab/ra-root-selector';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { useCallback, useRef } from 'react';
import { filterProps } from '../../common/schemas';

const ajv = customizeValidator({ AjvClass: Ajv2020 });

export const RunCreate = () => {
    const { root } = useRootSelector();
    const schemaProvider = useSchemaProvider();
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    const fn = useRef<string | null>(null);

    const functionSelectOption = useCallback(
        d => ({
            ...d,
            data: d.data?.map(record => ({
                name: record.name,
                id: `function_${record.kind}://${record.project}/${record.name}`,
            })),
        }),
        []
    );

    const workflowSelectOption = useCallback(
        d => ({
            ...d,
            data: d.data?.map(record => ({
                name: record.name,
                id: `workflow_${record.kind}://${record.project}/${record.name}`,
            })),
        }),
        []
    );
    const { data: functions } = useGetList(
        'functions',
        { pagination: { page: 1, perPage: 100 } },
        { select: functionSelectOption }
    );
    const { data: workflows } = useGetList(
        'workflows',
        { pagination: { page: 1, perPage: 100 } },
        { select: workflowSelectOption }
    );

    const onChange = e => {
        if (e && typeof e == 'string') {
            fn.current = e;
        }
    };

    return (
        <StepperForm
            toolbar={<StepperToolbar saveProps={{ alwaysEnable: true }} />}
        >
            <StepperForm.Step label={getResourceLabel('functions', 1)}>
                <ReferenceInput source="_function" reference="functions">
                    <AutocompleteInput onChange={e => onChange(e)} />
                </ReferenceInput>
            </StepperForm.Step>
            <StepperForm.Step label={getResourceLabel('runs', 1)}>
                <FormDataConsumer>
                    {({ formData }) => {
                        //read-only view
                        const r = { spec: btoa(toYaml(formData)) };
                        return (
                            <AceEditorField
                                mode="yaml"
                                source="spec"
                                record={r}
                                parse={atob}
                            />
                        );
                    }}
                </FormDataConsumer>
            </StepperForm.Step>
        </StepperForm>
    );
};

export const RunCreateTaskStep = () => {};

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
