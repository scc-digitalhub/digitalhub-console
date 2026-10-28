// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { FunctionCreateView } from './create';
import { FunctionEditView } from './edit';
import { FunctionIcon } from '../../resources/functions/icon';
import { FunctionListView } from './list';
import { FunctionShowView } from './show';

export default {
    name: 'functions',
    list: FunctionListView,
    icon: FunctionIcon,
    show: FunctionShowView,
    create: FunctionCreateView,
    edit: FunctionEditView,
    options: {
        type: 'function',
    },
};
