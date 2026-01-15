// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    CreateBase,
    CreateView,
    FormDataConsumer,
    LoadingIndicator,
    TextInput,
    required,
} from 'react-admin';
import { isAlphaNumeric } from '../../common/helper';
import { BlankSchema } from '../../features/jsonSchema/schemas';
import { FlatCard } from '../../common/components/FlatCard';
import { CreatePageTitle } from '../../common/components/PageTitle';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { WorkflowIcon } from './icon';
import { getWorkflowUiSpec } from './types';
import { MetadataInput } from '../../features/jsonSchema/components/MetadataInput';
import { KindSelector } from '../../common/components/KindSelector';
import { StepperForm } from '@dslab/ra-stepper';
import { SpecInput } from '../../features/jsonSchema/components/SpecInput';
import { StepperToolbar } from '../../common/components/toolbars/StepperToolbar';
import { CreateToolbar } from '../../common/components/toolbars/CreateToolbar';

export const WorkflowCreate = () => {
    const { root } = useRootSelector();
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();
    const [schemas, setSchemas] = useState<any[]>();

    const transform = data => ({
        ...data,
        project: root || '',
    });

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.list('workflows').then(res => {
                if (res) {
                    setSchemas(res);

                    const values = res.map(s => ({
                        id: s.kind,
                        name: s.kind,
                    }));

                    setKinds(values);
                }
            });
        }
    }, [schemaProvider, setKinds]);

    if (!kinds) {
        return <LoadingIndicator />;
    }

    const getWorkflowSpec = (kind: string | undefined) => {
        if (!kind) {
            return BlankSchema;
        }

        if (schemas) {
            return schemas.find(s => s.id === 'WORKFLOW:' + kind)?.schema;
        }

        return BlankSchema;
    };

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase transform={transform} redirect="list">
                <>
                    <CreatePageTitle
                        icon={<WorkflowIcon fontSize={'large'} />}
                    />

                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <StepperForm toolbar={<StepperToolbar />}>
                                <StepperForm.Step label={'fields.base'}>
                                    <TextInput
                                        source="name"
                                        validate={[
                                            required(),
                                            isAlphaNumeric(),
                                        ]}
                                    />
                                    <MetadataInput />
                                </StepperForm.Step>
                                <StepperForm.Step label={'fields.spec.title'}>
                                    <KindSelector kinds={kinds} />

                                    <FormDataConsumer<{ kind: string }>>
                                        {({ formData }) => (
                                            <SpecInput
                                                source="spec"
                                                schema={getWorkflowSpec(
                                                    formData.kind
                                                )}
                                                getUiSchema={getWorkflowUiSpec}
                                            />
                                        )}
                                    </FormDataConsumer>
                                </StepperForm.Step>
                            </StepperForm>
                        </FlatCard>
                    </CreateView>
                </>
            </CreateBase>
        </Container>
    );
};
