// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { CoreResourceCpuWidget } from '../../common/jsonSchema/components/widgets/CoreResourceCpuWidget';
import { CoreResourceGpuWidget } from '../../common/jsonSchema/components/widgets/CoreResourceGpuWidget';
import {
    CoreResourceDiskWidget,
    CoreResourceMemWidget,
} from '../../common/jsonSchema/components/widgets/CoreResourceMemWidget';
import { mergeUiTemplate } from '../../common/jsonSchema/utils';

export const getTaskUiSpec = (schema: any | undefined, uiSchema: any = {}) => {
    //filter and merge with template
    if (!schema || !('properties' in schema)) {
        return {};
    }

    return mergeUiTemplate(schema, template, uiSchema);
};

export const template = {
    'ui:order': [
        'function',
        'profile',
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
    function: {
        'ui:readonly': true,
    },
    workflow: {
        'ui:readonly': true,
    },
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
        'ui:order': ['cpu', 'mem', 'gpu', 'disk'],
        'ui:layout': [3, 3, 3, 3],
        cpu: {
            'ui:widget': CoreResourceCpuWidget,
            'ui:description': '_blank'
        },
        mem: {
            'ui:widget': CoreResourceMemWidget,
            'ui:description': '_blank'
        },
        gpu: {
            'ui:widget': CoreResourceGpuWidget,
            'ui:description': '_blank'
        },
        disk: {
            'ui:widget': CoreResourceDiskWidget,
            'ui:description': '_blank'
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
