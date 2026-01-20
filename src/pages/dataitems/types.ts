// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Serializable } from '../../common/jsonSchema/schemas';
import { JsonParamsWidget } from '../../common/jsonSchema/components/widgets/JsonParamsWidget';

export const getDataItemSpecUiSchema = (
    kind: string | undefined,
    readonly?: boolean
) => {
    if (!kind) {
        return undefined;
    }
    if (kind == 'table') {
        return getTableUiSchema(readonly);
    }

    return undefined;
};

const getTableUiSchema = (readonly?: boolean) => {
    return {
        schema: {
            fields: {
                items: {
                    constraints: readonly
                        ? {
                              'ui:ObjectFieldTemplate': JsonParamsWidget,
                              'ui:title': 'fields.parameters.title',
                          }
                        : Serializable,
                },
            },
        },
    };
};
