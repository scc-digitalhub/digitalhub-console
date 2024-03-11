import {
    Button,
    EditBase,
    EditView,
    LoadingIndicator,
    SaveButton,
    SelectInput,
    SimpleForm,
    TextInput,
    Toolbar,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { JsonSchemaInput } from '@dslab/ra-jsonschema-input';
import { getFunctionUiSpec } from './types';
import { BlankSchema, MetadataSchema } from '../../common/schemas';
import { alphaNumericName } from '../../common/helper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, Container, Stack, Typography } from '@mui/material';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { useState, useEffect } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router';
import { EditPageTitle } from '../../components/PageTitle';
import { FunctionIcon } from './icon';
import { FlatCard } from '../../components/FlatCard';
import { useWatch } from 'react-hook-form';
import deepEqual from 'deep-is';

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

export const FunctionEditToolbar = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(-1);
    };
    return (
        <Toolbar>
            <SaveButton />
            <Button
                color="info"
                label={translate('buttons.cancel')}
                onClick={handleClick}
            >
                <ClearIcon />
            </Button>
            {/* <NewVersionButton /> */}
        </Toolbar>
    );
};

const SpecInput = (props: {
    source: string;
    onDirty?: (state: boolean) => void;
}) => {
    const { source, onDirty } = props;
    const translate = useTranslate();
    const resource = useResourceContext();
    const record = useRecordContext();
    const value = useWatch({ name: source });
    const eq = deepEqual(record[source], value);

    const schemaProvider = useSchemaProvider();
    const [spec, setSpec] = useState<any>();
    const kind = record?.kind || null;

    useEffect(() => {
        if (schemaProvider && record) {
            schemaProvider.get(resource, kind).then(s => setSpec(s));
        }
    }, [record, schemaProvider]);

    useEffect(() => {
        if (onDirty) {
            onDirty(!eq);
        }
    }, [eq]);

    if (!record || !record.kind || !spec) {
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
        <JsonSchemaInput
            source={source}
            schema={spec.schema}
            uiSchema={getFunctionUiSpec(record.kind)}
        />
    );
};

export const FunctionEdit = () => {
    const translate = useTranslate();
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();
    const [schemas, setSchemas] = useState<any[]>();
    const [isSpecDirty, setIsSpecDirty] = useState<boolean>(false);

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

    const onSuccessRedirect = (resource, id, data, state) => {
        console.log(resource, id, data);
        return 'show';
    };

    return (
        <Container maxWidth={false} sx={{ paddingBottom: '8px' }}>
            <EditBase
                redirect={'show'}
                mutationMode="pessimistic"
                mutationOptions={{ meta: { update: !isSpecDirty } }}
            >
                <>
                    <EditPageTitle icon={<FunctionIcon fontSize={'large'} />} />
                    <EditView component={Box}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm
                                toolbar={<FunctionEditToolbar />}
                                validate={validator}
                            >
                                <Typography variant="h6" gutterBottom>
                                    {translate('fields.base')}
                                </Typography>
                                <Stack direction={'row'} spacing={3}>
                                    <TextInput source="name" readOnly />

                                    <SelectInput
                                        source="kind"
                                        choices={kinds}
                                        readOnly
                                    />
                                </Stack>
                                <JsonSchemaInput
                                    source="metadata"
                                    schema={MetadataSchema}
                                />
                                <SpecInput
                                    source="spec"
                                    onDirty={setIsSpecDirty}
                                />
                                {/* <FormDataConsumer<{ kind: string }>>
                                    {({ formData }) => {
                                        console.log('form data', formData);
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
                                </FormDataConsumer> */}
                            </SimpleForm>
                        </FlatCard>
                    </EditView>
                </>
            </EditBase>
        </Container>
    );
};
