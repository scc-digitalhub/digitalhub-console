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
import { JsonSchemaInput,JsonSchemaField } from "@dslab/ra-jsonschema-input";
import { FunctionTypes, getFunctionSpec, getFunctionUiSpec } from "./types";
import { MetadataSchema } from "../../common/types";
import { NewVersionButton, PostEditToolbar, RecordTitle } from "../../components/helper";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";

const kinds = Object.values(FunctionTypes).map((v) => {
  return {
    id: v,
    name: v,
  };
});

export const FunctionEdit = (props) => {
  const record = useRecordContext();
  const translate = useTranslate();
  const kind = record?.kind || undefined;
  console.log(kind);
  return (
    <Edit title={<RecordTitle prompt={translate("functionsString")} />}>
      <FunctionEditForm {...props} />
    </Edit>
  );
};

const FunctionEditForm = () => {
  const record = useRecordContext();
  const kind = record?.kind || undefined;

  return (
    <SimpleForm  toolbar={<PostEditToolbar />}>
      <TextInput source="name" disabled />
      <SelectInput source="kind" choices={kinds} disabled />
      <JsonSchemaInput source="metadata" schema={MetadataSchema} />
      <JsonSchemaField
                source="spec"
                schema={getFunctionSpec(kind)}
                uiSchema={getFunctionUiSpec(kind)}
                label={false}
              />
    </SimpleForm>
  );
};
