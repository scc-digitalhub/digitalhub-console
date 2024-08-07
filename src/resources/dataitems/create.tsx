import { JsonSchemaInput } from '../../components/JsonSchema';
import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {
    Confirm,
    CreateActionsProps,
    CreateBase,
    CreateView,
    FormDataConsumer,
    ListButton,
    LoadingIndicator,
    SelectInput,
    SimpleForm,
    TextInput,
    TopToolbar,
    required,
    useInput,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { isAlphaNumeric, isValidKind } from '../../common/helper';
import { BlankSchema } from '../../common/schemas';
import { FlatCard } from '../../components/FlatCard';
import { FormLabel } from '../../components/FormLabel';
import { CreatePageTitle } from '../../components/PageTitle';
import { DataItemIcon } from './icon';
import { getDataItemSpecUiSchema } from './types';
import { useGetSchemas } from '../../controllers/schemaController';
import { MetadataInput } from '../../components/MetadataInput';
import { useEffect, useRef, useState } from 'react';
import { useUploadController } from '../../controllers/uploadController';
import { FileInput } from '../../components/FileInput';
import { useForm, useFormState } from 'react-hook-form';
import { trace } from 'console';
import { transcode } from 'buffer';
import { KindSelector } from '../../components/KindSelector';

const CreateToolbar = () => {
    return (
        <TopToolbar>
            <ListButton />
        </TopToolbar>
    );
};

export const DataItemCreate = () => {
    const { root } = useRootSelector();
    const { data: schemas } = useGetSchemas('dataitems');
    const id = useRef(crypto.randomUUID());

    const { uppy, files, upload } = useUploadController({ id: id.current });

    const kinds = schemas
        ? schemas.map(s => ({
              id: s.kind,
              name: s.kind,
          }))
        : [];

    const transform = async data => {
        await upload();
        return {
            ...data,
            id: id.current,
            status: {
                files: files.map(f => f.info),
            },
            project: root || '',
        };
    };

    if (!kinds) {
        return <LoadingIndicator />;
    }

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase transform={transform} redirect="list">
                <>
                    <CreatePageTitle
                        icon={<DataItemIcon fontSize={'large'} />}
                    />

                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm
                                defaultValues={{
                                    metadata: {},
                                    status: {},
                                    spec: {},
                                }}
                            >
                                <FormContent
                                    schemas={schemas}
                                    kinds={kinds}
                                    uppy={uppy}
                                    files={files}
                                />
                            </SimpleForm>
                        </FlatCard>
                    </CreateView>
                </>
            </CreateBase>
        </Container>
    );
};

const FormContent = (props: any) => {
    const { schemas, uppy, kinds, files } = props;
    const translate = useTranslate();
    const resource = useResourceContext();
    const { field } = useInput({ resource, source: 'spec' });
    const updateForm = path => {
        if (field) {
            field.onChange({ ...field.value, path: path });
        }
    };
    const path = files.length > 0 ? files[0].path : null;
    useEffect(() => {
        updateForm(path);
    }, [path]);

    const getDataItemSpecSchema = (kind: string | undefined) => {
        if (!kind) {
            return BlankSchema;
        }

        if (schemas) {
            return schemas.find(s => s.id === 'DATAITEM:' + kind)?.schema;
        }

        return BlankSchema;
    };

    const getDataItemUiSchema = (kind: string | undefined) => {
        if (!kind) {
            return undefined;
        }

        if (uppy.getFiles().length > 0) {
            return { path: { 'ui:readonly': true } };
        } else {
            return getDataItemSpecUiSchema(kind);
        }
    };

    if (!kinds) {
        return <LoadingIndicator />;
    }

    return (
        <>
            <FormLabel label="fields.base" />

            <Stack direction={'row'} spacing={3} pt={4}>
                <TextInput
                    source="name"
                    validate={[required(), isAlphaNumeric()]}
                />
                <KindSelector kinds={kinds} />
            </Stack>

            <MetadataInput />

            <FormDataConsumer<{ kind: string }>>
                {({ formData }) => {
                    if (formData.kind)
                        return (
                            <>
                                <JsonSchemaInput
                                    source="spec"
                                    schema={{
                                        ...getDataItemSpecSchema(formData.kind),
                                        title: 'Spec',
                                    }}
                                    uiSchema={getDataItemUiSchema(
                                        formData.kind
                                    )}
                                />
                                {uppy && <FileInput uppy={uppy} />}
                            </>
                        );
                    else
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
                }}
            </FormDataConsumer>
        </>
    );
};
