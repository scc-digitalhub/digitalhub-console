// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ProjectCreate } from "./create";
import { ProjectEdit } from "./edit";
import { ProjectSelectorList } from "./list";

export default {
    name: 'projects',
    list: ProjectSelectorList,
    create: ProjectCreate,
    edit: ProjectEdit,
    options: {
        type: 'PROJECT',
    },
};
