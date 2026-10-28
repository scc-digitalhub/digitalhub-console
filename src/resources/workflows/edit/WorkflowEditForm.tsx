// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Divider, Stack, Typography } from '@mui/material';
import { Fragment } from 'react';
import { Labeled, useRecordContext } from 'react-admin';
import { useWatch } from 'react-hook-form';
import { FormLabel } from '../../../common/components/layout/FormLabel';
import { MetadataInput } from '../../../features/metadata/components/MetadataInput';
import { SpecInput } from '../../../common/jsonSchema/components/SpecInput';
import { ExtensionsForm } from '../../../features/extensions/components/Form';
import { useGetExtensions } from '../../../features/extensions/utils';
import { useExtensionsSections } from '../../../features/extensions/sections';

export const WorkflowEditForm = ({
    onSpecDirty,
    onMetadataVersionDirty,
}: {
    onSpecDirty: (dirty: boolean) => void;
    onMetadataVersionDirty: (dirty: boolean) => void;
}) => {
    const record = useRecordContext();
    const kind = useWatch({ name: 'kind' });
    const { data: extensions } = useGetExtensions();
    const contributions = useExtensionsSections();

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

            <SpecInput source="spec" kind={kind} onDirty={onSpecDirty} />

            {contributions &&
                contributions.length > 0 &&
                contributions.map((contribution, index) => (
                    <Fragment key={contribution.key ?? `contribution-${index}`}>
                        {contribution}
                    </Fragment>
                ))}

            {extensions && extensions.length > 0 && (
                <>
                    <Divider />
                    <ExtensionsForm source="extensions" />
                </>
            )}
        </>
    );
};
