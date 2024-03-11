import { JsonSchemaInput } from '@dslab/ra-jsonschema-input';
import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container, Stack, Typography } from '@mui/material';
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
    useTranslate
} from 'react-admin';
import { alphaNumericName } from '../../common/helper';
import { BlankSchema, MetadataSchema } from '../../common/schemas';
import { FlatCard } from '../../components/FlatCard';
import { CreatePageTitle } from '../../components/PageTitle';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { DataItemIcon } from './icon';
import { getDataItemUiSpec } from './types';

const CreateToolbar = (props: CreateActionsProps) => {
    return (
        <TopToolbar>
            <ListButton />
        </TopToolbar>
    );
};

const nameValidation = value => {
    if (!alphaNumericName(value)) {
        return 'validation.wrongChar';
    }
    return undefined;
};

const validateName = [required(), nameValidation];

export const DataItemCreate = () => {
    const { root } = useRootSelector();
    const translate = useTranslate();
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();
    const [schemas, setSchemas] = useState<any[]>();

    const transform = data => ({
        ...data,
        project: root || '',
    });

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.list('dataitems').then(res => {
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
    const getDataItemSpec = (kind: string | undefined) => {
        if (!kind) {
            return BlankSchema;
        }

        if (schemas) {
            return schemas.find(s => s.id === 'DATAITEM:' + kind)?.schema;
        }

        return BlankSchema;
    };
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
                                <Typography variant="h6" gutterBottom>
                                    {translate('fields.base')}
                                </Typography>

                                <Stack direction={'row'} spacing={3}>
                                    <TextInput
                                        source="name"
                                        validate={validateName}
                                    />

                                    <SelectInput
                                        source="kind"
                                        choices={kinds}
                                        validate={required()}
                                    />
                                </Stack>

                                <JsonSchemaInput
                                    source="metadata"
                                    schema={MetadataSchema}
                                    label={false}
                                />

                                <FormDataConsumer<{ kind: string }>>
                                    {({ formData }) => {
                                        if (formData.kind)
                                            return (
                                                <JsonSchemaInput
                                                    source="spec"
                                                    schema={getDataItemSpec(
                                                        formData.kind
                                                    )}
                                                    uiSchema={getDataItemUiSpec(
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
