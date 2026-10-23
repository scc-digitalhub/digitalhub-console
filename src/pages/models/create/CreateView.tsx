// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { JSXElementConstructor, ReactElement, useState } from 'react';
import { useGetTemplates } from '../../../common/provider/templateProvider';
import { Container, LinearProgress } from '@mui/material';
import { useRedirect, useResourceContext } from 'react-admin';
import { randomId } from '../../../common/utils/helpers';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { CreatePageTitle } from '../../../common/components/layout/PageTitle';
import { ModelIcon } from '../icon';
import { CreateToolbar } from './CreateToolbar';

import { Step, StepperForm } from '@dslab/ra-stepper';
import { StepperToolbar } from '../../../common/components/toolbars/StepperToolbar';
import { ExtensionsForm } from '../../../features/extensions/components/Form';
import { useGetExtensions } from '../../../features/extensions/utils';
import { useGetSchemas } from '../../../common/jsonSchema/schemaController';
import { useExtensionsSteps } from '../../../features/extensions/steps';
import { ModelSpecStep, BaseStep, UploadStep } from './steps';
import { TemplatesSelector } from '../../../common/components/TemplatesSelector';
import { ModelCreate } from './create';

export const ModelCreatePage = () => {
    const [id] = useState(randomId);
    const resource = useResourceContext();
    const redirect = useRedirect();

    const { data: templates, isLoading } = useGetTemplates(resource);
    const [template, setTemplate] = useState<any | undefined>();

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreatePageTitle icon={<ModelIcon fontSize={'large'} />} />
            <CreateToolbar />

            <FlatCard sx={{ paddingBottom: '12px' }}>
                {isLoading ? (
                    <LinearProgress />
                ) : templates &&
                  templates.length > 0 &&
                  template === undefined ? (
                    <TemplatesSelector
                        templates={templates}
                        template={template}
                        onSelected={setTemplate}
                    />
                ) : (
                    <ModelCreate template={template} id={id} redirect="list">
                        <ModelCreateForm
                            isFromTemplate={!!template}
                            onCancel={() => {
                                if (templates?.length) {
                                    setTemplate(undefined);
                                } else {
                                    redirect('list', resource);
                                }
                            }}
                        />
                    </ModelCreate>
                )}
            </FlatCard>
        </Container>
    );
};

export const ModelCreateForm = (props: {
    isFromTemplate?: boolean;
    onCancel?: () => void;
}) => {
    const { isFromTemplate, onCancel } = props;
    const resource = useResourceContext();

    const { data: kindSchemas } = useGetSchemas(resource || '');
    const { data: extensions } = useGetExtensions();
    const contributions = useExtensionsSteps();

    const kinds = kindSchemas
        ? kindSchemas.map(s => ({ id: s.kind, name: s.kind }))
        : [];

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
