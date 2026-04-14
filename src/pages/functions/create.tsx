// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';
import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
import {
    CreateBase,
    CreateView,
    TextInput,
    required,
    useCreatePath,
    useTranslate,
} from 'react-admin';
import { KindSelector } from '../../common/components/KindSelector';
import { SpecInput } from '../../common/jsonSchema/components/SpecInput';
import {
    CreatePageTitle,
    PageTitle,
} from '../../common/components/layout/PageTitle';
import { getFunctionUiSpec } from './types';
import { FunctionIcon } from './icon';
import { useCreateFlow } from '../../common/hooks/useCreateFlow';
import { TemplatesSelector } from '../../common/components/TemplatesSelector';
import { useSchemaProvider } from '../../common/provider/schemaProvider';
import { BackButton } from '@dslab/ra-back-button';
import { StepperForm } from '@dslab/ra-stepper';
import { StepperToolbar } from '../../common/components/toolbars/StepperToolbar';
import { CreateToolbar } from '../../common/components/toolbars/CreateToolbar';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { isAlphaNumeric } from '../../common/utils/helpers';
import { MetadataInput } from '../../features/metadata/components/MetadataInput';
import { useGetSchemas } from '../../common/jsonSchema/schemaController';
import { ExtensionsForm } from '../../features/extensions/Form';

export const FunctionCreate = () => {
    const { root } = useRootSelector();
    const schemaProvider = useSchemaProvider();
    const createPath = useCreatePath();
    const cancelUrl = createPath({ resource: 'functions', type: 'list' });

    const {
        template,
        isSelector,
        isFromTemplate,
        startFromScratch,
        startFromTemplate,
        reset,
    } = useCreateFlow();
    const translate = useTranslate();

    const transform = useCallback(
        (data: any) => ({ ...data, project: root || '' }),
        [root]
    );

    const [schemas, setSchemas] = useState<any[]>();

    const kinds = schemas
        ?.map(s => ({ id: s.kind, name: s.kind }))
        .sort((a, b) => a.name.localeCompare(b.name));

    useEffect(() => {
        if (schemaProvider && !schemas?.length) {
            schemaProvider.list('functions').then(res => {
                if (res) setSchemas(res);
            });
        }
    }, [schemaProvider]);

    const defaultValues = isFromTemplate && template ? { ...template } : {};

    if (isSelector) {
        return (
            <Container maxWidth={false} sx={{ pb: 2 }}>
                <PageTitle
                    text={translate(
                        'resources.functions.template_selector.title'
                    )}
                    icon={<FunctionIcon fontSize={'large'} />}
                />
                <BackButton />
                <TemplatesSelector
                    template={null}
                    onSelected={template => {
                        if (template) startFromTemplate(template);
                        else startFromScratch();
                    }}
                />
            </Container>
        );
    }

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase
                resource="functions"
                transform={transform}
                redirect="list"
                record={defaultValues}
            >
                <>
                    <CreatePageTitle icon={<FunctionIcon fontSize="large" />} />
                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <FunctionForm
                                kinds={kinds}
                                isFromTemplate={isFromTemplate}
                                cancelUrl={isFromTemplate ? cancelUrl : undefined}
                                onCancel={!isFromTemplate ? reset : undefined}
                            />
                        </FlatCard>
                    </CreateView>
                </>
            </CreateBase>
        </Container>
    );
};

export const FunctionForm = (props: {
    kinds?: { id: string; name: string }[];
    isFromTemplate?: boolean;
    cancelUrl?: string;
    onCancel?: () => void;
}) => {
    const { kinds, isFromTemplate, cancelUrl, onCancel } = props;

    const { data: extensionSchemas } = useGetSchemas('extensions');

    const toolbar = (
        <StepperToolbar
            cancelUrl={cancelUrl}
            onCancel={onCancel}
            alwaysEnableSave={true}
        />
    );

    //TODO fix stepperform handling for empty (null) children
    if (extensionSchemas && extensionSchemas.length > 0) {
        return (
            <StepperForm toolbar={toolbar}>
                <StepperForm.Step label="fields.kind">
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 4 }}>
                        <KindSelector
                            kinds={kinds}
                            readOnly={isFromTemplate}
                        />
                    </Box>
                </StepperForm.Step>
                <StepperForm.Step label="fields.base">
                    <TextInput
                        source="name"
                        validate={[required(), isAlphaNumeric()]}
                    />
                    <MetadataInput />
                </StepperForm.Step>
                <StepperForm.Step label="fields.spec.title">
                    <SpecInput source="spec" getUiSchema={getFunctionUiSpec} />
                </StepperForm.Step>
                <StepperForm.Step label="fields.extensions.title">
                    <ExtensionsForm source="extensions" />
                </StepperForm.Step>
            </StepperForm>
        );
    } else {
        return (
            <StepperForm toolbar={toolbar}>
                <StepperForm.Step label="fields.kind">
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 4 }}>
                        <KindSelector
                            kinds={kinds}
                            readOnly={isFromTemplate}
                        />
                    </Box>
                </StepperForm.Step>
                <StepperForm.Step label="fields.base">
                    <TextInput
                        source="name"
                        validate={[required(), isAlphaNumeric()]}
                    />
                    <MetadataInput />
                </StepperForm.Step>
                <StepperForm.Step label="fields.spec.title">
                    <SpecInput source="spec" getUiSchema={getFunctionUiSpec} />
                </StepperForm.Step>
            </StepperForm>
        );
    }
};