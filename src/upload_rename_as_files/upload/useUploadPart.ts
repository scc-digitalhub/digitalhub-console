// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { useFileContext } from '../FileContext';
import { useCallback } from 'react';
import {
    ResourceUploadPartParams,
    UploadInfo,
    UploadPartParams,
} from './types';

type UploadFunction = (
    params: UploadPartParams | ResourceUploadPartParams
) => Promise<UploadInfo>;

export const useUploadPart = (): UploadFunction => {
    const { provider } = useFileContext();
    const { root } = useRootSelector();

    return useCallback(
        params => {
            let uParams: UploadPartParams | undefined = undefined;
            let rParams: ResourceUploadPartParams | undefined = undefined;
            if ('resource' in params) {
                rParams = params;
            } else {
                uParams = params;
            }

            return provider.uploadPart({ meta: { root } }, uParams, rParams);
        },
        [provider, root]
    );
};
