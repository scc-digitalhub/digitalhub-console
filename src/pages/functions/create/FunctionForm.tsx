// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { JSXElementConstructor, ReactElement, useState } from 'react';
import { Box } from '@mui/material';
import { TextInput, required } from 'react-admin';
import { KindSelector } from '../../../common/components/KindSelector';
import { SpecInput } from '../../../common/jsonSchema/components/SpecInput';
import { getFunctionUiSpec } from '../types';
import { Step, StepperForm } from '@dslab/ra-stepper';
import { StepperToolbar } from '../../../common/components/toolbars/StepperToolbar';
import { isAlphaNumeric } from '../../../common/utils/helpers';
import { MetadataInput } from '../../../features/metadata/components/MetadataInput';
import { ExtensionsForm } from '../../../features/extensions/Form';
import { useGetExtensions } from '../../../features/extensions/utils';
import { KindChangeGuard } from '../../../common/components/KindSelector';

export const FunctionForm = (props: {
    kinds?: { id: string; name: string }[];
    isFromTemplate?: boolean;
    cancelUrl?: string;
    onCancel?: () => void;
}) => {
    const { kinds, isFromTemplate, cancelUrl, onCancel } = props;
    const [kind, setKind] = useState<string | undefined>();
    const [isSpecDirty, setIsSpecDirty] = useState(false);

    const { data: schemas } = useGetExtensions();

    //TODO fix stepperform handling for empty (null) children
    //we build steps outside to avoid false/null children to stepperForm
    const steps: ReactElement<any, JSXElementConstructor<Step>>[] = [
        <StepperForm.Step key="kind" label="fields.kind">
            <FunctionKindStepContent
                kinds={kinds}
                isFromTemplate={isFromTemplate}
                isSpecDirty={isSpecDirty}
                onKindConfirm={setKind}
            />
        </StepperForm.Step>,
        <StepperForm.Step key="base" label="fields.base">
            <FunctionBaseStepContent />
        </StepperForm.Step>,
        <StepperForm.Step key="spec" label="fields.spec.title">
            <FunctionSpecStepContent kind={kind} onSpecDirty={setIsSpecDirty} />
        </StepperForm.Step>,
    ];

    if (schemas && schemas.length > 0) {
        steps.push(
            <StepperForm.Step
                key="extensions"
                label={'fields.extensions.title'}
            >
                <ExtensionsForm source="extensions" />
            </StepperForm.Step>
        );
    }

    return (
        <StepperForm
            toolbar={
                <StepperToolbar cancelUrl={cancelUrl} onCancel={onCancel} />
            }
        >
            {steps}
        </StepperForm>
    );
};

const FunctionKindStepContent = ({
    kinds,
    isFromTemplate,
    isSpecDirty,
    onKindConfirm,
}: {
    kinds?: { id: string; name: string }[];
    isFromTemplate?: boolean;
    isSpecDirty: boolean;
    onKindConfirm: (nextKind: string | undefined) => void;
}) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', p: 4 }}>
            <KindChangeGuard isDirty={isSpecDirty} onConfirm={onKindConfirm} />
            <KindSelector kinds={kinds} readOnly={isFromTemplate} />
        </Box>
    );
};

const FunctionBaseStepContent = () => {
    return (
        <>
            <TextInput
                source="name"
                validate={[required(), isAlphaNumeric()]}
            />
            <MetadataInput kinds={['metadata.base']} />
        </>
    );
};

const FunctionSpecStepContent = ({
    kind,
    onSpecDirty,
}: {
    kind?: string;
    onSpecDirty: (dirty: boolean) => void;
}) => {
    return (
        <SpecInput
            source="spec"
            kind={kind}
            onDirty={onSpecDirty}
            getUiSchema={getFunctionUiSpec}
        />
    );
};
