// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Container } from '@mui/material';
import { useRef, useState } from 'react';
import {
    EditBase,
    EditView,
    SimpleForm,
    useNotify,
    useRedirect,
    useResourceContext,
} from 'react-admin';
import { FlatCard } from '../../components/FlatCard';
import { EditPageTitle } from '../../components/PageTitle';
import { ModelIcon } from './icon';
import { getModelSpecUiSchema } from './types';
import { useUploadController } from '../../controllers/uploadController';
import { randomId } from '../../common/helper';
import { EditToolbar } from '../../components/toolbars/EditToolbar';
import { EditFormContentWithUpload } from '../../components/upload/EditFormContentWithUpload';
import { useStateUpdateCallbacks } from '../../controllers/useStateUpdateCallbacks';

export const ModelEdit = () => {
    const resource = useResourceContext();
    const notify = useNotify();
    const redirect = useRedirect();
    const id = useRef(randomId());
    const { onBeforeUpload, onUploadComplete } = useStateUpdateCallbacks({
        id: id.current,
    });
    const uploader = useUploadController({
        id: id.current,
        onBeforeUpload,
        onUploadComplete,
    });
    const [isSpecDirty, setIsSpecDirty] = useState<boolean>(false);
    const [isMetadataVersionDirty, setIsMetadataVersionDirty] =
        useState<boolean>(false);

    //overwrite onSuccess and use onSettled to handle optimistic rendering
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

        notify('ra.notification.updated', {
            type: 'info',
            messageArgs: { smart_count: 1 },
        });
        redirect('show', resource, data.id, data);
    };

    const transform = data => {
        //strip path tl which is a transient field
        const { path, ...rest } = data;
        const resetMetadataVersion = isSpecDirty && !isMetadataVersionDirty;

        //reset status if new version
        //reset metadata version if new version, unless manually filled
        return {
            ...rest,
            status: isSpecDirty ? {} : rest.status,
            metadata: resetMetadataVersion
                ? { ...rest.metadata, version: undefined }
                : rest.metadata,
        };
    };

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <EditBase
                mutationMode="optimistic"
                transform={transform}
                mutationOptions={{
                    meta: { update: !isSpecDirty, id: id.current },
                    onSuccess,
                    onSettled,
                }}
            >
                <>
                    <EditPageTitle icon={<ModelIcon fontSize={'large'} />} />

                    <EditView component={Box}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm toolbar={<EditToolbar />}>
                                <EditFormContentWithUpload
                                    onSpecDirty={setIsSpecDirty}
                                    onMetadataVersionDirty={
                                        setIsMetadataVersionDirty
                                    }
                                    uploader={uploader}
                                    getSpecUiSchema={getModelSpecUiSchema}
                                />
                            </SimpleForm>
                        </FlatCard>
                    </EditView>
                </>
            </EditBase>
        </Container>
    );
};
