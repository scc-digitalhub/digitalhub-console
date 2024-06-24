import { JsonSchemaInput } from '../../components/JsonSchema';
import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useEffect, useRef, useState } from 'react';
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
    useDataProvider,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { isAlphaNumeric, isValidKind } from '../../common/helper';
import {
    BlankSchema, MetadataCreateUiSchema, MetadataSchema,
} from '../../common/schemas';
import { FlatCard } from '../../components/FlatCard';
import { FormLabel } from '../../components/FormLabel';
import { CreatePageTitle } from '../../components/PageTitle';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { ArtifactIcon } from './icon';
import { getArtifactSpecUiSchema } from './types';
import { MetadataInput } from '../../components/MetadataInput';
import { Uppy, AwsS3 } from 'uppy';
import { Dashboard } from '@uppy/react';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import { useFormContext,useForm } from 'react-hook-form';

const CreateToolbar = (props: CreateActionsProps) => {
    return (
        <TopToolbar>
            <ListButton />
        </TopToolbar>
    );
};

export const ArtifactCreate = () => {
    const { root } = useRootSelector();
    const schemaProvider = useSchemaProvider();
    const [schemas, setSchemas] = useState<any[]>();
    const id = useRef(crypto.randomUUID());

    const uploadUrl = useRef('');

    const [uppy] = useState(() =>
        new Uppy({ restrictions: { maxNumberOfFiles: 1 } }).use(AwsS3, {
            id: 'myAWSPlugin',
            shouldUseMultipart: false,
            getUploadParameters: async file => {
                return {
                    method: 'PUT',
                    url: uploadUrl.current,
                    fields: {},
                    headers: file.type
                        ? { 'Content-Type': file.type }
                        : undefined,
                };
            },
        })
    );

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

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.list('artifacts').then(res => {
                setSchemas(res || []);
            });
        }
    }, [schemaProvider]);

    if (!kinds) {
        return <LoadingIndicator />;
    }

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase
                transform={transform}
                redirect="list"
                record={{ id: id.current }}
            >
                <>
                    <CreatePageTitle
                        icon={<ArtifactIcon fontSize={'large'} />}
                    />

                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm>
                                {/* <FormLabel label="fields.base" />

                                <Stack direction={'row'} spacing={3} pt={4}>
                                    <TextInput
                                        source="name"
                                        validate={[
                                            required(),
                                            isAlphaNumeric(),
                                        ]}
                                    />

                                    <SelectInput
                                        source="kind"
                                        choices={kinds}
                                        validate={[
                                            required(),
                                            isValidKind(kinds),
                                        ]}
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
                                                            ...getArtifactSpecSchema(
                                                                formData.kind
                                                            ),
                                                            title: 'Spec',
                                                        }}
                                                        uiSchema={getArtifactSpecUiSchema(
                                                            formData.kind
                                                        )}
                                                    />
                                                    <Dashboard
                                                        uppy={uppy}
                                                        hideUploadButton
                                                        proudlyDisplayPoweredByUppy={
                                                            false
                                                        }
                                                        metaFields={[{ id: 'name', name: 'Name', placeholder: 'file name' }]}
                                                    />
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
                                                        {translate(
                                                            'resources.common.emptySpec'
                                                        )}{' '}
                                                    </CardContent>
                                                </Card>
                                            );
                                    }}
                                </FormDataConsumer> */}
                                <ArtifactForm
                                    schemas={schemas}
                                    uppy={uppy}
                                    kinds={kinds}
                                    id={id.current}
                                    uploadUrl={uploadUrl}
                                />
                            </SimpleForm>
                        </FlatCard>
                    </CreateView>
                </>
            </CreateBase>
        </Container>
    );
};

const ArtifactForm = (props: any) => {
    const { schemas, uppy, kinds, uploadUrl } = props;
    const { root } = useRootSelector();
    const record = useRecordContext();
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const resource = useResourceContext();
    const formContext = useFormContext();
    const {setValue} = useForm();
    if (uppy) {
        uppy.on('file-added', async file => {
            if (formContext && dataProvider) {
                const data = await dataProvider.upload(resource, {
                    xid: record.id,
                    meta: { root },
                    filename: file.name,
                });

                const { url, path } = data;
                setValue('spec.path', path);
                uploadUrl.current = url;
            }
        });

        uppy.on('file-removed', (file, reason) => {
            if (formContext) {
                setValue('spec.path', null);
                uploadUrl.current = '';
            }
        });
    }
    const getArtifactSpecSchema = (kind: string | undefined) => {
        if (!kind) {
            return BlankSchema;
        }

        if (schemas) {
            return schemas.find(s => s.id === 'ARTIFACT:' + kind)?.schema;
        }

        return BlankSchema;
    };

    const getArtifactUiSchema = (kind: string | undefined) => {
        if (!kind) {
            return undefined;
        }

        if (uploadUrl.current !== '') {
            return { path: { 'ui:readonly': true } };
        } else {
            return getArtifactSpecUiSchema(kind);
        }
    };

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

            {/* <JsonSchemaInput
                source="metadata"
                schema={MetadataSchema}
                uiSchema={MetadataCreateUiSchema}
            /> */}
            <MetadataInput />
            <FormDataConsumer<{ kind: string }>>
                {({ formData }) => {
                    if (formData.kind)
                        return (
                            <>
                                <JsonSchemaInput
                                    source="spec"
                                    schema={{
                                        ...getArtifactSpecSchema(formData.kind),
                                        title: 'Spec',
                                    }}
                                    uiSchema={getArtifactUiSchema(
                                        formData.kind
                                    )}
                                />
                                {uppy &&
                                <Dashboard
                                    uppy={uppy}
                                    hideUploadButton
                                    proudlyDisplayPoweredByUppy={false}
                                />
                                }
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
