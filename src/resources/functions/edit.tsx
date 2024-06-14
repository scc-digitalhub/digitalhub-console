import { Box, Container, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import deepEqual from 'deep-is';
import { Fragment, useEffect, useState } from 'react';
import {
    Button,
    EditBase,
    EditView,
    InputHelperText,
    InputProps,
    Labeled,
    LoadingIndicator,
    RecordContextProvider,
    SaveButton,
    SelectInput,
    SimpleForm,
    TextInput,
    Toolbar,
    useInput,
    useNotify,
    useRecordContext,
    useRedirect,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { MetadataCreateUiSchema, MetadataEditUiSchema, MetadataSchema } from '../../common/schemas';
import { FlatCard } from '../../components/FlatCard';
import { FormLabel } from '../../components/FormLabel';
import { EditPageTitle } from '../../components/PageTitle';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { FunctionIcon } from './icon';
import { getFunctionUiSpec } from './types';
import { alphaNumericName } from '../../common/helper';
import { JsonSchemaInput } from '../../components/JsonSchema';
import { Editor } from '../../components/AceEditorInput';
import ClearIcon from '@mui/icons-material/Clear';
import { useGetSchemas } from '../../controllers/schemaController';
import { MetadataInput } from '../../components/MetadataInput';

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
        <>
            <JsonSchemaInput
                source={source}
                schema={{ ...spec.schema, title: 'Spec' }}
                uiSchema={getFunctionUiSpec(record.kind)}
            />
        </>
    );
};
export const FunctionEditToolbar = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(-1);
    };
    return (
        <Toolbar sx={{ justifyContent: 'space-between' }}>
            <SaveButton />
            <Button
                color="info"
                label={translate('buttons.cancel')}
                onClick={handleClick}
            >
                <ClearIcon />
            </Button>
        </Toolbar>
    );
};
export const FunctionEdit = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const resource = useResourceContext();
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

    const validator = data => {
        const errors: any = {};
        console.log(data);
        console.log(kinds);
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

    const onSuccess = (data, variables, context) => {
        console.log('success', data, variables);
    };
    const onSettled = (data, variables, context) => {
        console.log('settled', data, variables);

        notify('ra.notification.updated', {
            type: 'info',
            messageArgs: { smart_count: 1 },
        });
        redirect('show', resource, data.id, data);
    };
    const onChange = (e: any, id?: string) => {
        console.log('called', e);
        console.log('id', id);
    };
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <EditBase
                redirect={'show'}
                mutationMode="optimistic"
                mutationOptions={{
                    meta: { update: !isSpecDirty },
                    onSuccess: onSuccess,
                    onSettled: onSettled,
                }}
            >
                <>
                    <EditPageTitle icon={<FunctionIcon fontSize={'large'} />} />

                    <EditView component={Box}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm toolbar={<FunctionEditToolbar />}>
                                <FormLabel label="fields.base" />

                                <Stack direction={'row'} spacing={3} pt={4}>
                                    <TextInput source="name" readOnly />

                                    <SelectInput
                                        source="kind"
                                        choices={kinds}
                                        readOnly
                                    />
                                </Stack>


                                <MetadataInput />


                                <SpecInput
                                    source="spec"
                                    onDirty={setIsSpecDirty}
                                />
                            </SimpleForm>
                        </FlatCard>
                    </EditView>
                </>
            </EditBase>
        </Container>
    );
};
