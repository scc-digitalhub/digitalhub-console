// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';
import { useResourceContext } from 'react-admin';
import { useRootSelector } from '@dslab/ra-root-selector';
import { useFileContext } from '../FileContext';
import {
    PathResolver,
    UploadInfo,
    UploadTargetContext,
} from './types';

/**
 * Path resolver for uploads of entity `id` named `name`: the backend returns
 * the file path for a single file, the base path otherwise.
 * Undefined until both id and name are known.
 */
export const useResolveUploadPath = (params: {
    id?: string;
    name?: string;
    resource?: string;
    uploadTarget?: UploadTargetContext;
    filenamePrefix?: string;
    basePathSuffix?: string;
}): PathResolver | undefined => {
    const {
        id,
        name,
        resource: resourceParam,
        uploadTarget,
        filenamePrefix,
        basePathSuffix,
    } = params;
    const { provider } = useFileContext();
    const { root } = useRootSelector();
    const contextResource = useResourceContext();
    const resource = resourceParam ?? contextResource;
    const targetId = uploadTarget?.id ?? id;
    const targetName = uploadTarget?.name ?? name;
    const targetResource = uploadTarget?.resource ?? resource ?? '';

    return useMemo(() => {
        if (!id || !name || !targetName) return undefined;

        const context = {
            resource: resource ?? '',
            id,
            name,
            filenamePrefix,
            basePathSuffix,
        };
        const target = {
            id: targetId,
            name: targetName,
            resource: targetResource,
        };

        return {
            context,
            target,
            resolve: async ({ filename }) => {
                const resolvedFilename = filename
                    ? [filenamePrefix, filename].filter(Boolean).join('/')
                    : undefined;
                const info: UploadInfo = await provider.upload(
                    { meta: { root } },
                    undefined,
                    {
                        resource: context.resource,
                        id: context.id,
                        name: context.name,
                        filename: resolvedFilename,
                    }
                );

                if (!filename && basePathSuffix) {
                    const basePath = info.path.endsWith('/')
                        ? info.path.slice(0, -1)
                        : info.path;
                    const suffix = basePathSuffix.startsWith('/')
                        ? basePathSuffix.slice(1)
                        : basePathSuffix;
                    return `${basePath}/${suffix}`;
                }

                //zip files are automatically unzipped at download
                return resolvedFilename &&
                    info.path.startsWith('s3://') &&
                    info.path.endsWith('.zip')
                    ? 'zip+' + info.path
                    : info.path;
            },
        };
    }, [
        provider,
        root,
        resource,
        id,
        name,
        targetId,
        targetName,
        targetResource,
        filenamePrefix,
        basePathSuffix,
    ]);
};
