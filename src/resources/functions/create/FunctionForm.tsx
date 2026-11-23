// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { JSXElementConstructor, ReactElement, useState } from 'react';
import { Box } from '@mui/material';
import { TextInput, required } from 'react-admin';
import { useFormContext, useWatch } from 'react-hook-form';
import {
    KindSelector,
    KindChangeGuard,
} from '../../../common/components/KindSelector';
import { Step, StepperForm } from '@dslab/ra-stepper';
import { StepperToolbar } from '../../../common/components/toolbars/StepperToolbar';
import { isAlphaNumeric } from '../../../common/utils/helpers';
import { MetadataInput } from '../../../features/metadata/components/MetadataInput';
import { useKinds } from '../../../common/hooks/useKinds';
import { FunctionSpecFields } from '../FunctionSpecFields';

export const FunctionCreateForm = (props: {
    isFromTemplate?: boolean;
    onCancel?: () => void;
}) => {
    const { isFromTemplate, onCancel } = props;
    const [kind, setKind] = useState<string | undefined>();
    const [isSpecDirty, setIsSpecDirty] = useState(false);

    const kindSchemas = useKinds();
    const kinds = kindSchemas ? kindSchemas.map(s => ({ id: s, name: s })) : [];

    //TODO fix stepperform handling for empty (null) children
    //we build steps outside to avoid false/null children to stepperForm
    const steps: ReactElement<any, JSXElementConstructor<Step>>[] = [
        <StepperForm.Step key="kind" label="fields.kind">
            <FunctionKindStepContent
                kinds={kinds}
                readOnly={isFromTemplate}
                isSpecDirty={isSpecDirty}
                onKindConfirm={setKind}
            />
        </StepperForm.Step>,
        <StepperForm.Step key="base" label="fields.base">
            <FunctionBaseStepContent />
        </StepperForm.Step>,
        <StepperForm.Step key="spec" label="fields.spec.title">
            <FunctionSpecFields kind={kind} onDirty={setIsSpecDirty} />
        </StepperForm.Step>,
    ];

    return (
        <StepperForm toolbar={<StepperToolbar onCancel={onCancel} />}>
            {steps}
        </StepperForm>
    );
};

const FunctionKindStepContent = ({
    kinds,
    readOnly,
    isSpecDirty,
    onKindConfirm,
}: {
    kinds?: { id: string; name: string }[];
    readOnly?: boolean;
    isSpecDirty: boolean;
    onKindConfirm: (nextKind: string | undefined) => void;
}) => {
    const path = useWatch({ name: 'path' });
    const { setValue } = useFormContext();

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', p: 4 }}>
            <KindChangeGuard
                isDirty={Boolean(isSpecDirty || !!path)}
                onConfirm={nextKind => {
                    setValue('path', undefined);
                    onKindConfirm(nextKind);
                }}
            />
            <KindSelector kinds={kinds} readOnly={readOnly} />
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
