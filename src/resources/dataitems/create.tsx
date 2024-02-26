import { useRootSelector } from '@dslab/ra-root-selector';
import {
    Create,
    FormDataConsumer,
    LoadingIndicator,
    SelectInput,
    SimpleForm,
    TextInput,
    required,
    useTranslate,
} from 'react-admin';
import { BlankSchema, getDataItemUiSpec } from './types';
import { MetadataSchema } from '../../common/types';
import { alphaNumericName } from '../../common/helper';
import { JsonSchemaInput } from '@dslab/ra-jsonschema-input';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Grid } from '@mui/material';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { useEffect, useState } from 'react';

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
        <Create transform={transform} redirect="list">
            <SimpleForm>
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={4}>
                        <TextInput
                            source="name"
                            label="resources.dataitem.name"
                            validate={validateName}
                            sx={{ marginTop: '8px' }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <SelectInput
                            source="kind"
                            label="resources.dataitem.kind"
                            choices={kinds}
                            validate={required()}
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
                                    schema={getDataItemSpec(formData.kind)}
                                    uiSchema={getDataItemUiSpec(formData.kind)}
                                />
                            );
                        else
                            return (
                                <Card sx={{ width: 1, textAlign: 'center' }}>
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
        </Create>
    );
};

const nameValidation = value => {
    if (!alphaNumericName(value)) {
        return 'validation.wrongChar';
    }
    return undefined;
};

const validateName = [required(), nameValidation];
