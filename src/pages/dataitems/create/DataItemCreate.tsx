// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
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
import { DataItemIcon } from '../icon';
import { useState } from 'react';
import { UploaderContext } from '../../../features/files/upload/UploaderContext';
import { useResourceUploader } from '../../../features/files/upload/useRecordUploader';
import { DataItemForm } from './DataItemForm';
import { CreateToolbar } from './CreateToolbar';

export const DataItemCreate = () => {
    const { root } = useRootSelector();
    const [id] = useState(randomId);
    const notify = useNotify();
    const redirect = useRedirect();
    const resource = useResourceContext();
    const uploader = useResourceUploader({ id });

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

        uploader.start({ id: data.id, name: data.name });
        notify('ra.notification.created', { messageArgs: { smart_count: 1 } });
        redirect('list', resource);
    };

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase
                transform={transform}
                mutationOptions={{ onSuccess, onSettled }}
                record={{ id, spec: {} }}
            >
                <UploaderContext.Provider value={uploader}>
                    <CreatePageTitle
                        icon={<DataItemIcon fontSize={'large'} />}
                    />

                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <DataItemForm />
                        </FlatCard>
                    </CreateView>
                </UploaderContext.Provider>
            </CreateBase>
        </Container>
    );
};
