// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

export enum ArtifactTypes {
    ARTIFACT = 'artifact',
}

export const getArtifactSpecUiSchema = (kind: string | undefined) => {
    if (!kind) {
        return undefined;
    }
    return undefined;
};
