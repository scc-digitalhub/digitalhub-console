// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { useFileContext } from '../FileContext';
import { FileInfoParams, FileInfo } from './types';
import { useCallback } from 'react';
import flattenDeep from 'lodash/flattenDeep';

type GetNestedFileInfoFunction = (
    params: FileInfoParams
) => Promise<FileInfo[]>;

/**
 * Hook for a function that recursively gets file info from the store.
 * The returned function accepts a path as entrypoint, gets the file info
 * including nested folders and returns a flattened array of file info.
 */
export const useGetNestedFileInfo = (): GetNestedFileInfoFunction => {
    const { provider } = useFileContext();
    const { root } = useRootSelector();

    return useCallback(
        params => {
            const func = async (path: string) => {
                return provider
                    .fileInfo({ meta: { root } }, { path })
                    .then(files => {
                        const promises = files.map(file => {
                            const filePath = path + file.name;
                            file.path = filePath;
                            if (file.name.endsWith('/')) {
                                return func(filePath);
                            }
                            return file;
                        });
                        return Promise.all(promises);
                    });
            };

            return func(params.path).then(res =>
                flattenDeep(res).map((fileInfo: any) => ({
                    ...fileInfo,
                    path: fileInfo.path.substring(params.path.length),
                }))
            );
        },
        [provider, root]
    );
};
