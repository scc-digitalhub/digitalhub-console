import { CoreResourceFieldWidget } from "../../components/resourceInput/CoreResourceFieldWidget";
import { KeyValueFieldWidget } from "../../components/resourceInput/KeyValueFieldWidget";
import { VolumeResourceFieldWidget } from "../../components/resourceInput/VolumeResourceFieldWidget";

export enum TaskTypes {
    PROFILE = 'profile',
    VALIDATE = 'validate',
    INFER = 'infer',
    METRIC = 'metric',
    TRANSFORM = 'transform',
    PIPELINE = 'pipeline',
    MLRUN = 'mlrun'
}
export const TaskDbtSchema = {
    title: 'TaskParams',
    description: 'Base task model.',
    type: 'object',
    properties: {
        function: { title: 'Function', type: 'string' },
        node_selector: {
            title: 'Node Selector',
            default: {},
            allOf: [{ $ref: '#/definitions/NodeSelector' }],
        },
        volumes: {
            title: 'Volumes',
            default: [],
            type: 'array',
            items: { $ref: '#/definitions/Volume' },
        },
        resources: {
            title: 'Resources',
            default: {},
            allOf: [{ $ref: '#/definitions/Resource' }],
        },
        env: {
            title: 'Env',
            default: [],
            type: 'array',
            items: { $ref: '#/definitions/Env' },
        },
    },
    required: ['function'],
    definitions: {
        NodeSelector: {
            title: 'NodeSelector',
            description: 'NodeSelector model.',
            type: 'object',
            properties: {
                key: { title: 'Key', type: 'string' },
                value: { title: 'Value', type: 'string' },
            },
            required: ['key', 'value'],
        },
        Volume: {
            title: 'Volume',
            description: 'Volume model.',
            type: 'object',
            properties: {
                volume_type: {
                    title: 'Volume Type',
                    enum: ['config_map', 'secret', 'persistent_volume_claim'],
                    type: 'string',
                },
                name: { title: 'Name', type: 'string' },
                mount_path: { title: 'Mount Path', type: 'string' },
            },
            required: ['volume_type', 'name', 'mount_path'],
        },
        Resource: {
            title: 'Resource',
            description: 'Resource model.',
            type: 'object',
            properties: {
                resource_type: {
                    title: 'Resource Type',
                    enum: ['cpu', 'memory', 'gpu'],
                    type: 'string',
                },
                requests: { title: 'Requests', type: 'integer' },
                limits: { title: 'Limits', type: 'integer' },
            },
            required: ['resource_type', 'requests', 'limits'],
        },
        Env: {
            title: 'Env',
            description: 'Env variable model.',
            type: 'object',
            properties: {
                name: { title: 'Name', type: 'string' },
                value: { title: 'Value', type: 'string' },
            },
            required: ['name', 'value'],
        },
    },
};
export const TaskNefertemSchema = {
    title: 'TaskParamsNefertem',
    description: 'TaskParamsNefertem model.',
    type: 'object',
    properties: {
        function: { title: 'Function', type: 'string' },
        node_selector: {
            title: 'Node Selector',
            default: {},
            allOf: [{ $ref: '#/definitions/NodeSelector' }],
        },
        volumes: {
            title: 'Volumes',
            default: [],
            type: 'array',
            items: { $ref: '#/definitions/Volume' },
        },
        resources: {
            title: 'Resources',
            default: {},
            allOf: [{ $ref: '#/definitions/Resource' }],
        },
        env: {
            title: 'Env',
            default: [],
            type: 'array',
            items: { $ref: '#/definitions/Env' },
        },
        framework: { title: 'Framework', type: 'string' },
        exec_args: { title: 'Exec Args', default: {}, type: 'object' },
        parallel: { title: 'Parallel', default: false, type: 'boolean' },
        num_worker: { title: 'Num Worker', default: 1, type: 'integer' },
    },
    required: ['function'],
    definitions: {
        NodeSelector: {
            title: 'NodeSelector',
            description: 'NodeSelector model.',
            type: 'object',
            properties: {
                key: { title: 'Key', type: 'string' },
                value: { title: 'Value', type: 'string' },
            },
            required: ['key', 'value'],
        },
        Volume: {
            title: 'Volume',
            description: 'Volume model.',
            type: 'object',
            properties: {
                volume_type: {
                    title: 'Volume Type',
                    enum: ['config_map', 'secret', 'persistent_volume_claim'],
                    type: 'string',
                },
                name: { title: 'Name', type: 'string' },
                mount_path: { title: 'Mount Path', type: 'string' },
            },
            required: ['volume_type', 'name', 'mount_path'],
        },
        Resource: {
            title: 'Resource',
            description: 'Resource model.',
            type: 'object',
            properties: {
                resource_type: {
                    title: 'Resource Type',
                    enum: ['cpu', 'memory', 'gpu'],
                    type: 'string',
                },
                requests: { title: 'Requests', type: 'integer' },
                limits: { title: 'Limits', type: 'integer' },
            },
            required: ['resource_type', 'requests', 'limits'],
        },
        Env: {
            title: 'Env',
            description: 'Env variable model.',
            type: 'object',
            properties: {
                name: { title: 'Name', type: 'string' },
                value: { title: 'Value', type: 'string' },
            },
            required: ['name', 'value'],
        },
    },
};

export const BlankSchema = {
    $schema: 'http://json-schema.org/draft-07/schema',
    type: 'object',
    properties: {},
};

export const getSchemaTask = (kind: string | undefined) => {
    if (!kind) {
        return BlankSchema;
    }
    switch (kind) {
        case TaskTypes.TRANSFORM:
            return TaskDbtSchema;
        case TaskTypes.INFER:
            return TaskNefertemSchema;
        case TaskTypes.METRIC:
            return TaskNefertemSchema;
        case TaskTypes.PROFILE:
            return TaskNefertemSchema;
        case TaskTypes.VALIDATE:
            return TaskNefertemSchema;

        default:
            return BlankSchema;
    }
};
export const taskSpecUiSchema = {
    task: {
        'ui:readonly': true,
    },
    function_spec: {
        source: {
            'ui:widget': 'hidden',
        },
    },
        k8s: {
            affinity: {
                'ui:widget': 'hidden',
            },
            tolerations:{
                'ui:widget': 'hidden',
            },
            resources: {
                cpu: {
                    'ui:ObjectFieldTemplate':CoreResourceFieldWidget,
                    'ui:title': 'Cpu',
                    'ui:order': [ 'requests','limits'],

                    limits: {
                        'ui:widget': 'coreResourceCpuWidget',
                        'ui:options': {
                            'ui:title': 'Limits',
                        },
                    },
                    requests: {
                        'ui:widget': 'coreResourceCpuWidget',
                        'ui:options': {
                            'ui:title': 'Request',
                        },
                    },
                },
                gpu: {
                    'ui:ObjectFieldTemplate':CoreResourceFieldWidget,
                    'ui:title': 'Gpu',
                    'ui:order': [ 'requests','limits'],

                    limits: {
                        'ui:widget': 'hidden',
                    },
                    requests: {
                        'ui:widget': 'coreResourceGpuWidget',
                        'ui:options': {
                            'ui:title': 'Request',
                        },
                    },
                },
                mem: {
                    'ui:ObjectFieldTemplate':CoreResourceFieldWidget,
                    'ui:title': 'Memory',
                    'ui:order': [ 'requests','limits'],
                    limits: {
                        'ui:widget': 'coreResourceMemWidget',
                        'ui:options': {
                            'ui:title': 'Limits',
                        },
                    },
                    requests: {
                        'ui:widget': 'coreResourceMemWidget',
                        'ui:options': {
                            'ui:title': 'Request',
                        },
                    },
                },
            },

            envs: {
                items: {
                    'ui:title':'',
                    'ui:ObjectFieldTemplate':KeyValueFieldWidget,
                },
            },
            node_selector: {
                items: {
                    'ui:title':'',
                    'ui:ObjectFieldTemplate':KeyValueFieldWidget,
                },
            },
            labels: {
                'ui:widget': 'hidden',
                items: {
                    'ui:title':'',
                    'ui:ObjectFieldTemplate':KeyValueFieldWidget,
                },
            },
            volumes:{
                items: {
                    'ui:title':'',
                    'ui:ObjectFieldTemplate':VolumeResourceFieldWidget,
                    'ui:order': [ 'mount_path','name','volume_type','spec'],

                }
            },
        },
};
