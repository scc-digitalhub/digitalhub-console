// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ArtifactCreate } from './create';
import { ArtifactEdit } from './edit';
import { ArtifactIcon } from './icon';
import { ArtifactList } from './list';
import { ArtifactShow } from './show';

export default {
    name: 'artifacts',
    list: ArtifactList,
    icon: ArtifactIcon,
    show: ArtifactShow,
    create: ArtifactCreate,
    edit: ArtifactEdit,
    options: {
        type: 'artifact',
    },
};
