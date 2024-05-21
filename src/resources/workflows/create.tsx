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
import { WorkflowIcon } from './icon';
import { getWorkflowUiSpec } from './types';
import { FormLabel } from '../../components/FormLabel';

const CreateToolbar = (props: CreateActionsProps) => {
    return (
        <TopToolbar>
            <ListButton />
        </TopToolbar>
    );
};

export const WorkflowCreate = () => {
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
            schemaProvider.list('workflows').then(res => {
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

    const getWorkflowSpec = (kind: string | undefined) => {
        if (!kind) {
            return BlankSchema;
        }

        if (schemas) {
            return schemas.find(s => s.id === 'WORKFLOW:' + kind)?.schema;
        }

        return BlankSchema;
    };

    const validator = data => {
        const errors: any = {};

        if (!('kind' in data)) {
            errors.kind = 'messages.validation.required';
        }

        if (!kinds.find(k => k.id === data.kind)) {
            errors.kind = 'messages.validation.invalid';
        }

        if (!alphaNumericName(data.name)) {
            errors.name = 'validation.wrongChar';
        }

        return errors;
    };

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase transform={transform} redirect="list">
                <>
                    <CreatePageTitle
                        icon={<WorkflowIcon fontSize={'large'} />}
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

                                <JsonSchemaInput
                                    source="metadata"
                                    schema={MetadataSchema}
                                    uiSchema={MetadataCreateUiSchema}
                                    label={false}
                                />

                                <FormDataConsumer<{ kind: string }>>
                                    {({ formData }) => {
                                        if (formData.kind)
                                            return (
                                                <JsonSchemaInput
                                                    source="spec"
                                                    schema={{...getWorkflowSpec(
                                                        formData.kind
                                                    ),title:'Spec'}}
                                                    uiSchema={getWorkflowUiSpec(
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
