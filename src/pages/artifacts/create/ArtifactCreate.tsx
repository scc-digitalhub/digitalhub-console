// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
import { useState } from 'react';
import {
    CreateBase,
    CreateView,
    useNotify,
    useRedirect,
    useResourceContext,
} from 'react-admin';
import { randomId } from '../../../common/utils/helpers';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { CreatePageTitle } from '../../../common/components/layout/PageTitle';
import { ArtifactIcon } from '../icon';
import { useStateUpdateCallbacks } from '../../../common/hooks/useStateUpdateCallbacks';
import { useGetUploader } from '../../../features/files/upload/useGetUploader';
import { CreateToolbar } from './CreateToolbar';
import { ArtifactForm } from './ArtifactForm';

export const ArtifactCreate = () => {
    const { root } = useRootSelector();
    const [id, setId] = useState(randomId);
    const notify = useNotify();
    const redirect = useRedirect();
    const resource = useResourceContext();
    const { onBeforeUpload, onUploadComplete } = useStateUpdateCallbacks({
        id,
    });
    const uploader = useGetUploader({
        id,
        recordId: id,
        onBeforeUpload,
        onUploadComplete,
    });

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

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase
                transform={transform}
                mutationOptions={{ onSuccess, onSettled }}
                record={{ id, spec: {} }}
            >
                <>
                    <CreatePageTitle
                        icon={<ArtifactIcon fontSize={'large'} />}
                    />

                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <ArtifactForm uploader={uploader} />
                        </FlatCard>
                    </CreateView>
                </>
            </CreateBase>
        </Container>
    );
};
