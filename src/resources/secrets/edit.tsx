// import { JsonSchemaInput } from "@dslab/ra-jsonschema-input";
import {
    Edit,
    Labeled,
    LoadingIndicator,
    SimpleForm,
    TextInput,
    useTranslate,
} from 'react-admin';
import { alphaNumericName } from '../../common/helper';
import { Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSchemaProvider } from '../../provider/schemaProvider';
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
export const SecretEdit = props => {
    const translate = useTranslate();

    return (
        <Edit title={<RecordTitle prompt={translate('SecretString')} />}>
            <SecretEditForm {...props} />
        </Edit>
    );
};

const SecretEditForm = () => {
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
    return (
        <SimpleForm validate={validator}>
            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={4}>
                    <Labeled label={translate('resources.function.name')}>
                        <TextInput source="name" />
                    </Labeled>
                </Grid>
                <Grid item xs={6}>
                    <Labeled label={translate('resources.function.kind')}>
                        <TextInput source="value" />
                    </Labeled>
                </Grid>
            </Grid>
        </SimpleForm>
    );
};
