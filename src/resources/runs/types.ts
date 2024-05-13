import { getTaskByFunction } from '../functions/types';
import { taskSpecUiSchema } from '../tasks/types';

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
