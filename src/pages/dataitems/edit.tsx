// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import {
    EditBase,
    EditView,
    Labeled,
    SimpleForm,
    useNotify,
    useRecordContext,
    useRedirect,
    useResourceContext,
} from 'react-admin';
import { useWatch } from 'react-hook-form';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { FormLabel } from '../../common/components/layout/FormLabel';
import { EditPageTitle } from '../../common/components/layout/PageTitle';
import { DataItemIcon } from './icon';
import { getDataItemSpecUiSchema } from './types';
import { randomId } from '../../common/utils/helpers';
import { EditToolbar } from '../../common/components/toolbars/EditToolbar';
import { useStateUpdateCallbacks } from '../../common/hooks/useStateUpdateCallbacks';
import { useGetUploader } from '../../features/files/upload/useGetUploader';
import { PathInput } from '../../features/files/upload/components/PathInput';
import { Uploader } from '../../features/files/upload/types';
import { MetadataInput } from '../../features/metadata/components/MetadataInput';
import { ExtensionsForm } from '../../features/extensions/Form';
import { useGetExtensions } from '../../features/extensions/utils';
import { SpecInput } from '../../common/jsonSchema/components/SpecInput';

export const DataItemEdit = () => {
    const resource = useResourceContext();
    const notify = useNotify();
    const redirect = useRedirect();
    const id = useRef(randomId());
    const { onBeforeUpload, onUploadComplete } = useStateUpdateCallbacks({
        id: id.current,
    });
    const uploader = useGetUploader({
        id: id.current,
        recordId: id.current,
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
        //merge path into spec.path, then strip transient field
        const { path, ...rest } = data;
        const resetMetadataVersion = isSpecDirty && !isMetadataVersionDirty;

        //reset status if new version
        //reset metadata version if new version, unless manually filled
        return {
            ...rest,
            spec: { ...(rest.spec || {}), ...(path != null ? { path } : {}) },
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
                    <EditPageTitle icon={<DataItemIcon fontSize={'large'} />} />

                    <EditView component={Box}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm
                                toolbar={<EditToolbar />}
                                defaultValues={record =>
                                    ({
                                        path: record?.spec?.path ?? null,
                                    })
                                }>
                                <DataItemEditContent
                                    uploader={uploader}
                                    onSpecDirty={setIsSpecDirty}
                                    onMetadataVersionDirty={
                                        setIsMetadataVersionDirty
                                    }
                                />
                            </SimpleForm>
                        </FlatCard>
                    </EditView>
                </>
            </EditBase>
        </Container>
    );
};

type DataItemEditContentProps = {
    uploader: Uploader;
    onSpecDirty: (dirty: boolean) => void;
    onMetadataVersionDirty: (dirty: boolean) => void;
};

const DataItemEditContent = ({
    uploader,
    onSpecDirty,
    onMetadataVersionDirty,
}: DataItemEditContentProps) => {
    const { data: extensions } = useGetExtensions();
    const record = useRecordContext();
    const kind = useWatch({ name: 'kind' });

    return (
        <>
            <FormLabel label="fields.base" />
            <Stack direction={'row'} spacing={3} pt={4} pb={2}>
                <Labeled source="name">
                    <Typography variant="body1">{record?.name}</Typography>
                </Labeled>
                <Labeled source="kind">
                    <Typography variant="body1">{record?.kind}</Typography>
                </Labeled>
            </Stack>
            <MetadataInput onVersionDirty={onMetadataVersionDirty} />
            <SpecInput
                source="spec"
                kind={kind}
                onDirty={onSpecDirty}
                getUiSchema={k => getDataItemSpecUiSchema(k) || {}}
            />
            <PathInput source="path" uploader={uploader} />
            {extensions && extensions.length > 0 && (
                <>
                    <Divider />
                    <ExtensionsForm source="extensions" />
                </>
            )}
        </>
    );
};
