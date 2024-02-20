// import { JsonSchemaInput } from "@dslab/ra-jsonschema-input";
import {
    Edit,
    FormDataConsumer,
    Labeled,
    SelectInput,
    SimpleForm,
    TextInput,
    useTranslate,
} from 'react-admin';
import { JsonSchemaInput } from '@dslab/ra-jsonschema-input';
import { MetadataSchema } from '../../common/types';
import { ArtifactTypes, getArtifactSpec, getArtifactUiSpec } from './types';
import { PostEditToolbar, RecordTitle } from '../../components/helper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { alphaNumericName } from '../../common/helper';
import { Grid } from '@mui/material';

const kinds = Object.values(ArtifactTypes).map(v => {
    return {
        id: v,
        name: v,
    };
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
export const ArtifactEdit = props => {
    const translate = useTranslate();

    return (
        <Edit title={<RecordTitle prompt={translate('ArtifactString')} />}>
            <ArtifactEditForm {...props} />
        </Edit>
    );
};

const ArtifactEditForm = () => {
    const translate = useTranslate();

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
