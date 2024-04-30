import {MonacoEditorInput} from '@dslab/ra-monaco-editor';

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

export const BlankSchema = {
    $schema: 'http://json-schema.org/draft-07/schema',
    type: 'object',
    properties: {},
};

export const getFunctionSpec = (kind: string | undefined) => {
    if (!kind) {
        return BlankSchema;
    }

    return BlankSchema;
};

export const getFunctionUiSpec = (kind: string | undefined) => {
    // if (!kind) {
    //     return undefined;
    // }

    return {
        source: {
            code:{
            'ui:widget': MonacoEditorInput
            }
        },
    };
};
