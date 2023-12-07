// import { JsonSchemaInput } from "@dslab/ra-jsonschema-input";
import {
  Edit,
  SelectInput,
  SimpleForm,
  TextInput,
  useRecordContext,
  useTranslate,
} from "react-admin";
import { JsonSchemaInput } from "@dslab/ra-jsonschema-input";
import { FunctionTypes, getFunctionSpec, getFunctionUiSpec } from "./types";
import { MetadataSchema } from "../../common/types";
import { PostEditToolbar, RecordTitle } from "../../components/helper";

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
      <JsonSchemaInput
                source="spec"
                schema={getFunctionSpec(kind)}
                uiSchema={getFunctionUiSpec(kind)}
                label={false}
              />
    </SimpleForm>
  );
};
