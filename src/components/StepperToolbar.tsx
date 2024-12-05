import { useStepper, StepperForm } from '@dslab/ra-stepper';
import { Box } from '@mui/material';
import { MouseEventHandler } from 'react';
import { Toolbar, SaveButton, SaveButtonProps } from 'react-admin';

type StepperToolbarProps = {
    beforeNext?: MouseEventHandler<HTMLButtonElement>;
    disableNext?: boolean;
    saveProps?: SaveButtonProps;
};

export const StepperToolbar = (props: StepperToolbarProps) => {
    const { beforeNext, saveProps, disableNext = false } = props;
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
                <StepperForm.NextButton
                    onClick={beforeNext}
                    disabled={disableNext}
                />
                {steps && currentStep === steps.length - 1 && (
                    <SaveButton {...saveProps} />
                )}
            </Box>
        </Toolbar>
    );
};
