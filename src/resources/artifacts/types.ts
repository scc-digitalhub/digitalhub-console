export enum ArtifactTypes {
  ARTIFACT = "artifact"
}

export const ArtifactDbtUiSchema = {
  source: {
    "ui:widget": "textarea",
  },
};

export const BlankSchema = {
  $schema: "http://json-schema.org/draft-07/schema",
  type: "object",
  properties: {},
};

export const getArtifactSpec = (kind: string | undefined) => {
  if (!kind) {
    return BlankSchema;
  }

  return BlankSchema;
};

export const getArtifactUiSpec = (kind: string | undefined) => {
  if (!kind) {
    return undefined;
  }
  return undefined;
};
