import { Box, Container, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import {
    EditBase,
    EditView,
    SimpleForm,
    TextInput,
    useInput,
    useNotify,
    useRedirect,
    useResourceContext,
} from 'react-admin';
import { FlatCard } from '../../components/FlatCard';
import { FormLabel } from '../../components/FormLabel';
import { EditPageTitle } from '../../components/PageTitle';
import { DataItemIcon } from './icon';
import { getDataItemSpecUiSchema } from './types';
import { MetadataInput } from '../../components/MetadataInput';
import { FileInput } from '../../components/FileInput';
import {
    UploadController,
    useUploadController,
} from '../../controllers/uploadController';
import { SpecInput } from '../../components/SpecInput';
import { randomId } from '../../common/helper';
import { EditToolbar } from '../../components/toolbars/EditToolbar';

export const DataItemEdit = () => {
    const resource = useResourceContext();
    const notify = useNotify();
    const redirect = useRedirect();
    const id = useRef(randomId());
    const uploader = useUploadController({
        id: id.current,
    });
    const [isSpecDirty, setIsSpecDirty] = useState<boolean>(false);

    //override onSuccess and use onSettled to handle optimistic rendering
    const onSuccess = (data, variables, context) => {};
    const onSettled = async (data, error, variables, context) => {
        //upload and notify only if success, otherwise onError will handle notify
        if (!error) {
            await uploader.upload();
            notify('ra.notification.updated', {
                type: 'info',
                messageArgs: { smart_count: 1 },
            });
            redirect('show', resource, data.id, data);
        }
    };

    const transform = data => {
        //strip path tl which is a transient field
        const { path, ...rest } = data;

        return {
            ...rest,
            status: {
                files: uploader.files.map(f => f.info),
            },
        };
    };

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <EditBase
                mutationMode="optimistic"
                transform={transform}
                mutationOptions={{
                    meta: { update: !isSpecDirty, id: id.current },
                    onSuccess: onSuccess,
                    onSettled: onSettled,
                }}
            >
                <>
                    <EditPageTitle icon={<DataItemIcon fontSize={'large'} />} />

                    <EditView component={Box}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm toolbar={<EditToolbar />}>
                                <DataItemEditForm
                                    onSpecDirty={setIsSpecDirty}
                                    uploader={uploader}
                                />
                            </SimpleForm>
                        </FlatCard>
                    </EditView>
                </>
            </EditBase>
        </Container>
    );
};

const DataItemEditForm = (props: {
    onSpecDirty?: (state: boolean) => void;
    uploader?: UploadController;
}) => {
    const { onSpecDirty, uploader } = props;
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
        const uiSchema = getDataItemSpecUiSchema(kind) as any;
        if (uiSchema && uploader?.path != null) {
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
