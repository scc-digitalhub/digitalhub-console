import { useRootSelector } from "@dslab/ra-root-selector";
import {
  Create,
  FormDataConsumer,
  SelectInput,
  SimpleForm,
  TextInput,
  required,
  useTranslate,
} from "react-admin";
import { DataItemTypes, getDataItemSpec, getDataItemUiSpec } from "./types";
import { MetadataSchema } from "../../common/types";
import { alphaNumericName } from "../../common/helper";
import { JsonSchemaInput } from "@dslab/ra-jsonschema-input";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";

export const DataItemCreate = () => {
  const { root } = useRootSelector();
  const translate = useTranslate();

  const transform = (data) => ({
    ...data,
    project: root || "",
  });

  const kinds = Object.values(DataItemTypes).map((v) => {
    return {
      id: v,
      name: v,
    };
  });

  return (
    <Create transform={transform} redirect="list">
      <SimpleForm>
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={4}>
            <TextInput
              source="name"
              label="resources.dataitem.name"
              validate={validateName}
              sx={{ marginTop: "8px" }}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput
              source="kind"
              label="resources.dataitem.kind"
              choices={kinds}
              validate={required()}
            />
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
    </Create>
  );
};

const nameValidation = (value) => {
  if (!alphaNumericName(value)) {
    return "validation.wrongChar";
  }
  return undefined;
};

const validateName = [required(), nameValidation];
