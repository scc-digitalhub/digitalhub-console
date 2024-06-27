import { JsonSchemaInput } from '../../components/JsonSchema';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, Card, CardContent, Container, Stack } from '@mui/material';
import deepEqual from 'deep-is';
import { useEffect, useRef, useState } from 'react';
import {
    Button,
    EditBase,
    EditView,
    SaveButton,
    SelectInput,
    SimpleForm,
    TextInput,
    Toolbar,
    useInput,
    useNotify,
    useRecordContext,
    useRedirect,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { FlatCard } from '../../components/FlatCard';
import { FormLabel } from '../../components/FormLabel';
import { EditPageTitle } from '../../components/PageTitle';
import { Spinner } from '../../components/Spinner';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { DataItemIcon } from './icon';
import { getDataItemSpecUiSchema } from './types';
import { MetadataInput } from '../../components/MetadataInput';
import { FileInput } from '../../components/FileInput';
import { useUploadController } from '../../controllers/uploadController';

export const DataItemEditToolbar = () => {
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

const SpecInput = (props: {
    source: string;
    onDirty?: (state: boolean) => void;
}) => {
    const { source, onDirty } = props;
    const translate = useTranslate();
    const resource = useResourceContext();
    const record = useRecordContext();
    const value = useWatch({ name: source });
    const eq = deepEqual(record[source], value);

    const schemaProvider = useSchemaProvider();
    const [spec, setSpec] = useState<any>();
    const kind = record?.kind || null;

    useEffect(() => {
        if (schemaProvider && record) {
            schemaProvider.get(resource, kind).then(s => setSpec(s));
        }
    }, [record, schemaProvider]);

    useEffect(() => {
        if (onDirty) {
            onDirty(!eq);
        }
    }, [eq]);

    if (!record || !record.kind || !spec) {
        return (
            <Card
                sx={{
                    width: 1,
                    textAlign: 'center',
                }}
            >
                <CardContent>
                    {translate('resources.common.emptySpec')}{' '}
                </CardContent>
            </Card>
        );
    }

    return (
        <JsonSchemaInput
            source={source}
            schema={{ ...spec.schema, title: 'Spec' }}
            uiSchema={getDataItemSpecUiSchema(record.kind)}
        />
    );
};

export const DataItemEdit = () => {
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();
    const [isSpecDirty, setIsSpecDirty] = useState<boolean>(false);
    const resource = useResourceContext();
    const notify = useNotify();
    const redirect = useRedirect();
    const id = useRef(crypto.randomUUID());
    const { uppy, path } = useUploadController({ id: id.current });

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.list('dataitems').then(res => {
                if (res) {
                    const values = res.map(s => ({
                        id: s.kind,
                        name: s.kind,
                    }));

                    setKinds(values);
                }
            });
        }
    }, [schemaProvider]);

    const onSuccess = (data, variables, context) => {};

    const onSettled = (data, variables, context) => {
        notify('ra.notification.updated', {
            type: 'info',
            messageArgs: { smart_count: 1 },
        });
        redirect('show', resource, data.id, data);
    };
    const transform = async data => {
        await uppy.upload();
        return {
            ...data,
        };
    };
    if (!kinds) {
        return <Spinner />;
    }

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
                            <SimpleForm toolbar={<DataItemEditToolbar />}>
                                <FormContent
                                    kinds={kinds}
                                    uppy={uppy}
                                    setIsSpecDirty={setIsSpecDirty}
                                    path={path}
                                />
                            </SimpleForm>
                        </FlatCard>
                    </EditView>
                </>
            </EditBase>
        </Container>
    );
};
const FormContent = (props: any) => {
    const { uppy, kinds, setIsSpecDirty, path } = props;
    const translate = useTranslate();
    const resource = useResourceContext();
    const { field } = useInput({ resource, source: 'spec' });
    const updateForm = path => {
        if (field) {
            field.onChange({ ...field.value, path: path });
        }
    };
    useEffect(() => {
        updateForm(path);
    }, [path]);
    return (
        <>
            <FormLabel label="fields.base" />

            <Stack direction={'row'} spacing={3} pt={4}>
                <TextInput source="name" readOnly />

                <SelectInput source="kind" choices={kinds} readOnly />
            </Stack>

            <MetadataInput />

            <SpecInput source="spec" onDirty={setIsSpecDirty} />
            {uppy && <FileInput uppy={uppy} />}
        </>
    );
};
