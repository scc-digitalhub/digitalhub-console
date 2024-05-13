import { MetadataTemplate } from '../components/MetadataTemplate';
import { CoreResourceFieldTemplate } from '../components/resourceInput/CoreResourceFieldTemplate';
import { K8FieldTemplate } from '../components/resourceInput/K8FieldTemplate';
import { KeyValueFieldTemplate } from '../components/resourceInput/KeyValueFieldTemplate';
import { VolumeResourceFieldTemplate } from '../components/resourceInput/VolumeResourceFieldTemplate';

export const MetadataSchema = {
    $schema: 'http://json-schema.org/draft-07/schema',
    type: 'object',
    title: 'Metadata',
    required: [],
    properties: {
        name: {
            type: 'string',
        },
        description: {
            type: 'string',
        },
        project: {
            type: 'string',
        },
        version: {
            type: 'string',
        },
        created: {
            type: 'string',
            format: 'date-time',
        },
        updated: {
            type: 'string',
            format: 'date-time',
        },
        labels: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
    },
};

export const MetadataCreateUiSchema = {
    'ui:ObjectFieldTemplate': MetadataTemplate,
    project: {
        'ui:widget': 'hidden',
    },
    created: {
        'ui:widget': 'hidden',
    },
    description: {
        'ui:widget': 'textarea',
    },
    labels: {
        'ui:widget': 'tagsChipInput',
    },
};

export const MetadataEditUiSchema = {
    'ui:ObjectFieldTemplate': MetadataTemplate,
    project: {
        'ui:widget': 'hidden',
    },
    created: {
        'ui:widget': 'hidden',
    },
    description: {
        'ui:widget': 'textarea',
    },
    labels: {
        'ui:widget': 'tagsChipInput',
    },
};

export const MetadataViewUiSchema = {
    project: {
        'ui:widget': 'hidden',
    },
    name: {
        'ui:widget': 'hidden',
    },
    description: {
        'ui:widget': 'text',
    },
    labels: {
        'ui:widget': 'tagsChipInput',
    },
};

export const createMetadataViewUiSchema = (metadata: any) => {
    const schema = Object.assign({}, MetadataViewUiSchema);
    for (const f in schema) {
        //replace missing values with hidden field
        if (!(f in metadata)) {
            schema[f]['ui:widget'] = 'hidden';
        }
    }

    return schema;
};

export const BlankSchema = {
    $schema: 'http://json-schema.org/draft-07/schema',
    type: 'object',
    properties: {},
};

export const k8sSpec = {
    'ui:ObjectFieldTemplate': K8FieldTemplate,
    affinity: {
        'ui:widget': 'hidden',
    },
    tolerations: {
        'ui:widget': 'hidden',
    },
    resources: {
        'ui:order': ['cpu', 'mem', 'gpu'],

        cpu: {
            'ui:ObjectFieldTemplate': CoreResourceFieldTemplate,
            'ui:title': 'Cpu',
            'ui:order': ['requests', 'limits'],

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
        mem: {
            'ui:ObjectFieldTemplate': CoreResourceFieldTemplate,
            'ui:title': 'Memory',
            'ui:order': ['requests', 'limits'],
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
        gpu: {
            'ui:ObjectFieldTemplate': CoreResourceFieldTemplate,
            'ui:title': 'Gpu',
            'ui:order': ['requests', 'limits'],

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
    },

    envs: {
        items: {
            'ui:title': '',
            'ui:ObjectFieldTemplate': KeyValueFieldTemplate,
        },
    },
    secrets: {
        items: {
            'ui:title': '',
        },
    },
    node_selector: {
        items: {
            'ui:title': '',
            'ui:ObjectFieldTemplate': KeyValueFieldTemplate,
        },
    },
    labels: {
        'ui:widget': 'hidden',
        items: {
            'ui:title': '',
            'ui:ObjectFieldTemplate': KeyValueFieldTemplate,
        },
    },
    volumes: {
        items: {
            'ui:title': '',
            'ui:ObjectFieldTemplate': VolumeResourceFieldTemplate,
            'ui:order': ['mount_path', 'name', 'volume_type', 'spec'],
        },
    },

    backoff_limit: {
        'ui:widget': 'hidden',
    },
    schedule: {
        'ui:widget': 'hidden',
    },
    replicas: {
        'ui:widget': 'hidden',
    },
};
