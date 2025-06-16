// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

export const convertToDate = value => {
    if (typeof value === 'string' || typeof value === 'number') {
        return new Date(value);
    }
    return value;
};
