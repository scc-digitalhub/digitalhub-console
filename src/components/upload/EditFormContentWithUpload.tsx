import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { TextInput, useInput, useResourceContext } from 'react-admin';
import { FormLabel } from '../../components/FormLabel';
import { MetadataInput } from '../../components/MetadataInput';
import { UploadController } from '../../controllers/uploadController';
import { FileInput } from '../../components/FileInput';
import { SpecInput } from '../../components/SpecInput';

export type EditFormContentWithUploadProps = {
    onSpecDirty?: (state: boolean) => void;
    uploader?: UploadController;
    getSpecUiSchema: (kind: string | undefined) => any;
};

export const EditFormContentWithUpload = (
    props: EditFormContentWithUploadProps
) => {
    const { onSpecDirty, uploader, getSpecUiSchema } = props;
    const resource = useResourceContext();

    //update path in spec depending on upload
    //we need to watch it here because path is nested in spec
    const { field } = useInput({ resource, source: 'spec' });
    useEffect(() => {
        if (uploader && field) {
            field.onChange({ ...field.value, path: uploader.path });
        }
    }, [uploader?.path]);

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
            <MetadataInput />
            <SpecInput
                source="spec"
                onDirty={onSpecDirty}
                getUiSchema={getUiSchema}
            />
            {uploader && <FileInput uploader={uploader} source="path" />}
        </>
    );
};
