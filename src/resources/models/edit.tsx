import ClearIcon from '@mui/icons-material/Clear';
import { Box, Container, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import {
    Button,
    EditBase,
    EditView,
    SaveButton,
    SimpleForm,
    TextInput,
    Toolbar,
    useInput,
    useNotify,
    useRedirect,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { useNavigate } from 'react-router';
import { FlatCard } from '../../components/FlatCard';
import { FormLabel } from '../../components/FormLabel';
import { EditPageTitle } from '../../components/PageTitle';
import { ModelIcon } from './icon';
import { getModelSpecUiSchema } from './types';
import { MetadataInput } from '../../components/MetadataInput';
import {
    UploadController,
    useUploadController,
} from '../../controllers/uploadController';
import { FileInput } from '../../components/FileInput';
import { SpecInput } from '../../components/SpecInput';

const ModelEditToolbar = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(-1);
    };
    return (
        <Toolbar sx={{ justifyContent: 'space-between' }}>
            <SaveButton />
            <Button
                color="info"
                label={translate('buttons.cancel')}
                onClick={handleClick}
            >
                <ClearIcon />
            </Button>
        </Toolbar>
    );
};

export const ModelEdit = () => {
    const resource = useResourceContext();
    const notify = useNotify();
    const redirect = useRedirect();
    const id = useRef(crypto.randomUUID());
    const uploader = useUploadController({
        id: id.current,
    });
    const [isSpecDirty, setIsSpecDirty] = useState<boolean>(false);

    const onSuccess = (data, variables, context) => {};
    const onSettled = (data, variables, context) => {
        notify('ra.notification.updated', {
            type: 'info',
            messageArgs: { smart_count: 1 },
        });
        redirect('show', resource, data.id, data);
    };

    const transform = async data => {
        await uploader.upload();

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
                            <SimpleForm toolbar={<ModelEditToolbar />}>
                                <ModelEditForm
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

const ModelEditForm = (props: {
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
        const uiSchema = getModelSpecUiSchema(kind) as any;
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
