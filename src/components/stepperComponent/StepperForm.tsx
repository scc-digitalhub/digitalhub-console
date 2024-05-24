import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Form, FormProps } from 'ra-core';
import {
    Stack,
    CardContent,
    SxProps,
    StackProps,
    Box,
    Button,
    Step as MuiStep,
    StepLabel,
    Stepper,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { SaveButton, SimpleForm, SimpleFormProps, Toolbar } from 'react-admin';
import { JsonSchemaInput } from '@dslab/ra-jsonschema-input';
import { StepperContext, useStepper } from './StepperContext';
import { createContext } from 'vm';

const DefaultToolbar = <Toolbar />;
export const StepperForm = (props: StepperFormProps) => {
    const {
        children,
        className,
        component: Component = DefaultComponent,
        sx,
        toolbar ,
        // steps,
        ...rest
    } = props;

    const [activeStep, setActiveStep] = React.useState(0);
    const isStepOptional = (step: boolean) => {
        return step;
    };

    const goToStep = (index:number) => {
        setActiveStep(prevActiveStep => index);
    }
    let steps: any[] = [];
    if (children !== undefined || children !== null) {
        if (Array.isArray(children)) {
            steps = children.map(step => step.props);
        } else {
            if (children) steps = [children];
        }
    }
    return (
        <Form {...rest}>
          <StepperContext.Provider value={{steps:steps,currentStep:activeStep,goToStep}}>
            <Component className={className} sx={sx}>

                    <Stepper activeStep={activeStep}>
                        {steps.map((step, index) => {
                            const stepProps: { completed?: boolean } = {};
                            const labelProps: {
                                optional?: React.ReactNode;
                            } = {};
                            if (isStepOptional(step.optional)) {
                                labelProps.optional = (
                                    <Typography variant="caption">
                                        Optional
                                    </Typography>
                                );
                            }

                            const stepLabel = step.label || 'Step ' + index;
                            return (
                                <MuiStep key={'step_' + index} {...stepProps}>
                                    <StepLabel {...labelProps}>
                                        {stepLabel}
                                    </StepLabel>
                                </MuiStep>
                            );
                        })}
                    </Stepper>
                <React.Fragment>
                    {steps[activeStep]?.children}
                    {toolbar? 
                        toolbar: 
                        <Toolbar>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                pt: 2,
                            }}
                        >
                            <BackButton/>
                            <NextButton/>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <SaveButton />
                        </Box>
                    </Toolbar>
}
                </React.Fragment>
            </Component>
            </StepperContext.Provider>
        </Form>
    );
};
export const BackButton = () => {
    const {steps,currentStep,goToStep} = useStepper();
    if (currentStep>0)
    return (<Button onClick={()=>goToStep(currentStep-1)}>{'Back'}</Button>);
    <></>
};
export const NextButton = () => {
    const {steps,currentStep,goToStep} = useStepper();
    if (currentStep<steps.length-1)
    return (<Button onClick={()=>goToStep(currentStep+1)}>{'Next'}</Button>);
    <></>
};
SimpleForm.propTypes = {
    children: PropTypes.node,
    defaultValues: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    // @ts-ignore
    record: PropTypes.object,
    toolbar: PropTypes.oneOfType([PropTypes.element, PropTypes.oneOf([false])]),
    validate: PropTypes.func,
};

export interface StepperFormProps extends Omit<SimpleFormProps, 'children'> {
    children:
        | ReactElement<any, React.JSXElementConstructor<typeof Step>>
        | ReactElement<any, React.JSXElementConstructor<typeof Step>>[];
}

const PREFIX = 'RaSimpleForm';

const DefaultComponent = styled(CardContent, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        paddingBottom: '5em',
    },
}));

// const DefaultToolbar = <Toolbar />;
export const Step = (props: StepProps) => {
    const { children, label } = props;
    return <>{children}</>;
};
export interface StepProps {
    label: string;
    children: ReactNode;
}
/* eslint-disable @typescript-eslint/no-unused-vars */
const sanitizeRestProps = ({
    children,
    className,
    component,
    criteriaMode,
    defaultValues,
    delayError,
    onSubmit,
    record,
    resource,
    reValidateMode,
    sx,
    toolbar,
    validate,
    resetOptions,
    resolver,
    sanitizeEmptyValues,
    shouldFocusError,
    shouldUnregister,
    shouldUseNativeValidation,
    warnWhenUnsavedChanges,
    ...props
}: SimpleFormProps) => props;
/* eslint-enable @typescript-eslint/no-unused-vars */
