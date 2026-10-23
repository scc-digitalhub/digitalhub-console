// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ModelCreatePage } from './create/CreateView';
import { ModelEdit } from './edit/ModelEdit';
import { ModelIcon } from './icon';
import { ModelList } from './list/ModelList';
import { ModelShow } from './show/ModelShow';

export default {
    name: 'models',
    list: ModelList,
    icon: ModelIcon,
    show: ModelShow,
    create: ModelCreatePage,
    edit: ModelEdit,
    options: {
        type: 'model',
        hasVersions: true,
        hasFiles: true,
    },
};
