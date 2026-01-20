// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    mergeUiTemplate,
    Serializable,
} from '../../common/jsonSchema/schemas';

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

    return mergeUiTemplate(schema, base, template);
};

const template = {
    'ui:order': ['init_parameters', 'inputs', 'parameters', 'node_config'],
    inputs: {},
    parameters: Serializable,
    init_parameters: Serializable,
    node_config: Serializable,
};
