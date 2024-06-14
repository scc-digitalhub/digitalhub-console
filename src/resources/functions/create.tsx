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
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import {
    alphaNumericName,
    isAlphaNumeric,
    isValidKind,
} from '../../common/helper';
import {
    BlankSchema,
    MetadataCreateUiSchema,
    MetadataSchema,
} from '../../common/schemas';
import { FlatCard } from '../../components/FlatCard';
import { CreatePageTitle } from '../../components/PageTitle';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { FunctionIcon } from './icon';
import { getFunctionUiSpec } from './types';
import { FormLabel } from '../../components/FormLabel';
import deepEqual from 'deep-is';
import { Editor } from '../../components/AceEditorInput';
import { useWatch } from 'react-hook-form';
import { useGetSchemas } from '../../controllers/schemaController';

const CreateToolbar = (props: CreateActionsProps) => {
    return (
        <TopToolbar>
            <ListButton />
        </TopToolbar>
    );
};
const SpecInput = (props: {
    source: string;
    onDirty?: (state: boolean) => void;
}) => {
    const { source, onDirty } = props;
    const translate = useTranslate();
    const resource = useResourceContext();
    const value = useWatch({ name: source });
    const kind = useWatch({ name: 'kind' });
    const schemaProvider = useSchemaProvider();
    const [spec, setSpec] = useState<any>();

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.get(resource, kind).then(s => setSpec(s));
        }
    }, [schemaProvider, kind]);

    if (!spec) {
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
        <>
            <JsonSchemaInput
                source={source}
                schema={{ ...spec.schema, title: 'Spec' }}
                uiSchema={getFunctionUiSpec(kind)}
            />
        </>
    );
};
export const FunctionCreate = () => {
    const { root } = useRootSelector();
    const translate = useTranslate();
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();
    const [schemas, setSchemas] = useState<any[]>();
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
            schemaProvider.list('functions').then(res => {
                if (res) {
                    setSchemas(res);

                    const values = res.map(s => ({
                        id: s.kind,
                        name: s.kind,
                    }));

                    setKinds(values);
                }
            });
        }
    }, [schemaProvider, setKinds]);

    if (!kinds) {
        return <LoadingIndicator />;
    }

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase transform={transform} redirect="list">
                <>
                    <CreatePageTitle
                        icon={<FunctionIcon fontSize={'large'} />}
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
                                            return <SpecInput source="spec" />;
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
