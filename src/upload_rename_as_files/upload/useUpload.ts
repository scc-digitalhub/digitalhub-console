// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { useFileContext } from '../FileContext';
import { useCallback } from 'react';
import { ResourceUploadParams, UploadInfo, UploadParams } from './types';

type UploadFunction = (
    params: UploadParams | ResourceUploadParams,
    multipart?: boolean
) => Promise<UploadInfo>;

export const useUpload = (): UploadFunction => {
    const { provider } = useFileContext();
    const { root } = useRootSelector();

    return useCallback(
        (params, multipart = false) => {
            let uParams: UploadParams | undefined = undefined;
            let rParams: ResourceUploadParams | undefined = undefined;
            if ('resource' in params) {
                rParams = params;
            } else {
                uParams = params;
            }

            if (multipart) {
                return provider.startMultipartUpload(
                    { meta: { root } },
                    uParams,
                    rParams
                );
            } else {
                return provider.upload({ meta: { root } }, uParams, rParams);
            }
        },
        [provider, root]
    );
};
