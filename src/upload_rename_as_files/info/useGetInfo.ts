// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from "@dslab/ra-root-selector";
import { useFileContext } from "../FileContext";
import { FileInfoParams, ResourceFileInfoParams, FileInfo } from "./types";
import { useCallback } from "react";

type GetFileInfoFunction = (
    params: FileInfoParams | ResourceFileInfoParams
) => Promise<FileInfo[]>;

export const useGetFileInfo = (): GetFileInfoFunction => {
    const { provider } = useFileContext();
    const { root } = useRootSelector();

    return useCallback(
        params => {
            let fParams: FileInfoParams | undefined = undefined;
            let rParams: ResourceFileInfoParams | undefined = undefined;
            if ('resource' in params) {
                rParams = params;
            } else {
                fParams = params;
            }

            return provider.fileInfo({ meta: { root } }, fParams, rParams);
        },
        [provider, root]
    );
};
