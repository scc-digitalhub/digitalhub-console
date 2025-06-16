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
import { DataItemIcon } from './icon';
import { getDataItemSpecUiSchema } from './types';
import { useUploadController } from '../../controllers/uploadController';
import { randomId } from '../../common/helper';
import { EditToolbar } from '../../components/toolbars/EditToolbar';
import { EditFormContentWithUpload } from '../../components/upload/EditFormContentWithUpload';

export const DataItemEdit = () => {
    const resource = useResourceContext();
    const notify = useNotify();
    const redirect = useRedirect();
    const id = useRef(randomId());
    const uploader = useUploadController({
        id: id.current,
    });
    const [isSpecDirty, setIsSpecDirty] = useState<boolean>(false);

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

        //reset status if new version
        return {
            ...rest,
            status: isSpecDirty ? {} : rest.status,
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
                    <EditPageTitle icon={<DataItemIcon fontSize={'large'} />} />

                    <EditView component={Box}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm toolbar={<EditToolbar />}>
                                <EditFormContentWithUpload
                                    onSpecDirty={setIsSpecDirty}
                                    uploader={uploader}
                                    getSpecUiSchema={getDataItemSpecUiSchema}
                                />
                            </SimpleForm>
                        </FlatCard>
                    </EditView>
                </>
            </EditBase>
        </Container>
    );
};
