// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { DataItemCreateView } from './create';
import { DataItemEditView } from './edit';
import { DataItemIcon } from '../../resources/dataitems/icon';
import { DataItemListView } from './list';
import { DataItemShowView } from './show';

export default {
    name: 'dataitems',
    list: DataItemListView,
    icon: DataItemIcon,
    show: DataItemShowView,
    create: DataItemCreateView,
    edit: DataItemEditView,
    options: {
        type: 'dataitem',
    },
};
