import { mergeUiTemplate } from '../../common/schemas';

export const getRunUiSpec = (schema: any | undefined) => {
    //filter and merge with template
    if (!schema || !('properties' in schema)) {
        return {};
    }

    const base = {
        'ui:order': ['task', 'local_execution'],

        task: {
            'ui:readonly': true,
        },
        local_execution: {
            'ui:widget': 'hidden',
        },
    };

    return mergeUiTemplate(schema, base, {});
};
