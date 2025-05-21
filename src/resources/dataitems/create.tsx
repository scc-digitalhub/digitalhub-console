import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
import {
    CreateBase,
    CreateView,
    TextInput,
    required,
    useNotify,
    useRedirect,
    useResourceContext,
} from 'react-admin';
import { isAlphaNumeric, randomId } from '../../common/helper';
import { FlatCard } from '../../components/FlatCard';
import { CreatePageTitle } from '../../components/PageTitle';
import { DataItemIcon } from './icon';
import { getDataItemSpecUiSchema } from './types';
import { MetadataInput } from '../../components/MetadataInput';
import { useRef } from 'react';
import {
    UploadController,
    useUploadController,
} from '../../controllers/uploadController';
import { StepperForm } from '@dslab/ra-stepper';
import { StepperToolbar } from '../../components/toolbars/StepperToolbar';
import { CreateToolbar } from '../../components/toolbars/CreateToolbar';
import { CreateSpecWithUpload } from '../../components/upload/CreateSpecWithUpload';

export const DataItemCreate = () => {
    const { root } = useRootSelector();
    const id = useRef(randomId());
    const notify = useNotify();
    const redirect = useRedirect();
    const resource = useResourceContext();
    const uploader = useUploadController({
        id: id.current,
    });

    const transform = data => {
        //strip path tl which is a transient field
        const { path, ...rest } = data;

        return {
            ...rest,
            project: root,
            status: {
                files: uploader.files.map(f => f.info),
            },
        };
    };

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

        notify('ra.notification.created', { messageArgs: { smart_count: 1 } });
        redirect('list', resource);
    };

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase
                transform={transform}
                mutationOptions={{ onSuccess, onSettled }}
                record={{ id: id.current, spec: { path: null } }}
            >
                <>
                    <CreatePageTitle
                        icon={<DataItemIcon fontSize={'large'} />}
                    />

                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <DataItemForm uploader={uploader} />
                        </FlatCard>
                    </CreateView>
                </>
            </CreateBase>
        </Container>
    );
};

export const DataItemForm = (props: { uploader?: UploadController }) => {
    const { uploader } = props;

    return (
        <StepperForm toolbar={<StepperToolbar />}>
            <StepperForm.Step label={'fields.base'}>
                <TextInput
                    source="name"
                    validate={[required(), isAlphaNumeric()]}
                />
                <MetadataInput />
            </StepperForm.Step>
            <StepperForm.Step label={'fields.spec.title'}>
                <CreateSpecWithUpload
                    uploader={uploader}
                    getSpecUiSchema={getDataItemSpecUiSchema}
                />
            </StepperForm.Step>
        </StepperForm>
    );
};
