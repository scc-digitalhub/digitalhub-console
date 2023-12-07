import { useRootSelector } from "@dslab/ra-root-selector";
import { Create, FormDataConsumer, SelectInput, SimpleForm, TextInput } from "react-admin";
import { DataItemTypes, getDataItemSpec, getDataItemUiSpec } from "./types";
import { MetadataSchema } from "../../common/types";
import { alphaNumericName } from "../../common/helper";
import { JsonSchemaInput } from "@dslab/ra-jsonschema-input";


export const DataItemCreate = () => {
  const { root } = useRootSelector();
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


  const kinds = Object.values(DataItemTypes).map((v) => {
    return {
      id: v,
      name: v,
    };
  });

  return (
    <Create transform={transform} redirect="list">
      <SimpleForm validate={validator}>
        <TextInput source="name" required />
        <SelectInput source="kind" choices={kinds} required />
        <JsonSchemaInput source="metadata" schema={MetadataSchema} />

              <FormDataConsumer<{ kind: string }>>
                 {({ formData }) => formData.kind &&
                                <JsonSchemaInput
                                source="spec"
                                schema={getDataItemSpec(formData.kind)}
                                uiSchema={getDataItemUiSpec(formData.kind)}
                              />
                 }
             </FormDataConsumer>
      </SimpleForm>
    </Create>
  );
};
