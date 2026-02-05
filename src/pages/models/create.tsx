// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
import { useRef } from 'react';
import {
    CreateBase,
    CreateView,
    TextInput,
    required,
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

export const ModelCreate = () => {
    const { root } = useRootSelector();
    const id = useRef(randomId());
    const notify = useNotify();
    const redirect = useRedirect();
    const resource = useResourceContext();
    const { onBeforeUpload, onUploadComplete } = useStateUpdateCallbacks({
        id: id.current,
    });
    const uploader = useGetUploader({
        id: id.current,
        recordId: id.current,
        onBeforeUpload,
        onUploadComplete,
    });

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

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase
                transform={transform}
                mutationOptions={{ onSuccess, onSettled }}
                record={{ id: id.current, spec: { path: null } }}
            >
                <>
                    <CreatePageTitle icon={<ModelIcon fontSize={'large'} />} />

                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <ModelForm uploader={uploader} />
                        </FlatCard>
                    </CreateView>
                </>
            </CreateBase>
        </Container>
    );
};

export const ModelForm = (props: { uploader?: Uploader }) => {
    const { uploader } = props;

    return (
        <StepperForm toolbar={<StepperToolbar />}>
            <StepperForm.Step label="fields.base">
                <TextInput
                    source="name"
                    validate={[required(), isAlphaNumeric()]}
                />
                <MetadataInput />
            </StepperForm.Step>
            <StepperForm.Step label="fields.spec.title">
                <CreateSpecWithUpload
                    uploader={uploader}
                    getSpecUiSchema={getModelSpecUiSchema}
                />
            </StepperForm.Step>
        </StepperForm>
    );
};
