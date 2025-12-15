// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { useFileContext } from '../FileContext';
import { useCallback } from 'react';
import {
    CompleteMultipartUploadParams,
    ResourceCompleteMultipartUploadParams,
    UploadInfo,
} from './types';

type UploadFunction = (
    params:
        | CompleteMultipartUploadParams
        | ResourceCompleteMultipartUploadParams
) => Promise<UploadInfo>;

export const useCompleteMultipartUpload = (): UploadFunction => {
    const { provider } = useFileContext();
    const { root } = useRootSelector();

    return useCallback(
        params => {
            let uParams: CompleteMultipartUploadParams | undefined = undefined;
            let rParams: ResourceCompleteMultipartUploadParams | undefined =
                undefined;
            if ('resource' in params) {
                rParams = params;
            } else {
                uParams = params;
            }

            return provider.completeMultipartUpload(
                { meta: { root } },
                uParams,
                rParams
            );
        },
        [provider, root]
    );
};
