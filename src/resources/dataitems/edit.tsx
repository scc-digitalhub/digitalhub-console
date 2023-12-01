// import { JsonSchemaInput } from "@dslab/ra-jsonschema-input";
import {
  Button,
  Edit,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  useRecordContext,
  useTranslate,
} from "react-admin";
import JsonSchemaInput from "../../components/metadata/JsonSchemaInput";
import { MetadataSchema } from "../../common/types";
import { DataItemTypes, getDataItemSpec, getDataItemUiSpec } from "./types";
import { RecordTitle } from "../../components/helper";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";

const kinds = Object.values(DataItemTypes).map((v) => {
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

export const DataItemEdit = (props) => {
  const record = useRecordContext();
  const translate = useTranslate();
  const kind = record?.kind || undefined;
  console.log(kind);
  return (
    <Edit title={<RecordTitle prompt={translate("dataItemsString")} />}>
      <DataItemEditForm {...props} />
    </Edit>
  );
};

const DataItemEditForm = () => {
  const record = useRecordContext();
  const kind = record?.kind || undefined;

  return (
    <SimpleForm toolbar={<PostCreateToolbar />}>
      <TextInput source="name" disabled />
      <SelectInput source="kind" choices={kinds} disabled />
      <JsonSchemaInput source="metadata" schema={MetadataSchema} />
      <JsonSchemaInput
        source="spec"
        schema={getDataItemSpec(kind)}
        uiSchema={getDataItemUiSpec(kind)}
      />
    </SimpleForm>
  );
};
