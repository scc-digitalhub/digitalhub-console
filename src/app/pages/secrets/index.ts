// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { SecretCreate } from "./create";
import { SecretEdit } from "./edit";
import { SecretIcon } from "./icon";
import { SecretList } from "./list";
import { SecretShow } from "./show";

export default {
    name: 'secrets',
    list: SecretList,
    icon: SecretIcon,
    show: SecretShow,
    create: SecretCreate,
    edit: SecretEdit,
    options: {
        type: 'secret',
    },
};
