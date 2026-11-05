// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Step, StepperForm } from '@dslab/ra-stepper';
import {
    required,
    TextInput,
    useGetResourceLabel,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { StepperToolbar } from '../../../common/components/toolbars/StepperToolbar';
import { ExtensionsForm } from '../../../features/extensions/components/Form';
import { useGetExtensions } from '../../../features/extensions/utils';
import { JSXElementConstructor, ReactElement, useState } from 'react';
import { useExtensionsSteps } from '../../../features/extensions/steps';
import { useGetSchemas } from '../../../common/jsonSchema/schemaController';
import { FunctionStep, RunStep, SummaryStep, TaskStep } from './steps';
import { Divider } from '@mui/material';

export const RunCreate = (props: {
    task?: string;
    runtime?: string;
    resource?: string;
    record?: any;
}) => {
    const { task: taskProps, runtime: runtimeProp } = props;
    //record should be the function or a pre-existing trigger context
    const resource = useResourceContext(props);
    const record = useRecordContext(props);
    const runtime =
        runtimeProp || (resource === 'runs' ? undefined : record?.kind);

    return <RunCreateForm task={taskProps} runtime={runtime} />;
};

export const RunCreateForm = (props: { task?: string; runtime?: string }) => {
    const { task: taskProps, runtime: runtimeProp } = props;
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    const { data: taskSchemas } = useGetSchemas('tasks');
    //check if any extension is available
    const { data: extensions } = useGetExtensions();
    const contributions = useExtensionsSteps();

    const [runtime, setRuntime] = useState<string | undefined>(runtimeProp);
    const [task, setTask] = useState<string | undefined>(taskProps);

    const tasks =
        taskSchemas && runtime
            ? taskSchemas
                  .filter(s => s.runtime === runtime)
                  .map(s => ({ id: s.kind, name: s.kind }))
            : [];

    const kind = taskProps || task ? (taskProps || task) + ':run' : undefined;

    const steps: ReactElement<any, JSXElementConstructor<Step>>[] = [];

    if (runtimeProp === undefined) {
        steps.push(
            <StepperForm.Step
                key="function"
                label={getResourceLabel('functions', 1)}
            >
                <TextInput
                    source="spec.function"
                    readOnly
                    validate={[required()]}
                />
                <FunctionStep onSelect={setRuntime} />
            </StepperForm.Step>
        );
    }

    steps.push(
        <StepperForm.Step key="task" label={getResourceLabel('tasks', 1)}>
            <TextInput source="spec.function" readOnly />
            <Divider />
            <TaskStep
                kind={task}
                kinds={tasks}
                onKindChange={setTask}
                readOnly={Boolean(taskProps)}
            />
        </StepperForm.Step>,
        <StepperForm.Step key="run" label={getResourceLabel('runs', 1)}>
            <RunStep task={task} kind={kind} />
        </StepperForm.Step>
    );

    if (contributions && contributions.length > 0) {
        steps.push(...contributions);
    }

    if (extensions && extensions.length > 0) {
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
            <SummaryStep kind={kind} />
        </StepperForm.Step>
    );

    return (
        <StepperForm
            toolbar={<StepperToolbar saveProps={{ alwaysEnable: true }} />}
        >
            {steps}
        </StepperForm>
    );

    // const { runSchema: runSchemaProps, taskSchema: taskSchemaProps } = props;
    // console.log('props', props);
    // const translate = useTranslate();
    // const getResourceLabel = useGetResourceLabel();

    // //filter task properties from run schema
    // const taskSchema = taskSchemaProps?.schema || {};
    // const taskSchemaUi = taskSchemaProps?.uiSchema || {};
    // const runSchema = filterProps(runSchemaProps?.schema || {}, taskSchema);
    // const runSchemaUi = runSchemaProps?.uiSchema || {};
    // //check if any extension is available
    // const { data: extensions } = useGetExtensions();
    // const contributions = useExtensionsSteps();

    // //TODO fix stepperform handling for empty (null) children
    // //we build steps outside to avoid false/null children to stepperForm
    // const steps: ReactElement<any, JSXElementConstructor<Step>>[] = [
    //     <StepperForm.Step key="task" label={getResourceLabel('tasks', 1)}>
    //         <JsonSchemaInput
    //             source="spec"
    //             schema={taskSchema}
    //             uiSchema={getTaskUiSpec(taskSchema, taskSchemaUi)}
    //         />
    //     </StepperForm.Step>,
    //     <StepperForm.Step key="run" label={getResourceLabel('runs', 1)}>
    //         <JsonSchemaInput
    //             source="spec"
    //             schema={runSchema}
    //             uiSchema={getRunUiSpec(runSchema, runSchemaUi)}
    //         />
    //     </StepperForm.Step>,
    // ];

    // if (contributions && contributions.length > 0) {
    //     steps.push(...contributions);
    // }

    // if (extensions && extensions.length > 0) {
    //     steps.push(
    //         <StepperForm.Step
    //             key="extensions"
    //             label={'fields.extensions.title'}
    //         >
    //             <ExtensionsForm source="extensions" />
    //         </StepperForm.Step>
    //     );
    // }

    // steps.push(
    //     <StepperForm.Step
    //         key="summary"
    //         label={translate('fields.summary')}
    //         optional
    //     >
    //         <FormDataConsumer>
    //             {({ formData }) => {
    //                 if (runSchemaProps) {
    //                     //let users edit and then validate against schema
    //                     return (
    //                         <AceEditorInput
    //                             mode="yaml"
    //                             theme="github"
    //                             source="spec"
    //                             parse={toYaml}
    //                             format={yaml.parse}
    //                             validate={[
    //                                 required(),
    //                                 isValidAgainstSchema(
    //                                     ajv,
    //                                     runSchemaProps?.schema
    //                                 ),
    //                             ]}
    //                         />
    //                     );
    //                 } else {
    //                     //read-only view
    //                     const r = { spec: btoa(toYaml(formData?.spec)) };
    //                     return (
    //                         <AceEditorField
    //                             mode="yaml"
    //                             source="spec"
    //                             record={r}
    //                             parse={atob}
    //                         />
    //                     );
    //                 }
    //             }}
    //         </FormDataConsumer>
    //     </StepperForm.Step>
    // );

    // return (
    //     <StepperForm
    //         toolbar={<StepperToolbar saveProps={{ alwaysEnable: true }} />}
    //     >
    //         {steps}
    //     </StepperForm>
    // );
};
