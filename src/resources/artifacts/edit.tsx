import { Box, Container } from '@mui/material';
import { useRef, useState } from 'react';
import {
    EditBase,
    EditView,
    SimpleForm,
    useDataProvider,
    useNotify,
    useRedirect,
    useResourceContext,
} from 'react-admin';
import { FlatCard } from '../../components/FlatCard';
import { EditPageTitle } from '../../components/PageTitle';
import { ArtifactIcon } from './icon';
import { getArtifactSpecUiSchema } from './types';
import { useUploadController } from '../../controllers/uploadController';
import { randomId } from '../../common/helper';
import { EditToolbar } from '../../components/toolbars/EditToolbar';
import { EditFormContentWithUpload } from '../../components/upload/EditFormContentWithUpload';

export const ArtifactEdit = () => {
    const resource = useResourceContext();
    const notify = useNotify();
    const redirect = useRedirect();
    const id = useRef(randomId());
    const uploader = useUploadController({
        id: id.current,
    });
    const dataProvider = useDataProvider();
    const [isSpecDirty, setIsSpecDirty] = useState<boolean>(false);

    //overwrite onSuccess and use onSettled to handle optimistic rendering
    const onSuccess = () => {};
    const onSettled = (data, error) => {
        if (error) {
            //onError already handles notify
            return;
        }

        //post save we start uploading:
        //if spec is not dirty, skip (same version, same state)
        //if spec is dirty but there is nothing to upload, skip (new version, CREATED state)
        //if there is something to upload, change states for new version
        if (isSpecDirty && uploader.files.length > 0) {
            data.status.state = 'UPLOADING';

            dataProvider
                .update(resource, {
                    id: data.id,
                    data: data,
                    previousData: null,
                })
                .then(() => {
                    uploader.upload().then(
                        result => {
                            //if the upload was successful, we update the resource
                            const status =
                                result?.successful &&
                                result.successful?.length > 0 &&
                                result.failed?.length === 0
                                    ? 'READY'
                                    : 'ERROR';

                            data.status.state = status;

                            dataProvider.update(resource, {
                                id: data.id,
                                data: data,
                                previousData: null,
                            });

                            if (status === 'ERROR') {
                                notify('ra.notification.error');
                            }
                        },
                        error => {
                            console.log('upload error', error);
                            data.status.state = 'ERROR';
                            //TODO: extract or syntesize the error message
                            data.status.message = 'Upload failed';

                            dataProvider.update(resource, {
                                id: data.id,
                                data: data,
                                previousData: null,
                            });
                        }
                    );
                });
        }

        notify('ra.notification.updated', {
            type: 'info',
            messageArgs: { smart_count: 1 },
        });
        redirect('show', resource, data.id, data);
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
                    onSuccess,
                    onSettled,
                }}
            >
                <>
                    <EditPageTitle icon={<ArtifactIcon fontSize={'large'} />} />

                    <EditView component={Box}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm toolbar={<EditToolbar />}>
                                <EditFormContentWithUpload
                                    onSpecDirty={setIsSpecDirty}
                                    uploader={uploader}
                                    getSpecUiSchema={getArtifactSpecUiSchema}
                                />
                            </SimpleForm>
                        </FlatCard>
                    </EditView>
                </>
            </EditBase>
        </Container>
    );
};
