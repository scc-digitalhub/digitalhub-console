// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { FolderCreate } from './create';
import { FolderIcon } from './icon';
import { FolderList } from './list';

export default {
    name: 'folders',
    list: FolderList,
    icon: FolderIcon,
    create: FolderCreate,
    options: {
        type: 'folder',
    },
};
