// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Step, StepperForm } from '@dslab/ra-stepper';
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
import { isValidAgainstSchema } from '../../common/jsonSchema/utils';
import Ajv2020 from 'ajv/dist/2020';
import { customizeValidator } from '@rjsf/validator-ajv8';
import { StepperToolbar } from '../../common/components/toolbars/StepperToolbar';
import { JsonSchemaInput } from '../../common/jsonSchema/components/JsonSchema';
import { filterProps } from '../../common/jsonSchema/schemas';
import { ExtensionsForm } from '../../features/extensions/Form';
import { useGetExtensions } from '../../features/extensions/utils';
import { JSXElementConstructor, ReactElement } from 'react';

const ajv = customizeValidator({ AjvClass: Ajv2020 });

export const RunCreateForm = (props: { runSchema: any; taskSchema: any }) => {
    const { runSchema: runSchemaProps, taskSchema } = props;
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    //filter task properties from run schema
    const runSchema = filterProps(runSchemaProps, taskSchema);

    //check if any extension is available
    const { data: schemas } = useGetExtensions();

    //TODO fix stepperform handling for empty (null) children
    //we build steps outside to avoid false/null children to stepperForm
    const steps: ReactElement<any, JSXElementConstructor<Step>>[] = [
        <StepperForm.Step key="task" label={getResourceLabel('tasks', 1)}>
            <JsonSchemaInput
                source="spec"
                schema={taskSchema}
                uiSchema={getTaskUiSpec(taskSchema)}
            />
        </StepperForm.Step>,
        <StepperForm.Step key="run" label={getResourceLabel('runs', 1)}>
            <JsonSchemaInput
                source="spec"
                schema={runSchema}
                uiSchema={getRunUiSpec(runSchema)}
            />
        </StepperForm.Step>,
    ];

    if (schemas && schemas.length > 0) {
        steps.push(
            <StepperForm.Step
                key="extensions"
                label={'fields.extensions.title'}
            >
                <ExtensionsForm source="extensions" />
            </StepperForm.Step>
        );
    }

    steps.push(
        <StepperForm.Step
            key="summary"
            label={translate('fields.summary')}
            optional
        >
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
    );

    return (
        <StepperForm
            toolbar={<StepperToolbar saveProps={{ alwaysEnable: true }} />}
        >
            {steps}
        </StepperForm>
    );
};
