// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { JSXElementConstructor, ReactElement } from 'react';

import { Step, StepperForm } from '@dslab/ra-stepper';
import { StepperToolbar } from '../../../common/components/toolbars/StepperToolbar';
import { ExtensionsForm } from '../../../features/extensions/components/Form';
import { useGetExtensions } from '../../../features/extensions/utils';
import { useExtensionsSteps } from '../../../features/extensions/steps';
import { ModelSpecStep, BaseStep, UploadStep } from './steps';
import { useKinds } from '../../../common/hooks/useKinds';

export const ModelCreateForm = (props: {
    isFromTemplate?: boolean;
    onCancel?: () => void;
}) => {
    const { isFromTemplate, onCancel } = props;

    const kindSchemas = useKinds();
    const { data: extensions } = useGetExtensions();
    const contributions = useExtensionsSteps();

    const kinds = kindSchemas ? kindSchemas.map(s => ({ id: s, name: s })) : [];

    //TODO fix stepperform handling for empty (null) children
    //we build steps outside to avoid false/null children to stepperForm
    const steps: ReactElement<any, JSXElementConstructor<Step>>[] = [
        <StepperForm.Step key="base" label={'fields.base'}>
            <BaseStep />
        </StepperForm.Step>,
        <StepperForm.Step key="spec" label={'fields.spec.title'}>
            <ModelSpecStep kinds={kinds} readOnlyKind={isFromTemplate} />
            <UploadStep readOnly={isFromTemplate} />
        </StepperForm.Step>,
    ];

    if (contributions && contributions.length > 0) {
        steps.push(...contributions);
    }

    if (extensions && extensions.length > 0) {
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
        <StepperForm toolbar={<StepperToolbar onCancel={onCancel} />}>
            {steps}
        </StepperForm>
    );
};
