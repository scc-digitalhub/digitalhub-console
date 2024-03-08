// import { JsonSchemaInput } from "@dslab/ra-jsonschema-input";
import { JsonSchemaInput } from '@dslab/ra-jsonschema-input';
import { Card, CardContent, Container, Grid } from '@mui/material';
import {
    Edit,
    EditBase,
    FormDataConsumer,
    LoadingIndicator,
    SelectInput,
    SimpleForm,
    TextInput,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { MetadataSchema } from '../../common/types';
import { PostEditToolbar, RecordTitle } from '../../components/helper';
import { BlankSchema, DataItemTypes } from './types';
import { alphaNumericName } from '../../common/helper';
import { useState, useEffect } from 'react';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { getFunctionSpec } from '../functions/types';

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
export const DataItemEdit = props => {
    const record = useRecordContext();
    const translate = useTranslate();
    return (
        <Edit title={<RecordTitle prompt={translate('dataItemsString')} />}>
            <DataItemEditForm {...props} />
        </Edit>
    );
};

const DataItemEditForm = () => {
    const translate = useTranslate();
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();
    const [schemas, setSchemas] = useState<any[]>();
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

    const getDataitemSpec = (kind: string | undefined) => {
        if (!kind) {
            return BlankSchema;
        }

        if (schemas) {
            return schemas.find(s => s.id === 'DATAITEM:' + kind)?.schema;
        }

        return BlankSchema;
    };
    return (
        <SimpleForm toolbar={<PostEditToolbar />} validate={validator}>
            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={4}>
                    <TextInput
                        source="name"
                        label="resources.function.name"
                        disabled
                    />
                </Grid>
                <Grid item xs={6}>
                    <SelectInput
                        source="kind"
                        label="resources.function.kind"
                        choices={kinds}
                        disabled
                    />
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
                                uiSchema={getDataitemSpec(formData.kind)}
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
