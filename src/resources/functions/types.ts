import { BlankSchema } from "../../common/schemas";

export enum FunctionTypes {
    DBT = 'dbt',
    NEFERTEM = 'nefertem',
    JOB = 'job',
}
export const TaskMap = {
    dbt: ['transform'],
    nefertem: ['profile', 'validate', 'metric', 'infer'],
};
export const getTaskByFunction = kind => {
    return TaskMap[kind];
};

export const getFunctionSpec = (kind: string | undefined) => {
    if (!kind) {
        return BlankSchema;
    }

    return BlankSchema;
};

export const getFunctionUiSpec = (kind: string | undefined) => {
    if (!kind) {
        return undefined;
    }

    return undefined;
};
