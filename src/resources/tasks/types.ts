import { k8sSpec } from '../../common/schemas';

export const getTaskSpec = (kind: any | undefined) => {
    if (kind.properties.k8s) {
        return taskSpecUiSchemaExternal;
    }

    return taskSpecUiSchemaInternal;
};

export const taskSpecUiSchemaExternal = {
    task: {
        'ui:readonly': true,
    },
    function: {
        'ui:widget': 'hidden',
    },
    function_spec: {
        source: {
            'ui:widget': 'hidden',
        },
    },
    k8s: k8sSpec,
};
export const taskSpecUiSchemaInternal = {
    task: {
        'ui:readonly': true,
    },
    function: {
        'ui:widget': 'hidden',
    },
    function_spec: {
        source: {
            'ui:widget': 'hidden',
        },
    },
    ...k8sSpec,
};
