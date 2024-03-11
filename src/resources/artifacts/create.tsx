import { useRootSelector } from '@dslab/ra-root-selector';
import {
    Create,
    FormDataConsumer,
    Labeled,
    LoadingIndicator,
    SelectInput,
    SimpleForm,
    TextInput,
    useTranslate,
} from 'react-admin';
import { ArtifactTypes, getArtifactUiSpec } from './types';
import { alphaNumericName } from '../../common/helper';
import { BlankSchema, MetadataSchema } from '../../common/schemas';
import { JsonSchemaInput } from '@dslab/ra-jsonschema-input';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Grid } from '@mui/material';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { useState, useEffect } from 'react';

export const ArtifactCreate = () => {
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
        <Create transform={transform} redirect="list">
            <SimpleForm validate={validator}>
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={4}>
                        <Labeled label={translate('resources.dataitem.name')}>
                            <TextInput source="name" required />
                        </Labeled>
                    </Grid>
                    <Grid item xs={6}>
                        <Labeled label={translate('resources.dataitem.kind')}>
                            <SelectInput
                                source="kind"
                                choices={kinds}
                                required
                            />
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
