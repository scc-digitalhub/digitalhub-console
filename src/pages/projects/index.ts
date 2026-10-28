// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ProjectIcon } from '../../resources/projects/icon';
import { ProjectEditView } from './edit';

export default {
    name: 'projects',
    edit: ProjectEditView,
    icon: ProjectIcon,
    options: {
        type: 'project',
    },
};
