// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
import { JSXElementConstructor, ReactElement } from 'react';
import {
    CreateBase,
    CreateView,
    FormDataConsumer,
    LoadingIndicator,
    TextInput,
    required,
} from 'react-admin';
import { isAlphaNumeric } from '../../common/utils/helpers';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { CreatePageTitle } from '../../common/components/layout/PageTitle';
import { WorkflowIcon } from './icon';
import { getWorkflowUiSpec } from './types';
import { KindSelector } from '../../common/components/KindSelector';
import { Step, StepperForm } from '@dslab/ra-stepper';
import { SpecInput } from '../../common/jsonSchema/components/SpecInput';
import { StepperToolbar } from '../../common/components/toolbars/StepperToolbar';
import { CreateToolbar } from '../../common/components/toolbars/CreateToolbar';
import { MetadataInput } from '../../features/metadata/components/MetadataInput';
import { ExtensionsForm } from '../../features/extensions/Form';
import { useGetExtensions } from '../../features/extensions/utils';
import { useGetSchemas } from '../../common/jsonSchema/schemaController';

export const WorkflowCreate = () => {
    const { root } = useRootSelector();
    const { data: schemas } = useGetSchemas();

    const kinds = schemas?.map(s => ({ id: s.kind, name: s.kind }));

    const transform = data => ({
        ...data,
        project: root || '',
    });

    if (!kinds) {
        return <LoadingIndicator />;
    }

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase transform={transform} redirect="list">
                <>
                    <CreatePageTitle
                        icon={<WorkflowIcon fontSize={'large'} />}
                    />

                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <WorkflowForm kinds={kinds} />
                        </FlatCard>
                    </CreateView>
                </>
            </CreateBase>
        </Container>
    );
};

export const WorkflowForm = (props: {
    kinds?: { id: string; name: string }[];
}) => {
    const { kinds } = props;

    //check if any extension is available
    const { data: schemas } = useGetExtensions();

    //TODO fix stepperform handling for empty (null) children
    //we build steps outside to avoid false/null children to stepperForm
    const steps: ReactElement<any, JSXElementConstructor<Step>>[] = [
        <StepperForm.Step key="base" label={'fields.base'}>
            <TextInput
                source="name"
                validate={[required(), isAlphaNumeric()]}
            />
            <MetadataInput kinds={['metadata.base']} />
        </StepperForm.Step>,
        <StepperForm.Step key="spec" label={'fields.spec.title'}>
            <KindSelector kinds={kinds} />

            <FormDataConsumer<{ kind: string }>>
                {({ formData }) => (
                    <SpecInput
                        source="spec"
                        kind={formData.kind}
                        getUiSchema={getWorkflowUiSpec}
                    />
                )}
            </FormDataConsumer>
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

    return <StepperForm toolbar={<StepperToolbar />}>{steps}</StepperForm>;
};
