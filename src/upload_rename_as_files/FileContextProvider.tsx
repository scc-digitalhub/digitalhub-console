// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ReactElement } from 'react';
import { FileProvider } from './FileProvider';
import { FileContext } from './FileContext';
import { useUploadStatusController } from './upload/uploadStatusController';

// creates a FileContext
export const FileContextProvider = (props: FileContextProviderParams) => {
    const { fileProvider, children } = props;
    const uploadStatusController = useUploadStatusController();

    return (
        <FileContext.Provider
            value={{ provider: fileProvider, uploadStatusController }}
        >
            {children}
        </FileContext.Provider>
    );
};

export type FileContextProviderParams = {
    fileProvider: FileProvider;
    children: ReactElement;
};
