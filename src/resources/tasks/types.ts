import { mergeUiTemplate } from '../../common/schemas';
import AccordionArrayFieldTemplate from '../../jsonSchema/AccordionArrayFieldTemplate';
import { AccordionFieldTemplate } from '../../jsonSchema/AccordionFieldTemplate';
import { CoreResourceCpuWidget } from '../../jsonSchema/CoreResourceCpuWidget';
import { CoreResourceFieldTemplate } from '../../jsonSchema/CoreResourceFieldTemplate';
import { CoreResourceGpuWidget } from '../../jsonSchema/CoreResourceGpuWidget';
import { CoreResourceMemWidget } from '../../jsonSchema/CoreResourceMemWidget';
import { KeyValueFieldTemplate } from '../../jsonSchema/KeyValueFieldTemplate';
import { VolumeResourceFieldTemplate } from '../../jsonSchema/VolumeResourceFieldTemplate';

export const getTaskUiSpec = (schema: any | undefined) => {
    //filter and merge with template
    if (!schema || !('properties' in schema)) {
        return {};
    }

    const base = {
        'ui:order': ['function'],
        function: {
            'ui:readonly': true,
        },
    };

    return mergeUiTemplate(schema, base, k8sSpec);
};

export const k8sSpec = {
    'ui:order': [
        'profile',
        'service_type',
        'service_ports',
        'resources',
        'envs',
        'secrets',
        'volumes',
        'node_selector',
        'tolerations',
        'affinity',
    ],
    profile: {},
    affinity: {
        'ui:widget': 'hidden',
        'ui:disabled': true,
    },
    tolerations: {
        'ui:widget': 'hidden',
    },
    resources: {
        // 'ui:ObjectFieldTemplate': AccordionFieldTemplate,
        'ui:expandable': true,
        'ui:title': 'k8s.resources.title',
        'ui:description': 'k8s.resources.description',
        'ui:order': ['cpu', 'mem', 'gpu'],
        'ui:layout': [5, 5, 2],
        cpu: {
            'ui:ObjectFieldTemplate': CoreResourceFieldTemplate,
            'ui:title': 'k8s.resources.cpu.title',
            'ui:order': ['requests', 'limits'],

            limits: {
                'ui:widget': CoreResourceCpuWidget,
                'ui:title': 'k8s.resources.cpu.limits.title',
                'ui:options': {
                    'ui:title': 'Limits',
                },
            },
            requests: {
                'ui:widget': CoreResourceCpuWidget,
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
                'ui:widget': CoreResourceMemWidget,
                'ui:title': 'k8s.resources.memory.limits.title',
                'ui:options': {
                    'ui:title': 'Limits',
                },
            },
            requests: {
                'ui:widget': CoreResourceMemWidget,
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

            requests: {
                'ui:widget': 'hidden',
                'ui:title': 'k8s.resources.gpu.limits.title',
            },
            limits: {
                'ui:widget': CoreResourceGpuWidget,
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
        'ui:orderable': false,
        // 'ui:ArrayFieldTemplate': AccordionArrayFieldTemplate,
        'ui:expandable': true,
        items: {
            'ui:title': '',
            // 'ui:ObjectFieldTemplate': KeyValueFieldTemplate,
            'ui:layout': [6, 6],
            'ui:label': false,
        },
    },
    secrets: {
        'ui:title': 'k8s.secrets.title',
        'ui:description': 'k8s.secrets.description',
        // 'ui:ArrayFieldTemplate': AccordionArrayFieldTemplate,
        'ui:expandable': true,
        items: {
            'ui:title': '',
        },
    },
    node_selector: {
        'ui:title': 'k8s.node_selector.title',
        'ui:description': 'k8s.node_selector.description',

        // 'ui:ArrayFieldTemplate': AccordionArrayFieldTemplate,
        'ui:expandable': true,
        items: {
            'ui:title': '',
            // 'ui:ObjectFieldTemplate': KeyValueFieldTemplate,
            'ui:layout': [6, 6],
            'ui:label': false,
        },
    },
    volumes: {
        'ui:title': 'k8s.volumes.title',
        'ui:description': 'k8s.volumes.description',
        // 'ui:ArrayFieldTemplate': AccordionArrayFieldTemplate,
        'ui:expandable': true,
        items: {
            'ui:title': '',
            // 'ui:ObjectFieldTemplate': VolumeResourceFieldTemplate,
            // 'ui:order': ['mount_path', 'name', 'volume_type', 'spec'],
            'ui:order': ['name', 'volume_type', 'mount_path', 'spec'],
            'ui:layout': [5, 2, 5, 12],
            'ui:label': false,
            spec: {
                // 'ui:description': '',
                additionalProperties: {
                    'ui:label': false,
                },
            },
        },
    },
    service_type: {},
    service_ports: {
        'ui:orderable': false,
        'ui:expandable': true,
        items: {
            'ui:title': '',
            'ui:layout': [3, 3],
            'ui:label': false,
        },
    },
};
