import { JsonSchemaInput } from '../../components/JsonSchema';
import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useEffect, useState } from 'react';
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
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { isAlphaNumeric, isValidKind } from '../../common/helper';
import {
    BlankSchema,
} from '../../common/schemas';
import { FlatCard } from '../../components/FlatCard';
import { FormLabel } from '../../components/FormLabel';
import { CreatePageTitle } from '../../components/PageTitle';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { ArtifactIcon } from './icon';
import { getArtifactSpecUiSchema } from './types';
import { MetadataInput } from '../../components/MetadataInput';
import { Uppy, AwsS3 } from 'uppy';
import { DragDrop } from '@uppy/react';

const CreateToolbar = (props: CreateActionsProps) => {
    return (
        <TopToolbar>
            <ListButton />
        </TopToolbar>
    );
};

export const ArtifactCreate = () => {
    const { root } = useRootSelector();
    const translate = useTranslate();
    const schemaProvider = useSchemaProvider();
    const [schemas, setSchemas] = useState<any[]>();
    const kinds = schemas
        ? schemas.map(s => ({
              id: s.kind,
              name: s.kind,
          }))
        : [];
    const transform = data => ({
        ...data,
        project: root || '',
    });

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.list('artifacts').then(res => {
                setSchemas(res || []);
            });
        }
    }, [schemaProvider]);

    const getArtifactSpecSchema = (kind: string | undefined) => {
        if (!kind) {
            return BlankSchema;
        }

        if (schemas) {
            return schemas.find(s => s.id === 'ARTIFACT:' + kind)?.schema;
        }

        return BlankSchema;
    };

    if (!kinds) {
        return <LoadingIndicator />;
    }

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase transform={transform} redirect="list">
                <>
                    <CreatePageTitle
                        icon={<ArtifactIcon fontSize={'large'} />}
                    />

                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm>
                                <FormLabel label="fields.base" />

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
                                                    <FileUploader />
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
                                </FormDataConsumer>
                            </SimpleForm>
                        </FlatCard>
                    </CreateView>
                </>
            </CreateBase>
        </Container>
    );
};

const FileUploader = () => {
    const dataProvider = useDataProvider();
    const resource = useResourceContext();
    const { root } = useRootSelector();
    const [uppy] = useState(() =>
        new Uppy().use(AwsS3, {
            id: 'myAWSPlugin',
            shouldUseMultipart: false,
            getUploadParameters: async (file) => {
                // const response = await fetch('/sign-s3', {
                //     method: 'POST',
                //     headers: {
                //         accept: 'application/json',
                //     },
                //     body: serialize({
                //         filename: file.name,
                //         contentType: file.type,
                //     }),
                //     signal: options.signal,
                // });
                const data = await dataProvider.upload(resource, {
                    id: 'foo',
                    meta: { root },
                });

                const { url, path, expiration } = data;

                return {
                    method: 'PUT',
                    url: url,
                    fields: {},
                };

                // if (!response.ok)
                //     throw new Error('Unsuccessful request', {
                //         cause: response,
                //     });

                // Parse the JSON response.
                // const data = await response.json();

                // Return an object in the correct shape.
                // return {
                //     method: 'PUT',
                //     url: '', //url ricevuto da core
                //     fields: {}, // For presigned PUT uploads, this should be left empty.
                //     // Provide content type header required by S3
                //     // headers: {
                //     //     'Content-Type': file.type,
                //     // },
                // };
            },
        })
    );

    return <DragDrop uppy={uppy} />;
};
