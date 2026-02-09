// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ModelCreate } from './create';
import { ModelEdit } from './edit';
import { ModelIcon } from './icon';
import { ModelList } from './list';
import { ModelShow } from './show';
import { getModelSpecUiSchema } from './types';

export default {
    name: 'models',
    list: ModelList,
    icon: ModelIcon,
    show: ModelShow,
    create: ModelCreate,
    edit: ModelEdit,
    options: {
        type: 'model',
        getSpecUiSchema: getModelSpecUiSchema,
    },
};
