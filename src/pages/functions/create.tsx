// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    CreateBase,
    CreateView,
    LoadingIndicator,
    TextInput,
    required,
} from 'react-admin';
import { isAlphaNumeric } from '../../common/utils/helpers';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { CreatePageTitle } from '../../common/components/layout/PageTitle';
import { useSchemaProvider } from '../../common/provider/schemaProvider';
import { FunctionIcon } from './icon';
import { getFunctionUiSpec } from './types';
import { MetadataInput } from '../../features/metadata/components/MetadataInput';
import { KindSelector } from '../../common/components/KindSelector';
import { StepperForm } from '@dslab/ra-stepper';
import { SpecInput } from '../../common/jsonSchema/components/SpecInput';
import {
    Template,
    TemplatesSelector,
} from '../../common/components/TemplatesSelector';
import { StepperToolbar } from '../../common/components/toolbars/StepperToolbar';
import { CreateToolbar } from '../../common/components/toolbars/CreateToolbar';

export const FunctionCreate = () => {
    const { root } = useRootSelector();
    const schemaProvider = useSchemaProvider();
    const [schemas, setSchemas] = useState<any[]>();
    const [template, setTemplate] = useState<Template | null>(null);

    const isLoading = !schemas?.length;
    const kinds = schemas
        ?.map(s => ({
            id: s.kind,
            name: s.kind,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    const transform = data => ({
        ...data,
        project: root || '',
    });

    useEffect(() => {
        if (schemaProvider && !schemas?.length) {
            schemaProvider.list('functions').then(res => {
                if (res) {
                    setSchemas(res);
                }
            });
        }
    }, [schemaProvider]);

    const selectTemplate = selected => {
        setTemplate(selected);
    };

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase transform={transform} redirect="list">
                <>
                    <CreatePageTitle
                        icon={<FunctionIcon fontSize={'large'} />}
                    />

                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <StepperForm toolbar={<StepperToolbar />}>
                                <StepperForm.Step label={'fields.kind'}>
                                    <TemplatesSelector
                                        kinds={kinds}
                                        template={template?.id || null}
                                        onSelected={selectTemplate}
                                    />
                                </StepperForm.Step>

                                <StepperForm.Step label={'fields.base'}>
                                    <TextInput
                                        source="name"
                                        placeholder={template?.name}
                                        validate={[
                                            required(),
                                            isAlphaNumeric(),
                                        ]}
                                    />
                                    <MetadataInput />
                                </StepperForm.Step>
                                <StepperForm.Step label={'fields.spec.title'}>
                                    <KindSelector kinds={kinds} readOnly />
                                    <SpecInput
                                        source="spec"
                                        getUiSchema={getFunctionUiSpec}
                                    />
                                </StepperForm.Step>
                            </StepperForm>
                        </FlatCard>
                    </CreateView>
                </>
            </CreateBase>
        </Container>
    );
};
