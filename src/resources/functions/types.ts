export enum FunctionTypes {
    DBT = 'dbt',
    NEFERTEM = 'nefertem',
    JOB = 'job',
}

export const getFunctionUiSpec = (kind: string | undefined) => {
    if (!kind) {
        return undefined;
    }

    return undefined;
};
