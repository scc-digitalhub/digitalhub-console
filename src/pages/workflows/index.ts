// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { WorkflowCreateView } from './create';
import { WorkflowEditView } from './edit';
import { WorkflowIcon } from '../../resources/workflows/icon';
import { WorkflowListView } from './list';
import { WorkflowShowView } from './show';

export default {
    name: 'workflows',
    list: WorkflowListView,
    icon: WorkflowIcon,
    show: WorkflowShowView,
    create: WorkflowCreateView,
    edit: WorkflowEditView,
    options: {
        type: 'workflow',
    },
};
