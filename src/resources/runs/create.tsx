import { StepperForm, useStepper } from '@dslab/ra-stepper';
import {
    FormDataConsumer,
    SaveButton,
    Toolbar,
    useGetResourceLabel,
    useTranslate,
} from 'react-admin';
import { getTaskUiSpec } from '../tasks/types';
import { Box } from '@mui/system';
import { getRunUiSpec } from './types';
import { JsonSchemaInput } from '../../components/JsonSchema';

import { Editor } from '../../components/AceEditorInput';
import 'ace-builds/src-noconflict/mode-yaml';

// import { ajvResolver } from '@hookform/resolvers/ajv';

import { validateSchemas } from '../../common/helper';

export const RunCreateComponent = (props: {
    runSchema: any;
    taskSchema: any;
}) => {
    const { runSchema, taskSchema } = props;
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();


    // const resolverOptions: any = {strict: 'log', strictSchema: 'log', validateSchema: 'log'}
    const validateRun = (values) => {
        const errors = validateSchemas(values.spec, [runSchema, taskSchema]);
        return errors;  
    }

    return (
        <StepperForm 
            toolbar={<StepperToolbar />} 
            validate={validateRun}
            // resolver={ajvResolver(schema, resolverOptions)} 
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
            <StepperForm.Step label={translate('Recap')} optional>
                <FormDataConsumer>
                    {({ formData }) => {
                        // const r = { spec: btoa(toYaml(formData?.spec)) };
                        return (
                            <>
                            <Editor
                            mode='yaml'
                            theme='github'
                            source='spec'
                            schema={[runSchema, taskSchema]}
                            /> 
                            </>                         
                            // <AceEditorField
                            //     mode="yaml"
                            //     source="spec"
                            //     record={r}
                            // />
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
