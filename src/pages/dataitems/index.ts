// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Hub } from '@mui/icons-material';
import { DataItemCreate } from './create';
import { DataItemEdit } from './edit';
import { DataItemIcon } from './icon';
import { DataItemList } from './list';
import { DataItemShow } from './show';
import { getDataItemSpecUiSchema } from './types';

export default {
    name: 'dataitems',
    list: DataItemList,
    icon: DataItemIcon,
    show: DataItemShow,
    create: DataItemCreate,
    edit: DataItemEdit,
    options: {
        type: 'dataitem',
        hub: false,
        catalogKey: 'dataitems',
        getSpecUiSchema: getDataItemSpecUiSchema,
    },
};
