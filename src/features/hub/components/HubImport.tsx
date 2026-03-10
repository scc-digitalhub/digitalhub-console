// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0
import 'ace-builds/src-noconflict/ace';
import { useEffect, useState } from 'react';
import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
import {
    CreateBase,
    CreateView,
    LoadingIndicator,
    TextInput,
    required,
} from 'react-admin';
import { useLocation } from 'react-router-dom';
import { StepperForm } from '@dslab/ra-stepper';
import { FunctionIcon } from '../../../pages/functions/icon';
import { getFunctionUiSpec } from '../../../pages/functions/types';
import { MetadataInput } from '../../metadata/components/MetadataInput';
import { KindSelector } from '../../../common/components/KindSelector';
import { SpecInput } from '../../../common/jsonSchema/components/SpecInput';
import { useSchemaProvider } from '../../../common/provider/schemaProvider';
import { StepperToolbar } from '../../../common/components/toolbars/StepperToolbar';
import { CreateToolbar } from '../../../common/components/toolbars/CreateToolbar';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { CreatePageTitle } from '../../../common/components/layout/PageTitle';
import { isAlphaNumeric } from '../../../common/utils/helpers';

export const FunctionHubImport = () => {
    const { root } = useRootSelector();
    const { state } = useLocation();
    const hubTemplate = state?.hubTemplate;

    const schemaProvider = useSchemaProvider();
    const [schemas, setSchemas] = useState<any[]>();
    useEffect(() => {
        if (schemaProvider && !schemas?.length) {
            schemaProvider.list('functions').then(res => {
                if (res) setSchemas(res);
            });
        }
    }, [schemaProvider]);
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



    const defaultValues = hubTemplate
        ? {
              kind: hubTemplate.kind,
              metadata: {
                  name: hubTemplate.metadata?.name || '',
                  description: hubTemplate.metadata?.description || '',
                  labels: hubTemplate.metadata?.labels || [],
              },
              spec: hubTemplate.spec || {},
          }
        : {};

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase
                transform={transform}
                resource="functions"
                redirect="show"
                record={defaultValues}
            >
                <>
                    <CreatePageTitle
                        icon={<FunctionIcon fontSize={'large'} />}
                    />
                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <StepperForm toolbar={<StepperToolbar />}>

                                {/* Step 1: Base */}
                                <StepperForm.Step label={'fields.base'}>
                                    <KindSelector
                                        kinds={kinds}
                                        readOnly
                                    />
                                    <TextInput
                                        source="name"
                                        placeholder={hubTemplate?.name}
                                        validate={[
                                            required(),
                                            isAlphaNumeric(),
                                        ]}
                                    />
                                    <MetadataInput />
                                </StepperForm.Step>

                                {/* Step 2: Spec */}
                                <StepperForm.Step label={'fields.spec.title'}>
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