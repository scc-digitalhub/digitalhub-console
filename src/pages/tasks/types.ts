// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { CoreResourceCpuWidget } from '../../common/jsonSchema/components/widgets/CoreResourceCpuWidget';
import { CoreResourceGpuWidget } from '../../common/jsonSchema/components/widgets/CoreResourceGpuWidget';
import { CoreResourceMemWidget } from '../../common/jsonSchema/components/widgets/CoreResourceMemWidget';
import { mergeUiTemplate } from '../../common/jsonSchema/schemas';


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
        workflow: {
            'ui:readonly': true,
        },
    };

    return mergeUiTemplate(schema, base, k8sSpec);
};

export const k8sSpec = {
    'ui:order': [
        'profile',
        'template',
        'service_name',
        'service_type',
        'service_ports',
        'resources',
        'envs',
        'secrets',
        'volumes',
        'node_selector',
        'priority_class',
        'runtime_class',
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
        'ui:expandable': true,
        'ui:title': 'fields.k8s.resources.title',
        'ui:description': 'fields.k8s.resources.description',
        'ui:order': ['cpu', 'mem', 'gpu'],
        'ui:layout': [4, 6, 2],
        cpu: {
            'ui:widget': CoreResourceCpuWidget,
            'ui:title': 'fields.k8s.resources.cpu.title',
            'ui:options': {
                'ui:title': 'fields.k8s.resources.cpu.title',
            },
        },
        mem: {
            'ui:widget': CoreResourceMemWidget,
            'ui:title': 'fields.k8s.resources.memory.title',
            'ui:options': {
                'ui:title': 'fields.k8s.resources.memory.title',
            },
        },
        gpu: {
            'ui:title': 'fields.k8s.resources.gpu.title',
            'ui:widget': CoreResourceGpuWidget,
            'ui:options': {
                'ui:title': 'fields.k8s.resources.gpu.title',
            },
        },
    },

    envs: {
        'ui:title': 'fields.k8s.envs.title',
        'ui:description': 'fields.k8s.envs.description',
        'ui:orderable': false,
        'ui:expandable': true,
        items: {
            'ui:title': '',
            'ui:layout': [6, 6],
            'ui:label': false,
        },
    },
    secrets: {
        'ui:title': 'fields.k8s.secrets.title',
        'ui:description': 'fields.k8s.secrets.description',
        'ui:expandable': true,
        items: {
            'ui:title': '',
        },
    },
    node_selector: {
        'ui:title': 'fields.k8s.node_selector.title',
        'ui:description': 'fields.k8s.node_selector.description',

        'ui:expandable': true,
        items: {
            'ui:title': '',
            'ui:layout': [6, 6],
            'ui:label': false,
        },
    },
    volumes: {
        'ui:title': 'fields.k8s.volumes.title',
        'ui:description': 'fields.k8s.volumes.description',
        'ui:expandable': true,
        items: {
            'ui:title': '',
            'ui:order': ['name', 'volume_type', 'mount_path', 'spec'],
            'ui:layout': [5, 2, 5, 12],
            'ui:label': false,
            spec: {
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
    service_name: {},
    priority_class: {},
    runtime_class: {},
};
