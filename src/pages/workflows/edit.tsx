// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import { useState } from 'react';
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
import { WorkflowIcon } from './icon';
import { getWorkflowUiSpec } from './types';
import { EditToolbar } from '../../common/components/toolbars/EditToolbar';
import { MetadataInput } from '../../features/metadata/components/MetadataInput';
import { SpecInput } from '../../common/jsonSchema/components/SpecInput';
import { ExtensionsForm } from '../../features/extensions/Form';
import { useGetExtensions } from '../../features/extensions/utils';

export const WorkflowEdit = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const resource = useResourceContext();
    const [isSpecDirty, setIsSpecDirty] = useState<boolean>(false);
    const [isMetadataVersionDirty, setIsMetadataVersionDirty] =
        useState<boolean>(false);

    const onSuccess = () => {};
    const onSettled = data => {
        notify('ra.notification.updated', {
            type: 'info',
            messageArgs: { smart_count: 1 },
        });
        redirect('show', resource, data.id, data);
    };

    const transform = data => {
        const resetMetadataVersion = isSpecDirty && !isMetadataVersionDirty;

        //reset metadata version if new version, unless manually filled
        return {
            ...data,
            metadata: resetMetadataVersion
                ? { ...data.metadata, version: undefined }
                : data.metadata,
        };
    };

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <EditBase
                mutationMode="optimistic"
                transform={transform}
                mutationOptions={{
                    meta: { update: !isSpecDirty },
                    onSuccess: onSuccess,
                    onSettled: onSettled,
                }}
            >
                <>
                    <EditPageTitle icon={<WorkflowIcon fontSize={'large'} />} />

                    <EditView component={Box}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm toolbar={<EditToolbar />}>
                                <WorkflowEditContent
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

const WorkflowEditContent = ({
    onSpecDirty,
    onMetadataVersionDirty,
}: {
    onSpecDirty: (dirty: boolean) => void;
    onMetadataVersionDirty: (dirty: boolean) => void;
}) => {
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
                getUiSchema={k => getWorkflowUiSpec(k) || {}}
            />

            {extensions && extensions.length > 0 && (
                <>
                    <Divider />
                    <ExtensionsForm source="extensions" />
                </>
            )}
        </>
    );
};
