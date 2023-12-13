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
} from "react-admin";
import { JsonSchemaInput } from "@dslab/ra-jsonschema-input";
import { MetadataSchema } from "../../common/types";
import { DataItemTypes, getDataItemSpec, getDataItemUiSpec } from "./types";
import { PostEditToolbar, RecordTitle } from "../../components/helper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";

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
  const translate = useTranslate();


  return (
    <SimpleForm toolbar={<PostEditToolbar />}>
       <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={4}>
          <Labeled label={translate("resources.function.name")}>
            <TextInput source="name" disabled />
          </Labeled>
        </Grid>
        <Grid item xs={6}>
          <Labeled label={translate("resources.function.kind")}>
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
                  schema={getDataItemSpec(formData.kind)}
                  uiSchema={getDataItemUiSpec(formData.kind)}
                />
              );
            else
              return (
                <Card sx={{ width: 1, textAlign: "center" }}>
                  <CardContent>
                    {translate("resources.common.emptySpec")}{" "}
                  </CardContent>
                </Card>
              );
          }}
        </FormDataConsumer>
    </SimpleForm>
  );
};
