// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { mergeUiTemplate } from '../../common/jsonSchema/schemas';

export const getTriggerUiSpec = (schema: any | undefined, taskSchema: any) => {
    //filter and merge with template
    if (!schema || !('properties' in schema)) {
        return {};
    }

    const base = {
        'ui:order': ['task', 'function', 'workflow', 'template'],
        task: {
            'ui:readonly': true,
        },
        function: taskSchema.properties.function
            ? { 'ui:readonly': true }
            : { 'ui:widget': 'hidden' },
        workflow: taskSchema.properties.workflow
            ? { 'ui:readonly': true }
            : { 'ui:widget': 'hidden' },
        template: {
            'ui:widget': 'hidden',
        },
    };

    return mergeUiTemplate(schema, base, {});
};
