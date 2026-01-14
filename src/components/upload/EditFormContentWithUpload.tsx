// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { TextInput, useInput, useResourceContext } from 'react-admin';
import { FormLabel } from '../../components/FormLabel';
import { MetadataInput } from '../../components/MetadataInput';
import { FileInput } from '../../files/upload/components/FileInput';
import { SpecInput } from '../../components/SpecInput';
import { Uploader } from '../../files/upload/types';

export type EditFormContentWithUploadProps = {
    onSpecDirty?: (state: boolean) => void;
    onMetadataVersionDirty?: (state: boolean) => void;
    uploader?: Uploader;
    getSpecUiSchema: (kind: string | undefined) => any;
};

export const EditFormContentWithUpload = (
    props: EditFormContentWithUploadProps
) => {
    const { onSpecDirty, onMetadataVersionDirty, uploader, getSpecUiSchema } =
        props;
    const resource = useResourceContext();

    //update path in spec depending on upload
    //we need to watch it here because path is nested in spec
    const { field } = useInput({ resource, source: 'spec' });
    const { field: nameField } = useInput({ resource, source: 'name' });
    useEffect(() => {
        if (uploader && field && uploader.path) {
            field.onChange({ ...field.value, path: uploader.path });
        }
    }, [uploader?.path]);

    //update name in controller
    useEffect(() => {
        if (uploader && nameField.value) {
            uploader.setName(nameField.value);
        }
    }, [uploader, nameField?.value]);

    const getUiSchema = (kind: string | undefined) => {
        if (!kind) {
            return undefined;
        }
        let uiSchema = getSpecUiSchema(kind) as any;
        if (!uiSchema) uiSchema = {};

        if (uploader?.path != null) {
            uiSchema['path'] = { 'ui:readonly': true };
        }

        return uiSchema;
    };

    return (
        <>
            <FormLabel label="fields.base" />
            <Stack direction={'row'} spacing={3} pt={4}>
                <TextInput source="name" readOnly />
                <TextInput source="kind" readOnly />
            </Stack>
            <MetadataInput onVersionDirty={onMetadataVersionDirty} />
            <SpecInput
                source="spec"
                onDirty={onSpecDirty}
                getUiSchema={getUiSchema}
            />
            {uploader && <FileInput uploader={uploader} source="path" />}
        </>
    );
};
