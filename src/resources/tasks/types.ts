export enum TaskTypes {
  PROFILE = "profile",
  VALIDATE = "validate",
  INFER = "infer",
  METRIC = "metric",
  TRANSFORM = "transform",
}

export const TaskSchema = {
  $schema: "http://json-schema.org/draft-07/schema",
  type: "object",
  title: "Spec",
  required: [],
  properties: {
    function: {
      type: "string",
    }
  },
};


export const BlankSchema = {
  $schema: "http://json-schema.org/draft-07/schema",
  type: "object",
  properties: {},
};

export const getSchemaTask = (kind: string | undefined) => {
  if (!kind) {
    return BlankSchema;
  }

  if (kind === "dbt") {
    return TaskSchema;
  }

  return BlankSchema;
};
