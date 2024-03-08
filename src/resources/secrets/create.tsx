import { useRootSelector } from '@dslab/ra-root-selector';
import {
    Create,
    FormDataConsumer,
    Labeled,
    LoadingIndicator,
    SelectInput,
    SimpleForm,
    TextInput,
    useDataProvider,
    useTranslate,
} from 'react-admin';
import { alphaNumericName } from '../../common/helper';
import { MetadataSchema } from '../../common/types';
import { JsonSchemaInput } from '@dslab/ra-jsonschema-input';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Grid } from '@mui/material';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { useState, useEffect } from 'react';

export const SecretCreate = () => {
    const { root } = useRootSelector();
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const validator = data => {
        const errors: any = {};

        if (!('name' in data)) {
            errors.kind = 'messages.validation.required';
        }
        if (!('value' in data)) {
            errors.kind = 'messages.validation.required';
        }

        if (!alphaNumericName(data.name)) {
            errors.name = 'validation.wrongChar';
        }
        return errors;
    };
    const postSave = (data) => {
        const obj = { project: root || '' };
        Object.defineProperty(obj, data.name, {
            value: data.value,
            writable: true,
            configurable: true,
            enumerable: true,
        });
        dataProvider.createSecret( obj);
    };
    return (
        <Create
            redirect="list"
        >
            <SimpleForm validate={validator} onSubmit={postSave}>
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Labeled label={translate('resources.secret.name')}>
                            <TextInput source="name" required />
                        </Labeled>
                    </Grid>
                    <Grid item xs={6}>
                        <Labeled label={translate('resources.secret.value')}>
                            <TextInput source="value" required />
                        </Labeled>
                    </Grid>
                </Grid>
            </SimpleForm>
        </Create>
    );
};
