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

const parametersTemplate = {
    additionalProperties: {
        //TODO change to oneOf when core is fixed
        anyOf: [
            {},
            {},
            { 'ui:label': false },
            {
                'ui:field': 'AceField',
                'ui:label': false,
            },
            { 'ui:label': false },
        ],
    },
};

const template = {
    'ui:order': ['init_parameters', 'inputs', 'parameters'],
    inputs: {},
    parameters: parametersTemplate,
    init_parameters: parametersTemplate,
};
