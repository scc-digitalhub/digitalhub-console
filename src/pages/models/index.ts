// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ModelCreateView } from './create';
import { ModelEditView } from './edit';
import { ModelIcon } from '../../resources/models/icon';
import { ModelListView } from './list';
import { ModelShowView } from './show';

export default {
    name: 'models',
    list: ModelListView,
    icon: ModelIcon,
    show: ModelShowView,
    create: ModelCreateView,
    edit: ModelEditView,
    options: {
        type: 'model',
    },
};
