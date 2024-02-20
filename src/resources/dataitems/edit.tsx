// import { JsonSchemaInput } from "@dslab/ra-jsonschema-input";
import { JsonSchemaInput } from '@dslab/ra-jsonschema-input';
import { Container, Grid } from '@mui/material';
import {
    Edit,
    EditBase,
    SelectInput,
    SimpleForm,
    TextInput,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { MetadataSchema } from '../../common/types';
import { PostEditToolbar, RecordTitle } from '../../components/helper';
import { DataItemTypes, Schema } from './types';

const kinds = Object.values(DataItemTypes).map(v => {
    return {
        id: v,
        name: v,
    };
});

export const DataItemEdit = props => {
    const record = useRecordContext();
    const translate = useTranslate();
    const kind = record?.kind || undefined;
    console.log(kind);
    return (
        <Edit title={<RecordTitle prompt={translate('dataItemsString')} />}>
            <DataItemEditForm {...props} />
        </Edit>
    );
};

const DataItemEditForm = () => {
    const translate = useTranslate();

    return (
        <SimpleForm toolbar={<PostEditToolbar />}>
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
        </SimpleForm>
    );
};
