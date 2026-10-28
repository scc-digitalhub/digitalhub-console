// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ContainerImageIcon } from '../../resources/containerimages/icon';
import { ContainerImageListView } from './list';
import { ContainerImageShowView } from './show';

export default {
    name: 'containerimages',
    list: ContainerImageListView,
    show: ContainerImageShowView,
    icon: ContainerImageIcon,
    recordRepresentation: record =>
        record?.spec?.image
            ? record.name + ':' + record.spec.image
            : record.name,
    options: {
        type: 'containerimage',
        hasVersions: false,
        hasFiles: false,
    },
};
