import { JsonSchemaInput, JsonSchemaField } from '@dslab/ra-jsonschema-input';
import { useRootSelector } from '@dslab/ra-root-selector';
import { StepperForm, useStepper } from '@dslab/ra-stepper';
import {
    Create,
    FormDataConsumer,
    LoadingIndicator,
    SaveButton,
    SimpleForm,
    Toolbar,
    useGetOne,
    useGetResourceLabel,
    useTranslate,
} from 'react-admin';
import { getTaskUiSpec } from '../tasks/types';
import { useState } from 'react';
import { Box } from '@mui/system';
import { getRunUiSpec } from './types';
import { toYaml } from '@dslab/ra-export-record-button';
import { AceEditorField } from '../../components/AceEditorField';

const RunCreate = (props: { taskId: string }) => {
    const { taskId } = props;
    //data
    const [runSchema, setRunSchema] = useState<any>();
    const [taskSchema, setTaskSchema] = useState<any>();

    //fetch task
    const { data: task, isLoading, error } = useGetOne('tasks', { id: taskId });

    //rebuild spec
    const fn = task?.spec?.function || '';
    const url = new URL(fn);
    const runtime = url.protocol
        ? url.protocol.substring(0, url.protocol.length - 1)
        : '';
    url.protocol = task.kind + ':';
    const key = url.toString();

    const partial = {
        project: task?.project,
        kind: runSchema ? runSchema.kind : runtime + '+run',
        spec: {
            task: key,
            local_execution: false,
            //spread task details to init
            ...task?.spec,
        },
    };

    if (isLoading || error) {
        return <LoadingIndicator />;
    }

    return <></>;
};

export const RunCreateComponent = (props: {
    runSchema: any;
    taskSchema: any;
}) => {
    const { runSchema, taskSchema } = props;
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();

    return (
        <StepperForm toolbar={<StepperToolbar />}>
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
            <StepperForm.Step label={translate('Recap')} optional>
                <FormDataConsumer>
                    {({ formData }) => {
                        const r = { spec: btoa(toYaml(formData?.spec)) };
                        return (
                            <AceEditorField
                                mode="yaml"
                                source="spec"
                                record={r}
                            />
                        );
                    }}
                </FormDataConsumer>
            </StepperForm.Step>
        </StepperForm>
    );
};

const StepperToolbar = () => {
    const { steps, currentStep } = useStepper();

    return (
        <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box>
                <StepperForm.PreviousButton
                    variant={'text'}
                    color="secondary"
                />
            </Box>
            <Box>
                <StepperForm.NextButton />
                {steps && currentStep === steps.length - 1 && (
                    <SaveButton alwaysEnable />
                )}
            </Box>
        </Toolbar>
    );
};
