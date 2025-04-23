import { Box, Container } from '@mui/material';
import { useRef, useState } from 'react';
import {
    EditBase,
    EditView,
    SimpleForm,
    useNotify,
    useRedirect,
    useResourceContext,
} from 'react-admin';
import { FlatCard } from '../../components/FlatCard';
import { EditPageTitle } from '../../components/PageTitle';
import { ModelIcon } from './icon';
import { getModelSpecUiSchema } from './types';
import { useUploadController } from '../../controllers/uploadController';
import { randomId } from '../../common/helper';
import { EditToolbar } from '../../components/toolbars/EditToolbar';
import { EditFormContentWithUpload } from '../../components/upload/EditFormContentWithUpload';

export const ModelEdit = () => {
    const resource = useResourceContext();
    const notify = useNotify();
    const redirect = useRedirect();
    const id = useRef(randomId());
    const uploader = useUploadController({
        id: id.current,
    });
    const [isSpecDirty, setIsSpecDirty] = useState<boolean>(false);

    //overwrite onSuccess and use onSettled to handle optimistic rendering
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
                    <EditPageTitle icon={<ModelIcon fontSize={'large'} />} />

                    <EditView component={Box}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm toolbar={<EditToolbar />}>
                                <EditFormContentWithUpload
                                    onSpecDirty={setIsSpecDirty}
                                    uploader={uploader}
                                    getSpecUiSchema={getModelSpecUiSchema}
                                />
                            </SimpleForm>
                        </FlatCard>
                    </EditView>
                </>
            </EditBase>
        </Container>
    );
};
