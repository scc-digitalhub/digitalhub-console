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
import { MetadataSchema } from '../../common/types';
import { FunctionTypes, getFunctionSpec, getFunctionUiSpec } from './types';
import { useNavigate } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useState } from 'react';
import { RecordTitle } from '../../components/RecordTitle';

const kinds = Object.values(FunctionTypes).map(v => {
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
export const FunctionUpdate = () => {
    const { id } = useParams();
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const [record, setRecord] = useState<Object>();

    useEffect(() => {
        console.log('callback');

        if (dataProvider && id) {
            console.log('presente');

            dataProvider.getOne('functions', { id }).then(data => {
                const obj = Object.assign({}, data.data) as Object;
                delete obj['id'];
                setRecord(obj);
            });
        }
    }, [dataProvider, id]);
    console.log('record', record);
    if (!record) {
        return <LoadingIndicator />;
    }

    return (
        <Create
            title={<RecordTitle prompt={translate('functionsString')} />}
            redirect="list"
        >
            <FunctionEditForm record={record} />
        </Create>
    );
};

const FunctionEditForm = (props: { record: any }) => {
    const { record } = props;
    const kind = record?.kind || undefined;
    console.log('record', record);
    return (
        <SimpleForm defaultValues={record} toolbar={<PostCreateToolbar />}>
            <TextInput source="name" disabled />
            <SelectInput source="kind" choices={kinds} disabled />
            <JsonSchemaInput source="metadata" schema={MetadataSchema} />
            <JsonSchemaInput
                source="spec"
                schema={getFunctionSpec(kind)}
                uiSchema={getFunctionUiSpec(kind)}
                label={false}
            />
        </SimpleForm>
    );
};
