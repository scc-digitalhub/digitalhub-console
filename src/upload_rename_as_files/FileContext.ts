// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext } from "react";
import { FileProvider } from "./FileProvider";

// everything that can be stored in file context
interface FileContextValue {
    provider: FileProvider;
}

// context
export const FileContext = createContext<FileContextValue | undefined>(
    undefined
);

// hook to get context value
export const useFileContext = () => {
    const fileContext = useContext(FileContext);
    if (fileContext === undefined) {
        throw new Error(
            'useFileContext must be used inside a FileContext'
        );
    }
    return fileContext;
};
