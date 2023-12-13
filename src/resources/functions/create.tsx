import { useRootSelector } from "@dslab/ra-root-selector";
import { Create, FormDataConsumer, Labeled, SelectInput, SimpleForm, TextInput, useTranslate } from "react-admin";
import { FunctionTypes, getFunctionSpec, getFunctionUiSpec } from "./types";
import { MetadataSchema } from "../../common/types";
import { alphaNumericName } from "../../common/helper";
import { JsonSchemaInput } from "@dslab/ra-jsonschema-input";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";

export const FunctionCreate = () => {
  const { root } = useRootSelector();
  const translate = useTranslate();

  const transform = (data) => ({
    ...data,
    project: root || "",
  });

  const validator = (data) => {
    const errors: any = {};

    if (!("kind" in data)) {
      errors.kind = "messages.validation.required";
    }
    if (!alphaNumericName(data.name)) {
      errors.name = "validation.wrongChar";
    }
    return errors;
  };

  const kinds = Object.values(FunctionTypes).map((v) => {
    return {
      id: v,
      name: v,
    };
  });

  return (
    <Create transform={transform} redirect="list">
      <SimpleForm validate={validator}>
      <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={4}>
          <Labeled label={translate("resources.function.name")}>
          <TextInput source="name" required />
          </Labeled>
        </Grid>
        <Grid item xs={6}>
          <Labeled label={translate("resources.function.kind")}>
          <SelectInput source="kind" choices={kinds} required />
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
                  schema={getFunctionSpec(formData.kind)}
                  uiSchema={getFunctionUiSpec(formData.kind)}
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
