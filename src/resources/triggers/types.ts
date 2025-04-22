import { mergeUiTemplate } from '../../common/schemas';

export const getTriggerUiSpec = (schema: any | undefined) => {
    //filter and merge with template
    if (!schema || !('properties' in schema)) {
        return {};
    }

    const base = {
        'ui:order': ['task', 'function', 'template'],
        task: {
            'ui:readonly': true,
        },
        function: {
            'ui:readonly': true,
        },
        template: {
            'ui:widget': 'hidden',
        },
    };

    return mergeUiTemplate(schema, base, {});
};
