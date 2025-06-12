// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

export enum ModelTypes {
    MODEL = 'Model',
}

export const getModelSpecUiSchema = (kind: string | undefined) => {
    if (!kind) {
        return {};
    }

    return {};
};
