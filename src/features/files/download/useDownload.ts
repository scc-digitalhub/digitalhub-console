// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';
import { useFileContext } from '../FileContext';
import { DownloadInfo, DownloadParams, ResourceDownloadParams } from './types';
import { useRootSelector } from '@dslab/ra-root-selector';

type DownloadFunction = (
    params: DownloadParams | ResourceDownloadParams
) => Promise<DownloadInfo>;

export const useDownload = (): DownloadFunction => {
    const { provider } = useFileContext();
    const { root } = useRootSelector();

    return useCallback(
        params => {
            let dParams: DownloadParams | undefined = undefined;
            let rParams: ResourceDownloadParams | undefined = undefined;
            if ('resource' in params) {
                rParams = params;
            } else {
                dParams = params;
            }

            return provider.download({ meta: { root } }, dParams, rParams);
        },
        [provider, root]
    );
};
