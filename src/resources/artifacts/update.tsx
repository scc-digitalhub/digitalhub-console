import { JsonSchemaInput } from '@dslab/ra-jsonschema-input';
import { useTranslate, SimpleForm, TextInput, SelectInput, Button, SaveButton, Toolbar, Create, LoadingIndicator, useDataProvider } from 'react-admin';
import { useParams } from 'react-router-dom';
import { MetadataSchema } from '../../common/types';
import { RecordTitle } from '../../components/helper';
import { ArtifactTypes, getArtifactSpec, getArtifactUiSpec } from './types';
import { useNavigate } from 'react-router-dom';
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useState } from 'react';




const kinds = Object.values(ArtifactTypes).map((v) => {
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
        label={translate("buttons.cancel")}
        onClick={handleClick}
      >
        <ClearIcon />
      </Button>
    </Toolbar>
  );
};
export const ArtifactUpdate = () => {

  const { id } = useParams();
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const [record,setRecord] =useState<Object>();
 
  useEffect(()=> {
    if (dataProvider && id ) {
      dataProvider.getOne('artifacts',{id}).then((data)=>{
        const obj =Object.assign({},data.data) as Object;
        delete obj['id'];
        setRecord(obj);
      });
    }
  },[dataProvider,id]);
  if (!record){
    return(
      <LoadingIndicator/>
    )
  }


  return (
    <Create title={<RecordTitle prompt={translate("artifactString")}/>} redirect="list">
      <ArtifactEditForm record={record}  />
    </Create>
  );
};

const ArtifactEditForm = (props:{record:any}) => {
  const {
    record
  }=props;
  const kind = record?.kind || undefined;
  return (
    <SimpleForm  defaultValues={record} toolbar={<PostCreateToolbar />}>
      <TextInput source="name" disabled />
      <SelectInput source="kind" choices={kinds} disabled />
      <JsonSchemaInput source="metadata" schema={MetadataSchema} />
      <JsonSchemaInput
                source="spec"
                schema={getArtifactSpec(kind)}
                uiSchema={getArtifactUiSpec(kind)}
                label={false}
              />
    </SimpleForm>
  );
};


