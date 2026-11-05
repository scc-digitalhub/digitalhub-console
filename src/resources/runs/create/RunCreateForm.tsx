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
import { useFormContext, useWatch } from 'react-hook-form';
import { useFieldObserver } from '../../../common/hooks/useFieldObserver';
import { pick } from 'lodash';

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

/**
 * Extract the kind from a key.
 * - function: `container://project/name` or `container://project/function/name:id` -> `container`
 * - task: `container+deploy` or `container+deploy://project/id` -> `container+deploy`
 */
const kindOf = (key?: string): string | undefined =>
    key ? key.split('://')[0] || undefined : undefined;

//spec keys not owned by the task: preserved when the task is reset
const BASE_SPEC_KEYS = ['function', 'workflow', 'local_execution'];

//undefined while schemas are loading
const getTaskKinds = (
    taskSchemas: any[] | undefined,
    runtime: string | undefined
): string[] | undefined =>
    runtime
        ? taskSchemas?.filter(s => s.runtime === runtime).map(s => s.kind)
        : [];

/**
 * Form-level coordinator: observes spec.function and spec.task, realigning the task
 * with the runtime and keeping `kind` aligned with the task.
 * Must be mounted inside the form and outside of steps, as only the active step is mounted.
 */
const RunCreateCoordinator = (props: {
    runtime?: string;
    task?: string;
    taskSchemas?: any[];
    onTaskChange: (task: string | undefined) => void;
}) => {
    const {
        runtime: runtimeProp,
        task: taskProp,
        taskSchemas,
        onTaskChange,
    } = props;
    const { getValues, setValue } = useFormContext();

    useFieldObserver<string | undefined>('spec.function', value => {
        if (runtimeProp || taskProp) {
            return;
        }

        //drop task and its params in a single write when not valid for the new runtime
        const kinds = getTaskKinds(taskSchemas, kindOf(value));
        const task = kindOf(getValues('spec.task'));
        if (task && kinds && !kinds.includes(task)) {
            setValue('spec', pick(getValues('spec') || {}, BASE_SPEC_KEYS));
        }
    });

    useFieldObserver<string | undefined>('spec.task', value => {
        const task = taskProp ?? kindOf(value);
        onTaskChange(task);

        const kind = task ? task + ':run' : undefined;
        if (getValues('kind') !== kind) {
            setValue('kind', kind, { shouldDirty: false });
        }
    });

    return null;
};

/**
 * Task step content: derives runtime and task kinds from the form values in the same render,
 * so the task selector (and its guard) never mounts with a task stale for the current runtime.
 */
const RunTaskStep = (props: {
    runtime?: string;
    task?: string;
    taskSchemas?: any[];
}) => {
    const { runtime: runtimeProp, task: taskProp, taskSchemas } = props;
    const functionValue = useWatch({ name: 'spec.function' });
    const taskValue = useWatch({ name: 'spec.task' });

    const runtime = runtimeProp ?? kindOf(functionValue);
    const task = taskProp ?? kindOf(taskValue);
    const kinds = getTaskKinds(taskSchemas, runtime);
    //wait for the coordinator to realign a task left over from a previous function
    const isStale =
        !taskProp && Boolean(task) && (!kinds || !kinds.includes(task!));

    return (
        <>
            <TextInput source="spec.function" readOnly />{' '}
            {!isStale && (
                <TaskStep
                    kind={task}
                    kinds={(kinds ?? []).map(k => ({ id: k, name: k }))}
                    readOnly={Boolean(taskProp)}
                />
            )}
        </>
    );
};

export const RunCreateForm = (props: { task?: string; runtime?: string }) => {
    const { task: taskProp, runtime: runtimeProp } = props;
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    const { data: taskSchemas } = useGetSchemas('tasks');
    //check if any extension is available
    const { data: extensions } = useGetExtensions();
    const contributions = useExtensionsSteps();

    //observed task kind, updated only by the coordinator
    const [taskKind, setTaskKind] = useState<string>();

    const task = taskProp ?? taskKind;
    const kind = task ? task + ':run' : undefined;

    const steps: ReactElement<any, JSXElementConstructor<Step>>[] = [];

    if (!runtimeProp) {
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
                <FunctionStep />
            </StepperForm.Step>
        );
    }

    steps.push(
        <StepperForm.Step key="task" label={getResourceLabel('tasks', 1)}>
            <RunTaskStep
                runtime={runtimeProp}
                task={taskProp}
                taskSchemas={taskSchemas}
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
            toolbar={
                <>
                    <RunCreateCoordinator
                        runtime={runtimeProp}
                        task={taskProp}
                        taskSchemas={taskSchemas}
                        onTaskChange={setTaskKind}
                    />
                    <StepperToolbar saveProps={{ alwaysEnable: true }} />
                </>
            }
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
