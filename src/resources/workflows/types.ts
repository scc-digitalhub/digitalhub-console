export enum WorkflowTypes {
    DBT = 'dbt',
    NEFERTEM = 'nefertem',
    JOB = 'job',
}
export const BlankSchema = {
    $schema: 'http://json-schema.org/draft-07/schema',
    type: 'object',
    properties: {},
};

export const getWorkflowSpec = (kind: string | undefined) => {
    if (!kind) {
        return BlankSchema;
    }

    return BlankSchema;
};

export const getWorkflowUiSpec = (kind: string | undefined) => {
    if (!kind) {
        return undefined;
    }

    return undefined;
};
