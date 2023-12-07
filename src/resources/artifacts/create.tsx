import { useRootSelector } from "@dslab/ra-root-selector";
import { Create, FormDataConsumer, SelectInput, SimpleForm, TextInput } from "react-admin";
import { ArtifactTypes, getArtifactSpec } from "./types";
import { alphaNumericName } from "../../common/helper";
import { MetadataSchema } from "../../common/types";
import { JsonSchemaInput } from "@dslab/ra-jsonschema-input";

export const ArtifactCreate = () => {
  const { root } = useRootSelector();

  const transform = (data) => ({
    ...data,
    project: root || "",  });
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
                 {({ formData }) => formData.kind &&
                                      <JsonSchemaInput
                                      source="spec"
                                      schema={getArtifactSpec(formData.kind)}
                                      uiSchema={getArtifactSpec(formData.kind)}
                                    />
                 }
             </FormDataConsumer>
      </SimpleForm>
    </Create>
  );
};
