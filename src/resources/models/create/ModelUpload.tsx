// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { JSXElementConstructor, ReactElement } from 'react';
import { Step, StepperForm } from '@dslab/ra-stepper';
import { useResourceContext } from 'react-admin';
import { StepperToolbar } from '../../../common/components/toolbars/StepperToolbar';
import { BaseStep, ModelSpecStep, UploadStep } from './steps';
import { ExtensionsForm } from '../../../features/extensions/components/Form';
import { useExtensionsSteps } from '../../../features/extensions/steps';
import { useGetExtensions } from '../../../features/extensions/utils';
import { useGetSchemas } from '../../../common/jsonSchema/schemaController';
import { DialogProps } from '../../../common/components/buttons/UploadCreateButton';
import { ModelCreate } from './ModelCreate';

export const ModelUpload = (props: DialogProps) => {
    const onSuccess = () => {
        if (props.closeDialog) props.closeDialog();
    };

    return (
        <ModelCreate redirect={false} mutationOptions={{ onSuccess }}>
            <ModelUploadForm />
        </ModelCreate>
    );
};

const ModelUploadForm = () => {
    const resource = useResourceContext();
    const { data: kindSchemas } = useGetSchemas(resource);
    const { data: extensions } = useGetExtensions(resource);
    const contributions = useExtensionsSteps({ resource });
    const kinds =
        kindSchemas?.map(schema => ({ id: schema.kind, name: schema.kind })) ??
        [];
    const steps: ReactElement<any, JSXElementConstructor<Step>>[] = [
        <StepperForm.Step key="upload" label="actions.upload">
            <UploadStep readOnly />
        </StepperForm.Step>,
        <StepperForm.Step key="base" label="fields.base">
            <BaseStep />
        </StepperForm.Step>,
        <StepperForm.Step key="spec" label="fields.spec.title">
            <ModelSpecStep kinds={kinds} />
        </StepperForm.Step>,
    ];

    if (contributions && contributions.length > 0) {
        steps.push(...contributions);
    }

    if (extensions && extensions.length > 0) {
        steps.push(
            <StepperForm.Step key="extensions" label="fields.extensions.title">
                <ExtensionsForm source="extensions" />
            </StepperForm.Step>
        );
    }

    return <StepperForm toolbar={<StepperToolbar />}>{steps}</StepperForm>;
};
