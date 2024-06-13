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
import { useSchemaProvider } from '../../provider/schemaProvider';
import { ArtifactIcon } from './icon';
import { getArtifactSpecUiSchema } from './types';
import { useGetSchemas } from '../../controllers/schemaController';

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
    const { data: metaSchema, isLoading, error } = useGetSchemas('metadata');
    const metadataKinds = metaSchema
        ? metaSchema.map(s => ({
              id: s.kind,
              name: s.kind,
              schema: s.schema,
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
                                {metadataKinds &&
                                    metadataKinds.map(r => {
                                        return (
                                            <JsonSchemaInput
                                                key={r.id}
                                                source="metadata"
                                                schema={r.schema}
                                                uiSchema={
                                                    MetadataCreateUiSchema
                                                }
                                            />
                                        );
                                    })}

                                <FormDataConsumer<{ kind: string }>>
                                    {({ formData }) => {
                                        if (formData.kind)
                                            return (
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
