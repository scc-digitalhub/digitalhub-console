// import { JsonSchemaInput } from "@dslab/ra-jsonschema-input";
import {
    Edit,
    FormDataConsumer,
    Labeled,
    LoadingIndicator,
    SelectInput,
    SimpleForm,
    TextInput,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { JsonSchemaInput } from '@dslab/ra-jsonschema-input';
import { BlankSchema, FunctionTypes, getFunctionSpec, getFunctionUiSpec } from './types';
import { MetadataSchema } from '../../common/types';
import { PostEditToolbar, RecordTitle } from '../../components/helper';
import { alphaNumericName } from '../../common/helper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Grid } from '@mui/material';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { useState, useEffect } from 'react';


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

export const FunctionEdit = props => {
    const translate = useTranslate();
    
    return (
        <Edit title={<RecordTitle prompt={translate('functionsString')} />}>
            <FunctionEditForm {...props} />
        </Edit>
    );
};

const FunctionEditForm = () => {
    const translate = useTranslate();
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();
    const [schemas, setSchemas] = useState<any[]>();
    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.list('functions').then(res => {
                if (res) {
                    setSchemas(res);

                    const values = res.map(s => ({
                        id: s.kind,
                        name: s.kind
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
        <SimpleForm toolbar={<PostEditToolbar />} validate={validator}>
            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={4}>
                    <Labeled label={translate('resources.function.name')}>
                        <TextInput source="name" disabled />
                    </Labeled>
                </Grid>
                <Grid item xs={6}>
                    <Labeled label={translate('resources.function.kind')}>
                        <SelectInput source="kind" choices={kinds} disabled />
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
                                schema={getFunctionSpec(formData.kind)}
                                uiSchema={getFunctionUiSpec(formData.kind)}
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
