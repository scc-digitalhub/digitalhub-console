import {
    Button,
    Edit,
    FormDataConsumer,
    Labeled,
    LoadingIndicator,
    SaveButton,
    SelectInput,
    SimpleForm,
    TextInput,
    Toolbar,
    useTranslate,
} from 'react-admin';
import { JsonSchemaInput } from '@dslab/ra-jsonschema-input';
import { BlankSchema, MetadataSchema } from '../../common/schemas';
import {
    ArtifactTypes,
    getArtifactSpec,
    getArtifactUiSpec,
} from './types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { alphaNumericName } from '../../common/helper';
import { Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { useNavigate } from 'react-router';
import ClearIcon from '@mui/icons-material/Clear';
import { NewVersionButton } from '../../components/NewVersionButton';
import { RecordTitle } from '../../components/RecordTitle';

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
export const ArtifactEdit = props => {
    const translate = useTranslate();

    return (
        <Edit title={<RecordTitle prompt={translate('ArtifactString')} />}>
            <ArtifactEditForm {...props} />
        </Edit>
    );
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
            <NewVersionButton />
        </Toolbar>
    );
};

const ArtifactEditForm = () => {
    const translate = useTranslate();
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();
    const [schemas, setSchemas] = useState<any[]>();
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
            return schemas.find(s => s.id === 'ARTIFACT:' + kind)?.schema;
        }

        return BlankSchema;
    };
    return (
        <SimpleForm toolbar={<ArtifactEditToolbar />} validate={validator}>
            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={4}>
                    <Labeled>
                        <TextInput source="name" readOnly />
                    </Labeled>
                </Grid>
                <Grid item xs={6}>
                    <Labeled>
                        <SelectInput source="kind" choices={kinds} readOnly />
                    </Labeled>
                </Grid>
            </Grid>
            <JsonSchemaInput source="metadata" schema={MetadataSchema} />
            <FormDataConsumer<{ kind: string }>>
                {({ formData }) => {
                    if (formData.kind)
                        return (
                            <JsonSchemaInput
                                source="spec"
                                schema={getArtifactSpec(formData.kind)}
                                uiSchema={getArtifactUiSpec(formData.kind)}
                            />
                        );
                    else
                        return (
                            <Card sx={{ width: 1, textAlign: 'center' }}>
                                <CardContent>
                                    {translate('resources.common.emptySpec')}{' '}
                                </CardContent>
                            </Card>
                        );
                }}
            </FormDataConsumer>
        </SimpleForm>
    );
};
