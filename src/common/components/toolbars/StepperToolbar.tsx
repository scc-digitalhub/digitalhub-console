// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useStepper, StepperForm } from '@dslab/ra-stepper';
import { Box, Stack } from '@mui/material';
import { MouseEventHandler } from 'react';
import {
    Toolbar,
    SaveButton,
    SaveButtonProps,
    useTranslate,
    Button,
} from 'react-admin';
import { useNavigate } from 'react-router';
import { useFormContext } from 'react-hook-form';

type StepperToolbarProps = {
    cancelUrl?: string;
    onCancel?: () => void;
    beforeNext?: MouseEventHandler<HTMLButtonElement>;
    disableNext?: boolean;
    saveProps?: SaveButtonProps;
};

export const StepperToolbar = (props: StepperToolbarProps) => {
    const { beforeNext, saveProps, disableNext = false,onCancel, cancelUrl } = props;
    const { steps, currentStep } = useStepper();
    const translate = useTranslate();
    const navigate = useNavigate();
    const { trigger } = useFormContext();

    const handleCancel = () => {
        if (onCancel) onCancel();
        else if (cancelUrl) navigate(cancelUrl);
    };

    const handleNext: MouseEventHandler<HTMLButtonElement> = async (e) => {
       const rhfValid = await trigger();

        if (!rhfValid) {
            e.preventDefault();
            e.stopPropagation();
            return; 
        }
        if (beforeNext) beforeNext(e);
    };

    const isLastStep = steps && currentStep === steps.length - 1;
    
    return (
        <Toolbar sx={{ justifyContent: 'space-between' }}>
        {(cancelUrl || onCancel) ? (
            <Button
                variant="text"
                color="error"
                onClick={handleCancel}
            >
                {translate('ra.action.cancel')}
            </Button>
        ) : (
            <Box />
            )}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    px: 2,
                    py: 1,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Box>
                    <StepperForm.PreviousButton
                        variant={'text'}
                        color="secondary"
                    />
                </Box>
                <Box>
                    <StepperForm.NextButton
                        onClick={handleNext}
                        disabled={disableNext}
                    />
                    {isLastStep && (
                        <SaveButton {...saveProps}
                        alwaysEnable={true}  />
                    )}
                </Box>
            </Stack>
        </Toolbar>
    );
};
