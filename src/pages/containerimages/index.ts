// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ContainerImageIcon } from './icon';
import { ContainerImageList } from './list';
import { ContainerImageShow } from './show';

export default {
    name: 'containerimages',
    list: ContainerImageList,
    show: ContainerImageShow,
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
