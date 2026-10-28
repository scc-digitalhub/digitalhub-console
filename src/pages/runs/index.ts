// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { RunIcon } from '../../resources/runs/icon';
import { RunListView } from './list';
import { RunShowView } from './show';

export default {
    name: 'runs',
    list: RunListView,
    icon: RunIcon,
    show: RunShowView,
    recordRepresentation: record =>
        record?.spec?.function
            ? record.spec.function.split('/')[3].split(':')[0]
            : record?.spec?.workflow
            ? record.spec.workflow.split('/')[3].split(':')[0]
            : record.id,
    options: {
        type: 'run',
    },
};
