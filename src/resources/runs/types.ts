import { getTaskByFunction } from '../functions/types';
import { getTaskSpec, taskSpecUiSchema } from '../tasks/types';

export enum RunTypes {
    COMPLETED = 'CREATED',
    EXECUTION = 'EXECUTION',
}

export const runSpecUiSchemaFactory = (kind: string) => {
    const schema = {
        task: {
            'ui:widget': 'hidden',
        },
        local_execution: {
            'ui:widget': 'hidden',
        },
        function_spec: {
            'ui:widget': 'hidden',
        },
        workflow_spec: {
            'ui:widget': 'hidden',
        },
    };
    // expect to have runtime+task
    const split = kind.split('+');
    const runtime = split[0];
    const task = split[1];
    const tasks = getTaskByFunction(runtime) || [];
    tasks.forEach(t => {
        schema[t + '_spec'] = { 'ui:widget': 'hidden' };
    });

    return schema;
};
export const getRunSchemaUI = (kind: string) => {
    const schema = {
        task: {
            'ui:widget': 'hidden',
        },
        local_execution: {
            'ui:widget': 'hidden',
        },
        function_spec: {
            'ui:widget': 'hidden',
        },
        workflow_spec: {
            'ui:widget': 'hidden',
        },
    };
    // expect to have runtime+task
    const split = kind.split('+');
    const runtime = split[0];
    const task = split[1];
    const tasks = getTaskByFunction(runtime) || [];
    tasks.forEach(t => {
        schema[t + '_spec'] = { 'ui:widget': 'hidden' };
    });

    return schema;
};
export const getTaskSchemaUI = (schema: any, record) => {
    // console.log(schema);
    // const schema = {
    //     task: {
    //         'ui:widget': 'hidden',
    //     },
    //     local_execution: {
    //         'ui:widget': 'hidden',
    //     },
    //     function_spec: {
    //         'ui:widget': 'hidden',
    //     },
    //     workflow_spec: {
    //         'ui:widget': 'hidden',
    //     },
    // };
    // expect to have runtime+task
    const split = record.kind.split('+');
    const runtime = split[0];
    const task = split[1];
    const tasks = getTaskByFunction(runtime) || [];
    const taskSchema = schema?.properties[task+ '_spec'];
    return taskSchema;

};
