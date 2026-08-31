// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
import {
    JSXElementConstructor,
    ReactElement,
    useEffect,
    useState,
} from 'react';
import {
    CreateBase,
    CreateView,
    TextInput,
    required,
    useDataProvider,
    useNotify,
    useRedirect,
    useResourceContext,
} from 'react-admin';
import { isAlphaNumeric, randomId } from '../../common/utils/helpers';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { CreatePageTitle } from '../../common/components/layout/PageTitle';
import { ModelIcon } from './icon';
import { getModelSpecUiSchema } from './types';
import { MetadataInput } from '../../features/metadata/components/MetadataInput';
import { Step, StepperForm } from '@dslab/ra-stepper';
import { StepperToolbar } from '../../common/components/toolbars/StepperToolbar';
import { CreateToolbar } from '../../common/components/toolbars/CreateToolbar';
import { useStateUpdateCallbacks } from '../../common/hooks/useStateUpdateCallbacks';
import { useGetUploader } from '../../features/files/upload/useGetUploader';
import { Uploader } from '../../features/files/upload/types';
import { useUploaderNameSync } from '../../features/files/upload/useUploaderSync';
import { useGetExtensions } from '../../features/extensions/utils';
import { ExtensionsForm } from '../../features/extensions/Form';
import { TemplatesSelector } from '../../common/components/TemplatesSelector';
import { useGetSchemas } from '../../common/jsonSchema/schemaController';
import { KindSelector } from '../../common/components/KindSelector';
import { KindChangeGuard } from '../../common/components/KindChangeGuard';
import { SpecInput } from '../../common/jsonSchema/components/SpecInput';
import { PathInput } from '../../features/files/upload/components/PathInput';
import { useWatch } from 'react-hook-form';

export const ModelCreate = () => {
    const { root } = useRootSelector();
    const dataProvider = useDataProvider();
    const [id, setId] = useState(randomId);
    const notify = useNotify();
    const redirect = useRedirect();
    const resource = useResourceContext();
    const [templates, setTemplates] = useState<any[] | undefined>();
    const [template, setTemplate] = useState<any | undefined>();

    const { onBeforeUpload, onUploadComplete } = useStateUpdateCallbacks({
        id,
    });
    const uploader = useGetUploader({
        id,
        recordId: id,
        onBeforeUpload,
        onUploadComplete,
    });

    useEffect(() => {
        if (dataProvider) {
            dataProvider
                .getList('templates', {
                    pagination: { page: 1, perPage: 100 },
                    sort: { field: 'name', order: 'ASC' },
                    filter: { type: resource?.slice(0, -1) },
                })
                .then(({ data }) => {
                    setTemplates(data);
                });
        }
    }, [resource, dataProvider]);

    const transform = data => {
        //merge path into spec.path, then strip transient field
        const { path, ...rest } = data;

        return {
            ...rest,
            project: root,
            spec: { ...(rest.spec || {}), ...(path != null ? { path } : {}) },
        };
    };

    const onSuccess = () => {};

    const onSettled = (data, error) => {
        if (error) {
            //onError already handles notify
            return;
        }

        //post save we start uploading
        if (uploader.files.length > 0) {
            uploader.upload(data);
        }

        notify('ra.notification.created', { messageArgs: { smart_count: 1 } });
        setId(randomId());
        redirect('list', resource);
    };
    const defaultValues = template
        ? { id, ...template }
        : { id, spec: {} };

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase
                resource="models"
                transform={transform}
                redirect="list"
                record={defaultValues}
                mutationOptions={{ onSuccess, onSettled }}
            >
                <>
                    <CreatePageTitle icon={<ModelIcon fontSize={'large'} />} />

                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            {templates &&
                            templates.length > 0 &&
                            template === undefined ? (
                                <TemplatesSelector
                                    templates={templates}
                                    template={template}
                                    onSelected={setTemplate}
                                />
                            ) : (
                                <ModelForm
                                    uploader={uploader}
                                    onCancel={() => {
                                        if (templates && templates.length) {
                                            setTemplate(undefined);
                                        } else {
                                            redirect('list', resource);
                                        }
                                    }}
                                />
                            )}
                        </FlatCard>
                    </CreateView>
                </>
            </CreateBase>
        </Container>
    );
};

export const ModelForm = (props: {
    uploader?: Uploader;
    onCancel?: () => void;
}) => {
    const { uploader, onCancel } = props;
    const resource = useResourceContext();

    const { data: kindSchemas } = useGetSchemas(resource || '');
    const { data: extensions } = useGetExtensions();
    const kinds = kindSchemas
        ? kindSchemas.map(s => ({ id: s.kind, name: s.kind }))
        : [];

    //TODO fix stepperform handling for empty (null) children
    //we build steps outside to avoid false/null children to stepperForm
    const steps: ReactElement<any, JSXElementConstructor<Step>>[] = [
        <StepperForm.Step key="base" label={'fields.base'}>
            <ModelBaseStepContent uploader={uploader} />
        </StepperForm.Step>,
        <StepperForm.Step key="spec" label={'fields.spec.title'}>
            <ModelSpecStepContent uploader={uploader} kinds={kinds} />
        </StepperForm.Step>,
    ];

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

const ModelBaseStepContent = ({ uploader }: { uploader?: Uploader }) => {
    useUploaderNameSync({ uploader });
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

const ModelSpecStepContent = ({
    uploader,
    kinds,
}: {
    uploader?: Uploader;
    kinds: { id: string; name: string }[];
}) => {
    const kind = useWatch({ name: 'kind' });
    return (
        <>
            <KindChangeGuard />
            <KindSelector kinds={kinds} />
            <SpecInput
                source="spec"
                kind={kind}
                getUiSchema={getModelSpecUiSchema}
            />
            {kind && <PathInput source="path" uploader={uploader} />}
        </>
    );
};
