export enum DataItemTypes {
    DATAITEM = 'dataitem',
}

export const BlankSchema = {
    $schema: 'http://json-schema.org/draft-07/schema',
    type: 'object',
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

export const DataItemSpecSchema = {
    $schema: 'http://json-schema.org/draft-07/schema',
    type: 'object',
    title: 'Spec',
    properties: {
        key: {
            type: 'string',
        },
        path: {
            type: 'string',
        },
    },
};

export const DataItemSpecUiSchema = {
    key: {
        'ui:title': 'Key',
    },
    path: {
        'ui:title': 'Path',
    },
};
