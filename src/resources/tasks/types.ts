import { k8sSpec } from '../../common/schemas';

// export enum TaskTypes {
//     PROFILE = 'profile',
//     VALIDATE = 'validate',
//     INFER = 'infer',
//     METRIC = 'metric',
//     TRANSFORM = 'transform',
//     PIPELINE = 'pipeline',
//     MLRUN = 'mlrun'
// }
// export const TaskDbtSchema = {
//     title: 'TaskParams',
//     description: 'Base task model.',
//     type: 'object',
//     properties: {
//         function: { title: 'Function', type: 'string' },
//         node_selector: {
//             title: 'Node Selector',
//             default: {},
//             allOf: [{ $ref: '#/definitions/NodeSelector' }],
//         },
//         volumes: {
//             title: 'Volumes',
//             default: [],
//             type: 'array',
//             items: { $ref: '#/definitions/Volume' },
//         },
//         resources: {
//             title: 'Resources',
//             default: {},
//             allOf: [{ $ref: '#/definitions/Resource' }],
//         },
//         env: {
//             title: 'Env',
//             default: [],
//             type: 'array',
//             items: { $ref: '#/definitions/Env' },
//         },
//     },
//     required: ['function'],
//     definitions: {
//         NodeSelector: {
//             title: 'NodeSelector',
//             description: 'NodeSelector model.',
//             type: 'object',
//             properties: {
//                 key: { title: 'Key', type: 'string' },
//                 value: { title: 'Value', type: 'string' },
//             },
//             required: ['key', 'value'],
//         },
//         Volume: {
//             title: 'Volume',
//             description: 'Volume model.',
//             type: 'object',
//             properties: {
//                 volume_type: {
//                     title: 'Volume Type',
//                     enum: ['config_map', 'secret', 'persistent_volume_claim'],
//                     type: 'string',
//                 },
//                 name: { title: 'Name', type: 'string' },
//                 mount_path: { title: 'Mount Path', type: 'string' },
//             },
//             required: ['volume_type', 'name', 'mount_path'],
//         },
//         Resource: {
//             title: 'Resource',
//             description: 'Resource model.',
//             type: 'object',
//             properties: {
//                 resource_type: {
//                     title: 'Resource Type',
//                     enum: ['cpu', 'memory', 'gpu'],
//                     type: 'string',
//                 },
//                 requests: { title: 'Requests', type: 'integer' },
//                 limits: { title: 'Limits', type: 'integer' },
//             },
//             required: ['resource_type', 'requests', 'limits'],
//         },
//         Env: {
//             title: 'Env',
//             description: 'Env variable model.',
//             type: 'object',
//             properties: {
//                 name: { title: 'Name', type: 'string' },
//                 value: { title: 'Value', type: 'string' },
//             },
//             required: ['name', 'value'],
//         },
//     },
// };
// export const TaskNefertemSchema = {
//     title: 'TaskParamsNefertem',
//     description: 'TaskParamsNefertem model.',
//     type: 'object',
//     properties: {
//         function: { title: 'Function', type: 'string' },
//         node_selector: {
//             title: 'Node Selector',
//             default: {},
//             allOf: [{ $ref: '#/definitions/NodeSelector' }],
//         },
//         volumes: {
//             title: 'Volumes',
//             default: [],
//             type: 'array',
//             items: { $ref: '#/definitions/Volume' },
//         },
//         resources: {
//             title: 'Resources',
//             default: {},
//             allOf: [{ $ref: '#/definitions/Resource' }],
//         },
//         env: {
//             title: 'Env',
//             default: [],
//             type: 'array',
//             items: { $ref: '#/definitions/Env' },
//         },
//         framework: { title: 'Framework', type: 'string' },
//         exec_args: { title: 'Exec Args', default: {}, type: 'object' },
//         parallel: { title: 'Parallel', default: false, type: 'boolean' },
//         num_worker: { title: 'Num Worker', default: 1, type: 'integer' },
//     },
//     required: ['function'],
//     definitions: {
//         NodeSelector: {
//             title: 'NodeSelector',
//             description: 'NodeSelector model.',
//             type: 'object',
//             properties: {
//                 key: { title: 'Key', type: 'string' },
//                 value: { title: 'Value', type: 'string' },
//             },
//             required: ['key', 'value'],
//         },
//         Volume: {
//             title: 'Volume',
//             description: 'Volume model.',
//             type: 'object',
//             properties: {
//                 volume_type: {
//                     title: 'Volume Type',
//                     enum: ['config_map', 'secret', 'persistent_volume_claim'],
//                     type: 'string',
//                 },
//                 name: { title: 'Name', type: 'string' },
//                 mount_path: { title: 'Mount Path', type: 'string' },
//             },
//             required: ['volume_type', 'name', 'mount_path'],
//         },
//         Resource: {
//             title: 'Resource',
//             description: 'Resource model.',
//             type: 'object',
//             properties: {
//                 resource_type: {
//                     title: 'Resource Type',
//                     enum: ['cpu', 'memory', 'gpu'],
//                     type: 'string',
//                 },
//                 requests: { title: 'Requests', type: 'integer' },
//                 limits: { title: 'Limits', type: 'integer' },
//             },
//             required: ['resource_type', 'requests', 'limits'],
//         },
//         Env: {
//             title: 'Env',
//             description: 'Env variable model.',
//             type: 'object',
//             properties: {
//                 name: { title: 'Name', type: 'string' },
//                 value: { title: 'Value', type: 'string' },
//             },
//             required: ['name', 'value'],
//         },
//     },
// };

// export const BlankSchema = {
//     $schema: 'http://json-schema.org/draft-07/schema',
//     type: 'object',
//     properties: {},
// };

// export const getSchemaTask = (kind: string | undefined) => {
//     if (!kind) {
//         return BlankSchema;
//     }
//     switch (kind) {
//         case TaskTypes.TRANSFORM:
//             return TaskDbtSchema;
//         case TaskTypes.INFER:
//             return TaskNefertemSchema;
//         case TaskTypes.METRIC:
//             return TaskNefertemSchema;
//         case TaskTypes.PROFILE:
//             return TaskNefertemSchema;
//         case TaskTypes.VALIDATE:
//             return TaskNefertemSchema;

//         default:
//             return BlankSchema;
//     }
// };

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
