// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Serializable } from '../../features/jsonSchema/schemas';
import { JsonParamsWidget } from '../../features/jsonSchema/components/widgets/JsonParamsWidget';

export enum ModelTypes {
    MODEL = 'Model',
}

export const getModelSpecUiSchema = (
    kind: string | undefined,
    readonly?: boolean
) => {
    if (!kind) {
        return {};
    }

    let uiSchema = {
        parameters: readonly
            ? {
                  'ui:ObjectFieldTemplate': JsonParamsWidget,
                  'ui:title': 'fields.parameters.title',
              }
            : Serializable,
    };

    if (readonly) {
        uiSchema['metrics'] = {
            'ui:widget': 'hidden',
        };
    }

    return uiSchema;
};
