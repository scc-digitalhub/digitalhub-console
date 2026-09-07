// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    CreateBase,
    CreateView,
    useDataProvider,
    useNotify,
    useRedirect,
    useResourceContext,
} from 'react-admin';
import { randomId } from '../../../common/utils/helpers';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { CreatePageTitle } from '../../../common/components/layout/PageTitle';
import { ModelIcon } from '../icon';
import { CreateToolbar } from '../../../common/components/toolbars/CreateToolbar';
import { useStateUpdateCallbacks } from '../../../common/hooks/useStateUpdateCallbacks';
import { useGetUploader } from '../../../features/files/upload/useGetUploader';
import { TemplatesSelector } from '../../../common/components/TemplatesSelector';
import { ModelForm } from './ModelForm';

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
    const defaultValues = template ? { id, ...template } : { id, spec: {} };

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
