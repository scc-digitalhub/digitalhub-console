// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { JSXElementConstructor, ReactElement, useState } from 'react';
import { Box } from '@mui/material';
import { TextInput, required, useResourceContext } from 'react-admin';
import {
    KindSelector,
    KindChangeGuard,
} from '../../../common/components/KindSelector';
import { SpecInput } from '../../../common/jsonSchema/components/SpecInput';
import { Step, StepperForm } from '@dslab/ra-stepper';
import { StepperToolbar } from '../../../common/components/toolbars/StepperToolbar';
import { isAlphaNumeric } from '../../../common/utils/helpers';
import { MetadataInput } from '../../../features/metadata/components/MetadataInput';
import { useGetSchemas } from '../../../common/jsonSchema/schemaController';

export const FunctionCreateForm = (props: {
    isFromTemplate?: boolean;
    onCancel?: () => void;
}) => {
    const { isFromTemplate, onCancel } = props;
    const resource = useResourceContext();
    const [kind, setKind] = useState<string | undefined>();
    const [isSpecDirty, setIsSpecDirty] = useState(false);

    const { data: kindSchemas } = useGetSchemas(resource || '');
    const kinds = kindSchemas
        ? kindSchemas.map(s => ({ id: s.kind, name: s.kind }))
        : [];

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
            <FunctionSpecStepContent kind={kind} onSpecDirty={setIsSpecDirty} />
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
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', p: 4 }}>
            <KindChangeGuard isDirty={isSpecDirty} onConfirm={onKindConfirm} />
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

const FunctionSpecStepContent = ({
    kind,
    onSpecDirty,
}: {
    kind?: string;
    onSpecDirty: (dirty: boolean) => void;
}) => {
    return <SpecInput source="spec" kind={kind} onDirty={onSpecDirty} />;
};
