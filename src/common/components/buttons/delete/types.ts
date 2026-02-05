// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from "react";

export type DeleteButtonOptions = {
    deleteAll?: boolean;
    cascade?: boolean;
    askForDeleteAll?: boolean;
    askForCascade?: boolean;
    disableDeleteAll?: boolean;
    disableCascade?: boolean;
    onDeleteAll?: (value: boolean) => void;
    onCascade?: (value: boolean) => void;
    additionalContent?: ReactNode;
};
