// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';
import { useResourceContext } from 'react-admin';
import { useRootSelector } from '@dslab/ra-root-selector';
import { useFileContext } from '../FileContext';
import { PathResolver, UploadInfo } from './types';

/**
 * Path resolver for uploads of entity `id` named `name`: the backend returns
 * the file path for a single file, the base path otherwise.
 * Undefined until both id and name are known.
 */
export const useResolveUploadPath = (params: {
    id?: string;
    name?: string;
}): PathResolver | undefined => {
    const { id, name } = params;
    const { provider } = useFileContext();
    const { root } = useRootSelector();
    const resource = useResourceContext();

    return useMemo(() => {
        if (!id || !name) return undefined;

        return async ({ filename }) => {
            const info: UploadInfo = await provider.upload(
                { meta: { root } },
                undefined,
                { resource: resource ?? '', id, name, filename }
            );

            //zip files are automatically unzipped at download
            return filename &&
                info.path.startsWith('s3://') &&
                info.path.endsWith('.zip')
                ? 'zip+' + info.path
                : info.path;
        };
    }, [provider, root, resource, id, name]);
};
