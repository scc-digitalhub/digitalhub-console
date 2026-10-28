// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Serializable } from '../../common/jsonSchema/schemas';
import { mergeUiTemplate } from '../../common/jsonSchema/utils';

export const getRunUiSpec = (schema: any | undefined, uiSchema: any = {}) => {
    //filter and merge with template
    if (!schema || !('properties' in schema)) {
        return uiSchema;
    }

    return mergeUiTemplate(schema, template, uiSchema);
};

const template = {
    'ui:order': [
        'task',
        'local_execution',
        'init_parameters',
        'inputs',
        'parameters',
        'node_config',
    ],
    inputs: {},
    task: {
        'ui:readonly': true,
    },
    local_execution: {
        'ui:widget': 'hidden',
    },
    parameters: Serializable,
    init_parameters: Serializable,
    node_config: Serializable,
};
