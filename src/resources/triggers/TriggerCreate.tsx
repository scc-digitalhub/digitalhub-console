// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { JSXElementConstructor, ReactElement, useState } from 'react';
import {
    FunctionStep,
    RunStep,
    SummaryStep,
    TaskStep,
    TriggerStep,
} from './steps';
import { Step, StepperForm } from '@dslab/ra-stepper';
import {
    useGetResourceLabel,
    useRecordContext,
    useTranslate,
    useResourceContext,
    TextInput,
    required,
} from 'react-admin';
import { StepperToolbar } from '../../common/components/toolbars/StepperToolbar';

import { useKinds } from '../../common/hooks/useKinds';
import { useGetSchemas } from '../../common/jsonSchema/schemaController';
import { Divider } from '@mui/material';

export const TriggerCreate = (props: {
    kind?: string;
    task?: string;
    runtime?: string;
    resource?: string;
    record?: any;
}) => {
    const { kind: kindProps, task: taskProps, runtime: runtimeProp } = props;
    //record should be the function or a pre-existing trigger context
    const resource = useResourceContext(props);
    const record = useRecordContext(props);
    const kind =
        kindProps || (resource === 'triggers' ? record?.kind : undefined);
    const runtime =
        runtimeProp || (resource === 'triggers' ? undefined : record?.kind);

    return <TriggerCreateForm kind={kind} task={taskProps} runtime={runtime} />;
};

export const TriggerCreateForm = (props: {
    kind?: string;
    task?: string;
    runtime?: string;
}) => {
    const { kind: kindProps, task: taskProps, runtime: runtimeProp } = props;
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    const kindSchemas = useKinds({ resource: 'triggers' });
    const kinds = kindSchemas ? kindSchemas.map(s => ({ id: s, name: s })) : [];
    const { data: taskSchemas } = useGetSchemas('tasks');

    const [kind, setKind] = useState<string | undefined>(kindProps);
    const [runtime, setRuntime] = useState<string | undefined>(runtimeProp);
    const [task, setTask] = useState<string | undefined>(taskProps);

    const tasks =
        taskSchemas && runtime
            ? taskSchemas
                  .filter(s => s.runtime === runtime)
                  .map(s => ({ id: s.kind, name: s.kind }))
            : [];

    const steps: ReactElement<any, JSXElementConstructor<Step>>[] = [
        <StepperForm.Step key="trigger" label={getResourceLabel('triggers', 1)}>
            <TriggerStep kind={kind} kinds={kinds} onKindChange={setKind} />
        </StepperForm.Step>,
    ];
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
            <RunStep task={task} kind={task ? task + ':run' : undefined} />
        </StepperForm.Step>,
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
};
