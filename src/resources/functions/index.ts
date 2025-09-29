// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { FunctionCreate } from "./create";
import { FunctionEdit } from "./edit";
import { FunctionIcon } from "./icon";
import { FunctionList } from "./list";
import { FunctionShow } from "./show";

export default {
    name: 'functions',
    list: FunctionList,
    icon: FunctionIcon,
    show: FunctionShow,
    create: FunctionCreate,
    edit: FunctionEdit,
    options: {
        type: 'FUNCTION',
    },
};
