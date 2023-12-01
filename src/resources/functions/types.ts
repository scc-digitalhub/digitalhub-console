export enum FunctionTypes {
  DBT = "dbt",
  NEFERTEM = "nefertem",
  JOB = "job",
}


export const FunctionDbtSchema = {
  $schema: "http://json-schema.org/draft-07/schema",
  type: "object",
  title: "DBT",
  required: ["source"],
  properties: {
    source: {
      type: "string",
    },
  },
};

export const FunctionDbtUiSchema = {
  source: {
    "ui:widget": "textarea",
  },
};

export const BlankSchema = {
  $schema: "http://json-schema.org/draft-07/schema",
  type: "object",
  properties: {},
};

export const getFunctionSpec = (kind: string | undefined) => {
  if (!kind) {
    return BlankSchema;
  }

  if (kind === "dbt") {
    return FunctionDbtSchema;
  }

  return BlankSchema;
};

export const getFunctionUiSpec = (kind: string | undefined) => {
  if (!kind) {
    return undefined;
  }

  if (kind === "dbt") {
    return FunctionDbtUiSchema;
  }

  return undefined;
};
