export enum DataItemTypes {
  DATAITEM = "dataitem"
}


export const BlankSchema = {
  $schema: "http://json-schema.org/draft-07/schema",
  type: "object",
  properties: {},
};

export const getDataItemSpec = (kind: string | undefined) => {
  if (!kind) {
    return BlankSchema;
  }

  return BlankSchema;
};

export const getDataItemUiSpec = (kind: string | undefined) => {
  if (!kind) {
    return undefined;
  }

  return undefined;
};
