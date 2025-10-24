// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { WorkflowCreate } from "./create";
import { WorkflowEdit } from "./edit";
import { WorkflowIcon } from "./icon";
import { WorkflowList } from "./list";
import { WorkflowShow } from "./show";

export default {
    name: 'workflows',
    list: WorkflowList,
    icon: WorkflowIcon,
    show: WorkflowShow,
    create: WorkflowCreate,
    edit: WorkflowEdit,
    options: {
        type: 'workflow',
    },
};
