// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    EditBase,
    EditView,
    LoadingIndicator,
    SelectInput,
    SimpleForm,
    TextInput,
    useNotify,
    useRedirect,
    useResourceContext,
} from 'react-admin';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { FormLabel } from '../../common/components/layout/FormLabel';
import { EditPageTitle } from '../../common/components/layout/PageTitle';
import { useSchemaProvider } from '../../common/provider/schemaProvider';
import { FunctionIcon } from './icon';
import { getFunctionUiSpec } from './types';
import { MetadataInput } from '../../features/metadata/components/MetadataInput';
import { EditToolbar } from '../../common/components/toolbars/EditToolbar';
import { SpecInput } from '../../common/jsonSchema/components/SpecInput';

export const FunctionEdit = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const resource = useResourceContext();
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();
    const [isSpecDirty, setIsSpecDirty] = useState<boolean>(false);
    const [isMetadataVersionDirty, setIsMetadataVersionDirty] =
        useState<boolean>(false);

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.list('functions').then(res => {
                if (res) {
                    const values = res.map(s => ({
                        id: s.kind,
                        name: s.kind,
                    }));
                    setKinds(values);
                }
            });
        }
    }, [schemaProvider, setKinds]);

    if (!kinds) {
        return <LoadingIndicator />;
    }

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
                    <EditPageTitle icon={<FunctionIcon fontSize={'large'} />} />

                    <EditView component={Box}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm toolbar={<EditToolbar />}>
                                <FormLabel label="fields.base" />

                                <Stack direction={'row'} spacing={3} pt={4}>
                                    <TextInput source="name" readOnly />

                                    <SelectInput
                                        source="kind"
                                        choices={kinds}
                                        readOnly
                                    />
                                </Stack>

                                <MetadataInput
                                    onVersionDirty={setIsMetadataVersionDirty}
                                />

                                <SpecInput
                                    source="spec"
                                    onDirty={setIsSpecDirty}
                                    getUiSchema={getFunctionUiSpec}
                                />
                            </SimpleForm>
                        </FlatCard>
                    </EditView>
                </>
            </EditBase>
        </Container>
    );
};
