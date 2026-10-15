// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { transformExtensionPaths } from '../../../features/extensions/utils';

export const transformArtifactData = (
    data: any,
    root: string | undefined,
    hasUploads: boolean
) => {
    const { path, ...rest } = data;

    return {
        ...rest,
        ...transformExtensionPaths(rest),
        project: root,
        spec: { ...rest.spec, ...(path != null ? { path } : {}) },
        ...(!hasUploads ? { status: { ...rest.status, state: 'READY' } } : {}),
    };
};
