// import { JsonSchemaInput } from "@dslab/ra-jsonschema-input";
import {
  Edit,
  SelectInput,
  SimpleForm,
  TextInput,
  useRecordContext,
  useTranslate,
} from "react-admin";
import { JsonSchemaInput,JsonSchemaField } from "@dslab/ra-jsonschema-input";
import { MetadataSchema } from "../../common/types";
import { DataItemTypes, getDataItemSpec, getDataItemUiSpec } from "./types";
import { PostEditToolbar, RecordTitle } from "../../components/helper";

const kinds = Object.values(DataItemTypes).map((v) => {
  return {
    id: v,
    name: v,
  };
});



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
    <SimpleForm toolbar={<PostEditToolbar />}>
      <TextInput source="name" disabled />
      <SelectInput source="kind" choices={kinds} disabled />
      <JsonSchemaInput source="metadata" schema={MetadataSchema} />
      <JsonSchemaField
        source="spec"
        schema={getDataItemSpec(kind)}
        uiSchema={getDataItemUiSpec(kind)}
        label={false}
      />
    </SimpleForm>
  );
};
