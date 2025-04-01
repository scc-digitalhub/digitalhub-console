import { JsonSchemaInput } from '../../components/JsonSchema';
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
import { useNavigate } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { RecordTitle } from '../../components/RecordTitle';
import { useSchemaProvider } from '../../provider/schemaProvider';

const EditToolbar = () => {
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
                label={translate('actions.cancel')}
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
    const schemaProvider = useSchemaProvider();
    const [schemas, setSchemas] = useState<any[]>();
    const kinds = schemas
        ? schemas.map(s => ({
              id: s.kind,
              name: s.kind,
          }))
        : [];

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.list('dataitems').then(res => {
                setSchemas(res || []);
            });
        }
    }, [schemaProvider]);

    return (
        <SimpleForm defaultValues={record} toolbar={<EditToolbar />}>
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
                uiSchema={getDataItemSpecUiSchema(kind)}
                label={false}
            /> */}
        </SimpleForm>
    );
};
