import { useStepper, StepperForm } from "@dslab/ra-stepper";
import { Box } from "@mui/material";
import { Toolbar, SaveButton } from "react-admin";

export const StepperToolbar = () => {
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
                {steps && currentStep === steps.length - 1 && <SaveButton />}
            </Box>
        </Toolbar>
    );
};
