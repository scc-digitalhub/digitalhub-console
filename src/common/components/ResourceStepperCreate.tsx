// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { TextInput, required, CreateView } from 'react-admin';
import { StepperForm } from '@dslab/ra-stepper';
import { MetadataInput } from '../../features/metadata/components/MetadataInput';
import { isAlphaNumeric } from '../utils/helpers';
import { FlatCard } from './layout/FlatCard';
import { StepperToolbar } from './toolbars/StepperToolbar';

interface ResourceStepperCreateProps {
    specStep: ReactNode;
    kindStep?: ReactNode;
    onCancel?: () => void;
    cancelUrl?: string;
    kindStepLabel?: string;
    metadataStepLabel?: string;
    specStepLabel?: string;
}

export const ResourceStepperCreate = ({
    specStep,
    kindStep,
    onCancel,
    cancelUrl,
    kindStepLabel = 'fields.kind',
    metadataStepLabel = 'fields.base',
    specStepLabel = 'fields.spec.title',
}: ResourceStepperCreateProps) => {
    return (
        <CreateView component={Box}>
            <FlatCard sx={{ paddingBottom: '12px' }}>
                <StepperForm
                    toolbar={
                        <StepperToolbar
                            cancelUrl={cancelUrl}
                            onCancel={onCancel}
                        />
                    }
                >
                        <StepperForm.Step label={kindStepLabel}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 4,
                            }}
                        >
                                {kindStep}
                        </Box>                        </StepperForm.Step>

                    <StepperForm.Step label={metadataStepLabel}>
                        <TextInput
                            source="name"
                            validate={[required(), isAlphaNumeric()]}
                        />
                        <MetadataInput />
                    </StepperForm.Step>

                    <StepperForm.Step label={specStepLabel}>
                        {specStep}
                    </StepperForm.Step>
                </StepperForm>
            </FlatCard>
        </CreateView>
    );
};