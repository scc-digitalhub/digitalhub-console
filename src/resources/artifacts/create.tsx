import { useRootSelector } from "@dslab/ra-root-selector";
import {
  Create,
  FormDataConsumer,
  SelectInput,
  SimpleForm,
  TextInput,
  useTranslate,
} from "react-admin";
import { ArtifactTypes, getArtifactSpec } from "./types";
import { alphaNumericName } from "../../common/helper";
import { MetadataSchema } from "../../common/types";
import { JsonSchemaInput } from "@dslab/ra-jsonschema-input";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export const ArtifactCreate = () => {
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

  const kinds = Object.values(ArtifactTypes).map((v) => {
    return {
      id: v,
      name: v,
    };
  });

  return (
    <Create transform={transform} redirect="list">
      <SimpleForm validate={validator}>
        <TextInput source="name" />
        <SelectInput source="kind" choices={kinds} required />
        <JsonSchemaInput source="metadata" schema={MetadataSchema} />
        <FormDataConsumer<{ kind: string }>>
          {({ formData }) => {
            if (formData.kind)
              return (
                <JsonSchemaInput
                  source="spec"
                  schema={getArtifactSpec(formData.kind)}
                  uiSchema={getArtifactSpec(formData.kind)}
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
