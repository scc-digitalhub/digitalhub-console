// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
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
import { StepperForm } from '@dslab/ra-stepper';
import { StepperToolbar } from '../../common/components/toolbars/StepperToolbar';
import { CreateToolbar } from '../../common/components/toolbars/CreateToolbar';
import { CreateSpecWithUpload } from '../../common/components/upload/CreateSpecWithUpload';
import { useStateUpdateCallbacks } from '../../common/hooks/useStateUpdateCallbacks';
import { useGetUploader } from '../../features/files/upload/useGetUploader';
import { Uploader } from '../../features/files/upload/types';
import { useGetSchemas } from '../../common/jsonSchema/schemaController';
import { ExtensionsForm } from '../../features/extensions/Form';
import { TemplatesSelector } from '../../common/components/TemplatesSelector';

export const ModelCreate = () => {
    const { root } = useRootSelector();
    const dataProvider = useDataProvider();
    const id = useRef(randomId());
    const notify = useNotify();
    const redirect = useRedirect();
    const resource = useResourceContext();
    const [templates, setTemplates] = useState<any[] | undefined>();
    const [template, setTemplate] = useState<any | undefined>();

    const { onBeforeUpload, onUploadComplete } = useStateUpdateCallbacks({
        id: id.current,
    });
    const uploader = useGetUploader({
        id: id.current,
        recordId: id.current,
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
        //strip path tl which is a transient field
        const { path, ...rest } = data;

        return {
            ...rest,
            project: root,
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
        redirect('list', resource);
    };
    const defaultValues = template
        ? { id: id.current, ...template }
        : { id: id.current, spec: { path: null } };

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

    //check if any extension is available
    const { data: schemas } = useGetSchemas('extensions');

    //TODO fix stepperform handling for empty (null) children
    if (schemas && schemas.length > 0) {
        return (
            <StepperForm toolbar={<StepperToolbar onCancel={onCancel} />}>
                <StepperForm.Step label="fields.base">
                    <TextInput
                        source="name"
                        validate={[required(), isAlphaNumeric()]}
                    />
                    <MetadataInput kinds={['metadata.base']} />
                </StepperForm.Step>
                <StepperForm.Step label="fields.spec.title">
                    <CreateSpecWithUpload
                        uploader={uploader}
                        getSpecUiSchema={getModelSpecUiSchema}
                    />
                </StepperForm.Step>
                <StepperForm.Step label={'fields.extensions.title'}>
                    <ExtensionsForm source="extensions" />
                </StepperForm.Step>
            </StepperForm>
        );
    } else {
        return (
            <StepperForm toolbar={<StepperToolbar />}>
                <StepperForm.Step label="fields.base">
                    <TextInput
                        source="name"
                        validate={[required(), isAlphaNumeric()]}
                    />
                    <MetadataInput kinds={['metadata.base']} />
                </StepperForm.Step>
                <StepperForm.Step label="fields.spec.title">
                    <CreateSpecWithUpload
                        uploader={uploader}
                        getSpecUiSchema={getModelSpecUiSchema}
                    />
                </StepperForm.Step>
            </StepperForm>
        );
    }
};
