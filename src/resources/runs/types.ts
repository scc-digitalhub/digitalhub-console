// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { mergeUiTemplate } from '../../common/schemas';

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
    'ui:order': ['inputs', 'parameters'],
    inputs: {},
    parameters: {},
};
