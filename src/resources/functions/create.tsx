import { useRootSelector } from '@dslab/ra-root-selector';
import {
    Create,
    CreateActionsProps,
    CreateBase,
    CreateView,
    FormDataConsumer,
    Labeled,
    ListButton,
    LoadingIndicator,
    SelectInput,
    SimpleForm,
    TextInput,
    TopToolbar,
    useDataProvider,
    useTranslate,
} from 'react-admin';
import { getFunctionUiSpec } from './types';
import { BlankSchema, MetadataEditUiSchema, MetadataSchema } from '../../common/schemas';
import { alphaNumericName } from '../../common/helper';
import { JsonSchemaInput } from '@dslab/ra-jsonschema-input';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { FlatCard } from '../../components/FlatCard';
import { CreatePageTitle } from '../../components/PageTitle';
import { FunctionIcon } from './icon';

const CreateToolbar = (props: CreateActionsProps) => {
    return (
        <TopToolbar>
            <ListButton />
        </TopToolbar>
    );
};

export const FunctionCreate = () => {
    const { root } = useRootSelector();
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();
    const [schemas, setSchemas] = useState<any[]>();

    const transform = data => ({
        ...data,
        project: root || '',
    });

    const validator = data => {
        const errors: any = {};

        if (!('kind' in data)) {
            errors.kind = 'messages.validation.required';
        }
        if (!alphaNumericName(data.name)) {
            errors.name = 'validation.wrongChar';
        }
        return errors;
    };

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

    const getFunctionSpec = (kind: string | undefined) => {
        if (!kind) {
            return BlankSchema;
        }

        if (schemas) {
            return schemas.find(s => s.id === 'FUNCTION:' + kind)?.schema;
        }

        return BlankSchema;
    };

    return (
        <Container maxWidth={false} sx={{ paddingBottom: '8px' }}>
            <CreateBase transform={transform} redirect="list">
                <>
                    <CreatePageTitle
                        icon={<FunctionIcon fontSize={'large'} />}
                    />

                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm validate={validator}>
                                <Typography variant="h6" gutterBottom>
                                    {translate('fields.base')}
                                </Typography>
                                <Stack direction={'row'} spacing={3}>
                                    <TextInput source="name" required />
                                    <SelectInput
                                        source="kind"
                                        choices={kinds}
                                        required
                                    />
                                </Stack>

                                <JsonSchemaInput
                                    source="metadata"
                                    schema={MetadataSchema}
                                    uiSchema={MetadataEditUiSchema}
                                    label={false}
                                />
                                <FormDataConsumer<{ kind: string }>>
                                    {({ formData }) => {
                                        if (formData.kind)
                                            return (
                                                <JsonSchemaInput
                                                    source="spec"
                                                    schema={getFunctionSpec(
                                                        formData.kind
                                                    )}
                                                    uiSchema={getFunctionUiSpec(
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
