import { SourceCodeTemplate } from "../../components/SourceCodeTemplate";

export enum FunctionTypes {
    DBT = 'dbt',
    NEFERTEM = 'nefertem',
    JOB = 'job',
}
export const TaskMap = {
    dbt: ['transform'],
    nefertem: ['profile', 'validate', 'metric', 'infer'],
    container: ['job', 'serve', 'deploy', 'build'],
    mlrun: ['job', 'build', 'serve'],
    kfp: ['pipeline']
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
    return {
        source: {
            'ui:ObjectFieldTemplate': SourceCodeTemplate,             
            base64: {
                'ui:widget': 'hidden',
                'ui:disabled': 'true',
            },
            code:{
                'ui:widget': 'hidden',
                'ui:disabled': 'true',
            }
        },
    }
};
