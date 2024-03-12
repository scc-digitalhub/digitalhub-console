import { JsonSchemaInput } from '@dslab/ra-jsonschema-input';
import {
    useTranslate,
    SimpleForm,
    TextInput,
    SelectInput,
    Button,
    SaveButton,
    Toolbar,
    Create,
    LoadingIndicator,
    useDataProvider,
} from 'react-admin';
import { useParams } from 'react-router-dom';
import { MetadataSchema } from '../../common/schemas';
import { DataItemTypes } from './types';
import { useNavigate } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { RecordTitle } from '../../components/RecordTitle';

const kinds = Object.values(DataItemTypes).map(v => {
    return {
        id: v,
        name: v,
    };
});

const PostCreateToolbar = () => {
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
        </Toolbar>
    );
};
export const DataItemUpdate = () => {
    const { id } = useParams();
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const [record, setRecord] = useState<Object>();

    useEffect(() => {
        if (dataProvider && id) {
            dataProvider.getOne('dataitems', { id }).then(data => {
                const obj = Object.assign({}, data.data) as Object;
                delete obj['id'];
                setRecord(obj);
            });
        }
    }, [dataProvider, id]);
    if (!record) {
        return <LoadingIndicator />;
    }

    return (
        <Create
            title={<RecordTitle prompt={translate('dataItemString')} />}
            redirect="list"
        >
            <DataItemEditForm record={record} />
        </Create>
    );
};

const DataItemEditForm = (props: { record: any }) => {
    const { record } = props;
    const kind = record?.kind || undefined;
    console.log('record', record);
    return (
        <SimpleForm defaultValues={record} toolbar={<PostCreateToolbar />}>
            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={4}>
                    <TextInput
                        source="name"
                        label="resources.functions.name"
                        disabled
                    />
                </Grid>
                <Grid item xs={6}>
                    <SelectInput
                        source="kind"
                        label="resources.functions.kind"
                        choices={kinds}
                        disabled
                    />
                </Grid>
            </Grid>

            <JsonSchemaInput source="metadata" schema={MetadataSchema} />
            {/* <JsonSchemaInput
                source="spec"
                schema={getDataItemSpec(kind)}
                uiSchema={getDataItemUiSpec(kind)}
                label={false}
            /> */}
        </SimpleForm>
    );
};
