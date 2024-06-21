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
import { Dashboard } from '@uppy/react';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

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
    const dataProvider = useDataProvider();
    const resource = useResourceContext();
    const id = useRef('');
    const resourcePath = useRef('');

    const [uppy] = useState(() =>
        new Uppy({ debug: true, restrictions: { maxNumberOfFiles: 1 } }).use(
            AwsS3,
            {
                id: 'myAWSPlugin',
                shouldUseMultipart: false,
                allowedMetaFields: ['name'],
                getUploadParameters: async file => {
                    const randomId = crypto.randomUUID();
                    const data = await dataProvider.upload(resource, {
                        id: randomId,
                        meta: { root },
                        filename: file.name,
                    });

                    const { url, path, expiration } = data;

                    id.current = randomId;
                    resourcePath.current = path;

                    return {
                        method: 'PUT',
                        url: url,
                        fields: {},
                        headers: file.type
                            ? { 'Content-Type': file.type }
                            : undefined,
                    };
                },
            }
        )
    );

    const kinds = schemas
        ? schemas.map(s => ({
              id: s.kind,
              name: s.kind,
          }))
        : [];


    const transform = async data => {
        //TODO gestire fallimento upload
        const uploaded = await uppy.upload();

        if (
            uploaded.failed.length === 0 &&
            resourcePath.current !== '' &&
            id.current !== ''
        ) {
            data.spec.path = resourcePath.current;
            data.id = id.current;
        }

        return {
            ...data,
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
                                </FormDataConsumer>
                            </SimpleForm>
                        </FlatCard>
                    </CreateView>
                </>
            </CreateBase>
        </Container>
    );
};

// const FileUploader = () => {
//     return <Dashboard uppy={uppy} hideUploadButton />;
// };
