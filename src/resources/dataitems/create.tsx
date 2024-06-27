import { JsonSchemaInput } from '../../components/JsonSchema';
import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {
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
import {
    BlankSchema,
    MetadataCreateUiSchema,
    MetadataSchema,
} from '../../common/schemas';
import { FlatCard } from '../../components/FlatCard';
import { FormLabel } from '../../components/FormLabel';
import { CreatePageTitle } from '../../components/PageTitle';
import { DataItemIcon } from './icon';
import { getDataItemSpecUiSchema } from './types';
import { useGetSchemas } from '../../controllers/schemaController';
import { MetadataInput } from '../../components/MetadataInput';
import { useEffect, useRef } from 'react';
import { useUploadController } from '../../controllers/uploadController';
import { FileInput } from '../../components/FileInput';

const CreateToolbar = (props: CreateActionsProps) => {
    return (
        <TopToolbar>
            <ListButton />
        </TopToolbar>
    );
};

export const DataItemCreate = () => {
    const { root } = useRootSelector();
    const translate = useTranslate();
    const { data: schemas, isLoading, error } = useGetSchemas('dataitems');
    const id = useRef(crypto.randomUUID());

    const { uppy, path } = useUploadController({ id: id.current });

    const kinds = schemas
        ? schemas.map(s => ({
              id: s.kind,
              name: s.kind,
          }))
        : [];

    const transform = async data => {
        await uppy.upload();
        return {
            ...data,
            id: id.current,
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
                            <SimpleForm>
                                <FormContent
                                    schemas={schemas}
                                    kinds={kinds}
                                    uppy={uppy}
                                    path={path}
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
    const { schemas, uppy, kinds, path } = props;
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

                <SelectInput
                    source="kind"
                    choices={kinds}
                    validate={[required(), isValidKind(kinds)]}
                />
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
                            {uppy && (
                                <FileInput
                                    uppy={uppy}
                                />
                            )}
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
