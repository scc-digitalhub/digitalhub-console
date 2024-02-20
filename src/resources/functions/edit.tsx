// import { JsonSchemaInput } from "@dslab/ra-jsonschema-input";
import {
    Edit,
    FormDataConsumer,
    Labeled,
    SelectInput,
    SimpleForm,
    TextInput,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { JsonSchemaInput } from '@dslab/ra-jsonschema-input';
import { FunctionTypes, getFunctionSpec, getFunctionUiSpec } from './types';
import { MetadataSchema } from '../../common/types';
import { PostEditToolbar, RecordTitle } from '../../components/helper';
import { alphaNumericName } from '../../common/helper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Grid } from '@mui/material';

const kinds = Object.values(FunctionTypes).map(v => {
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

export const FunctionEdit = props => {
    const record = useRecordContext();
    const translate = useTranslate();
    const kind = record?.kind || undefined;
    console.log(kind);
    return (
        <Edit title={<RecordTitle prompt={translate('functionsString')} />}>
            <FunctionEditForm {...props} />
        </Edit>
    );
};

const FunctionEditForm = () => {
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
