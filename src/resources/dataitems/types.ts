import { BlankSchema } from "../../common/schemas";

export enum DataItemTypes {
    DATAITEM = 'dataitem',
}

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


