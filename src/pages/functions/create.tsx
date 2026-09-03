// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    JSXElementConstructor,
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
import {
    CreateBase,
    CreateView,
    TextInput,
    required,
    useCreatePath,
    useDataProvider,
    useNotify,
    useRedirect,
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
import { Step, StepperForm } from '@dslab/ra-stepper';
import { StepperToolbar } from '../../common/components/toolbars/StepperToolbar';
import { CreateToolbar } from '../../common/components/toolbars/CreateToolbar';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { isAlphaNumeric } from '../../common/utils/helpers';
import { MetadataInput } from '../../features/metadata/components/MetadataInput';
import { ExtensionsForm } from '../../features/extensions/Form';
import { buildParentRef } from '../../features/hub/utils';
import { useGetExtensions } from '../../features/extensions/utils';
import { KindChangeGuard } from '../../common/components/KindSelector';

export const FunctionCreate = () => {
    const { root } = useRootSelector();
    const dataProvider = useDataProvider();
    const schemaProvider = useSchemaProvider();
    const createPath = useCreatePath();
    const redirect = useRedirect();
    const notify = useNotify();
    const cancelUrl = createPath({ resource: 'functions', type: 'list' });

    const {
        template,
        childDocs,
        isSelector,
        isFromTemplate,
        startFromScratch,
        startFromTemplate,
        reset,
    } = useCreateFlow();

    const translate = useTranslate();

    const transform = useCallback(
        (data: any) => {
            const { id, ...rest } = data;
            return { ...rest, project: root || '' };
        },
        [root]
    );
    const mutationOptions = useMemo(
        () => ({
            onSuccess: async (created: any) => {
                if (childDocs?.length) {
                    for (const childDoc of childDocs) {
                        const childPayload = {
                            kind: childDoc.kind,
                            project: root || '',
                            metadata: {
                                ...(childDoc.metadata || {}),
                                project: root || '',
                            },
                            name: childDoc.name,
                            spec: {
                                ...(childDoc.spec || {}),
                                function: buildParentRef(
                                    created.kind,
                                    root || '',
                                    created.name,
                                    created.id
                                ),
                            },
                        };

                        try {
                            await dataProvider.create('tasks', {
                                data: childPayload,
                                meta: { root },
                            });
                        } catch (error: any) {
                            notify(
                                error?.message || 'ra.notification.http_error',
                                { type: 'error' }
                            );
                            console.error(
                                'Failed to create task:',
                                childPayload,
                                error
                            );
                            return;
                        }
                    }
                }
                notify('ra.notification.created', { type: 'info' });
                redirect('list', 'functions');
            },
        }),
        [childDocs, root, dataProvider, redirect, notify]
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
                mutationOptions={mutationOptions}
            >
                <>
                    <CreatePageTitle icon={<FunctionIcon fontSize="large" />} />
                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <FunctionForm
                                kinds={kinds}
                                isFromTemplate={isFromTemplate}
                                cancelUrl={
                                    isFromTemplate ? cancelUrl : undefined
                                }
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
    const [kind, setKind] = useState<string | undefined>();
    const [isSpecDirty, setIsSpecDirty] = useState(false);

    const { data: schemas } = useGetExtensions();

    //TODO fix stepperform handling for empty (null) children
    //we build steps outside to avoid false/null children to stepperForm
    const steps: ReactElement<any, JSXElementConstructor<Step>>[] = [
        <StepperForm.Step key="kind" label="fields.kind">
            <FunctionKindStepContent
                kinds={kinds}
                isFromTemplate={isFromTemplate}
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

    return (
        <StepperForm
            toolbar={
                <StepperToolbar cancelUrl={cancelUrl} onCancel={onCancel} />
            }
        >
            {steps}
        </StepperForm>
    );
};

const FunctionKindStepContent = ({
    kinds,
    isFromTemplate,
    isSpecDirty,
    onKindConfirm,
}: {
    kinds?: { id: string; name: string }[];
    isFromTemplate?: boolean;
    isSpecDirty: boolean;
    onKindConfirm: (nextKind: string | undefined) => void;
}) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', p: 4 }}>
            <KindChangeGuard isDirty={isSpecDirty} onConfirm={onKindConfirm} />
            <KindSelector kinds={kinds} readOnly={isFromTemplate} />
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
    return (
        <SpecInput
            source="spec"
            kind={kind}
            onDirty={onSpecDirty}
            getUiSchema={getFunctionUiSpec}
        />
    );
};
