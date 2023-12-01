import { useRootSelector } from "@dslab/ra-root-selector";
import { Create, SelectInput, SimpleForm, TextInput, useRecordContext } from "react-admin";
import { ArtifactTypes, getArtifactSpec } from "./types";
import { alphaNumericName } from "../../common/helper";
import { MetadataSchema } from "../../common/types";
import JsonSchemaInput from "../../components/metadata/JsonSchemaInput";

export const ArtifactCreate = () => {
  const { root } = useRootSelector();
  const record = useRecordContext();
  const kind = record?.kind || undefined;
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
      <JsonSchemaInput
        source="spec"
        schema={getArtifactSpec(kind)}
        uiSchema={getArtifactSpec(kind)}
      />
      </SimpleForm>
    </Create>
  );
};
