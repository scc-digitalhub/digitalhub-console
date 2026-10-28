// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { TriggerIcon } from '../../resources/triggers/icon';
import { TriggerListView } from './list';
import { TriggerShowView } from './show';

export default {
    name: 'triggers',
    list: TriggerListView,
    icon: TriggerIcon,
    show: TriggerShowView,
    recordRepresentation: record => record?.kind || record.id,
    options: {
        type: 'trigger',
    },
};
