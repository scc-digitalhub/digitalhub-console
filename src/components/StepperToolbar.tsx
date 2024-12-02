import { useStepper, StepperForm } from '@dslab/ra-stepper';
import { Box } from '@mui/material';
import { MouseEventHandler } from 'react';
import { Toolbar, SaveButton, SaveButtonProps } from 'react-admin';

type StepperToolbarProps = {
    onNext?: MouseEventHandler<HTMLButtonElement>;
    saveProps?: SaveButtonProps;
};

export const StepperToolbar = (props: StepperToolbarProps) => {
    const { onNext, saveProps } = props;
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
                <StepperForm.NextButton onClick={onNext} />
                {steps && currentStep === steps.length - 1 && <SaveButton {...saveProps} />}
            </Box>
        </Toolbar>
    );
};
