// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ArtifactCreateView } from './create';
import { ArtifactEditView } from './edit';
import { ArtifactIcon } from '../../resources/artifacts/icon';
import { ArtifactListView } from './list';
import { ArtifactShowView } from './show';

export default {
    name: 'artifacts',
    list: ArtifactListView,
    icon: ArtifactIcon,
    show: ArtifactShowView,
    create: ArtifactCreateView,
    edit: ArtifactEditView,
    options: {
        type: 'artifact',
    },
};
