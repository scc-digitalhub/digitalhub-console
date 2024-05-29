// import { MetadataTemplate } from '../components/MetadataTemplate';
import AccordionArrayFieldTemplate from '../components/resourceInput/AccordionArrayFieldTemplate';
import { AccordionFieldTemplate } from '../components/resourceInput/AccordionFieldTemplate';
import { CoreResourceFieldTemplate } from '../components/resourceInput/CoreResourceFieldTemplate';
import { K8FieldTemplate } from '../components/resourceInput/K8FieldTemplate';
import { KeyValueFieldTemplate } from '../components/resourceInput/KeyValueFieldTemplate';
import { VolumeResourceFieldTemplate } from '../components/resourceInput/VolumeResourceFieldTemplate';

export const MetadataSchema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
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
    // 'ui:ObjectFieldTemplate': MetadataTemplate,
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
    // 'ui:ObjectFieldTemplate': MetadataTemplate,
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
        if (metadata)
        if (!(f in metadata)) {
            schema[f]['ui:widget'] = 'hidden';
        }
    }

    return schema;
};

export const BlankSchema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    properties: {},
};

export const k8sSpec = {
    // 'ui:ObjectFieldTemplate': K8FieldTemplate,
    affinity: {
        'ui:widget': 'hidden',
    },
    tolerations: {
        'ui:widget': 'hidden',
    },
    resources: {
        'ui:ObjectFieldTemplate': AccordionFieldTemplate,
        'ui:title': 'k8s.resources.title',
        'ui:description': 'k8s.resources.description',
        'ui:order': ['cpu', 'mem', 'gpu'],

        cpu: {
            'ui:ObjectFieldTemplate': CoreResourceFieldTemplate,
            'ui:title': 'k8s.resources.cpu.title',
            'ui:order': ['requests', 'limits'],

            limits: {
                'ui:widget': 'coreResourceCpuWidget',
                'ui:title': 'k8s.resources.cpu.limits.title',
                'ui:options': {
                    'ui:title': 'Limits',
                },
            },
            requests: {
                'ui:widget': 'coreResourceCpuWidget',
                'ui:title': 'k8s.resources.cpu.request.title',
                'ui:options': {
                    'ui:title': 'Request',
                },
            },
        },
        mem: {
            'ui:ObjectFieldTemplate': CoreResourceFieldTemplate,
            'ui:title': 'k8s.resources.memory.title',
            'ui:order': ['requests', 'limits'],
            limits: {
                'ui:widget': 'coreResourceMemWidget',
                'ui:title': 'k8s.resources.memory.limits.title',
                'ui:options': {
                    'ui:title': 'Limits',
                },
            },
            requests: {
                'ui:widget': 'coreResourceMemWidget',
                'ui:title': 'k8s.resources.memory.request.title',
                'ui:options': {
                    'ui:title': 'Request',
                },
            },
        },
        gpu: {
            'ui:ObjectFieldTemplate': CoreResourceFieldTemplate,
            'ui:title': 'k8s.resources.gpu.title',
            'ui:order': ['requests', 'limits'],

            limits: {
                'ui:widget': 'hidden',
                'ui:title': 'k8s.resources.gpu.limits.title',

            },
            requests: {
                'ui:widget': 'coreResourceGpuWidget',
                'ui:title': 'k8s.resources.gpu.request.title',
                'ui:options': {
                    'ui:title': 'Request',
                },
            },
        },
    },

    envs: {
        'ui:title': 'k8s.envs.title',
        'ui:description': 'k8s.envs.description',

        'ui:ArrayFieldTemplate': AccordionArrayFieldTemplate,
        items: {
            'ui:title': '',
            'ui:ObjectFieldTemplate': KeyValueFieldTemplate,
        },
    },
    secrets: {
        'ui:title': 'k8s.secrets.title',
        'ui:description': 'k8s.secrets.description',
        'ui:ArrayFieldTemplate': AccordionArrayFieldTemplate,
        items: {
            'ui:title': '',
        },
    },
    node_selector: {
        'ui:title': 'k8s.node_selector.title',
        'ui:description': 'k8s.node_selector.description',

        'ui:ArrayFieldTemplate': AccordionArrayFieldTemplate,
        items: {
            'ui:title': '',
            'ui:ObjectFieldTemplate': KeyValueFieldTemplate,
        },
    },
    volumes: {
        'ui:title': 'k8s.volumes.title',
        'ui:description': 'k8s.volumes.description',
        'ui:ArrayFieldTemplate': AccordionArrayFieldTemplate,
        items: {
            'ui:title': '',
            'ui:ObjectFieldTemplate': VolumeResourceFieldTemplate,
            'ui:order': ['mount_path', 'name', 'volume_type', 'spec'],
        },
    },

    // backoff_limit: {
    //     'ui:widget': 'hidden',
    // },
    // schedule: {
    //     'ui:widget': 'hidden',
    // },
    // replicas: {
    //     'ui:widget': 'hidden',
    // },
};
