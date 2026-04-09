// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

export const getSpecSchema = (schemas: any[], kind: string | undefined) => {
    return schemas ? schemas.find(s => s.kind === kind)?.schema : {};
};

export const getUiSchema = (schemas: any[], kind: string | undefined) => {
    return schemas ? schemas.find(s => s.kind === kind)?.uiSchema : {};
};
