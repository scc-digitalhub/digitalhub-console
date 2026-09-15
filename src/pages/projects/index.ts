// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ProjectCreate } from './create';
import { ProjectEdit } from './edit';
import { ProjectList } from './list/ProjectList';

export default {
    name: 'projects',
    list: ProjectList,
    create: ProjectCreate,
    edit: ProjectEdit,
    options: {
        type: 'project',
        hub: true,
    },
};
