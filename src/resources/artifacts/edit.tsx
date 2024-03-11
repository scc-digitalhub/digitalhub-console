import { Box, Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material';
import {
    Button,
    Edit,
    EditBase,
    EditView,
    FormDataConsumer,
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
import { MetadataSchema } from '../../common/types';
import { BlankSchema, getArtifactUiSpec } from './types';
import { alphaNumericName } from '../../common/helper';
import { useState, useEffect } from 'react';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { useNavigate } from 'react-router';
import ClearIcon from '@mui/icons-material/Clear';
import { RecordTitle } from '../../components/RecordTitle';
import { NewVersionButton } from '../../components/NewVersionButton';
import { deepEqual } from 'deep-is';
import { useWatch } from 'react-hook-form';
import { ArtifactIcon } from './icon';
import { EditPageTitle } from '../../components/PageTitle';
import { FlatCard } from '../../components/FlatCard';
import { FunctionEditToolbar } from '../functions';

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
export const ArtifactEditToolbar = () => {
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
            uiSchema={getArtifactUiSpec(record.kind)}
        />
    );
};
export const ArtifactEdit = () => {
    const translate = useTranslate();
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();
    const [schemas, setSchemas] = useState<any[]>();
    const [isSpecDirty, setIsSpecDirty] = useState<boolean>(false);

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.list('artifacts').then(res => {
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

    const getArtifactSpec = (kind: string | undefined) => {
        if (!kind) {
            return BlankSchema;
        }

        if (schemas) {
            return schemas.find(s => s.id === 'DATAITEM:' + kind)?.schema;
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
                    <EditPageTitle icon={<ArtifactIcon fontSize={'large'} />} />
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
                                
                            </SimpleForm>
                        </FlatCard>
                    </EditView>
                </>
            </EditBase>
        </Container>
    );
                            };





