// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
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
import { ModelIcon } from './icon';
import { getModelSpecUiSchema } from './types';
import { randomId } from '../../common/utils/helpers';
import { EditToolbar } from '../../common/components/toolbars/EditToolbar';
import { useStateUpdateCallbacks } from '../../common/hooks/useStateUpdateCallbacks';
import { useGetUploader } from '../../features/files/upload/useGetUploader';
import { PathInput } from '../../features/files/upload/components/PathInput';
import { Uploader } from '../../features/files/upload/types';
import { MetadataInput } from '../../features/metadata/components/MetadataInput';
import { useGetExtensions } from '../../features/extensions/utils';
import { ExtensionsForm } from '../../features/extensions/Form';
import { SpecInput } from '../../common/jsonSchema/components/SpecInput';
import { useSchemaProvider } from '../../common/provider/schemaProvider';
import { filterProperties } from '../../common/jsonSchema/utils';

export const ModelEdit = () => {
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
                    <EditPageTitle icon={<ModelIcon fontSize={'large'} />} />

                    <EditView component={Box}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm
                                toolbar={<EditToolbar />}
                                defaultValues={record =>
                                    ({
                                        path: record?.spec?.path ?? null,
                                    })
                                }>
                                <ModelEditContent
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

const ModelEditContent = ({
    uploader,
    onSpecDirty,
    onMetadataVersionDirty,
}: {
    uploader: Uploader;
    onSpecDirty: (dirty: boolean) => void;
    onMetadataVersionDirty: (dirty: boolean) => void;
}) => {
    const { data: extensions } = useGetExtensions();
    const record = useRecordContext();
    const kind = useWatch({ name: 'kind' });
    const [schema, setSchema] = useState<any>();
    const schemaProvider = useSchemaProvider();
    const resource = useResourceContext();

    useEffect(() => {
        if (!kind || !resource || !schemaProvider) {
            setSchema(undefined);
            return;
        }

        schemaProvider
            .get(resource, kind)
            .then(schemaResult => {
                const nextSchema = filterProperties(schemaResult?.schema, ['path']);
                setSchema(nextSchema ?? undefined);
            })
            .catch(() => setSchema(undefined));
    }, [kind, resource, schemaProvider]);

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
                schema={schema}
                kind={kind}
                onDirty={onSpecDirty}
                getUiSchema={k => getModelSpecUiSchema(k) || {}}
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
