// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ReactElement, useCallback, useEffect } from 'react';
import { FileProvider } from './FileProvider';
import { FileContext } from './FileContext';
import { useUploadStatusController } from './upload/useUploadStatusController';

// creates a FileContext
export const FileContextProvider = (props: FileContextProviderParams) => {
    const { fileProvider, children } = props;
    const uploadStatusController = useUploadStatusController();

    const beforeUnloadHandler = useCallback((event: BeforeUnloadEvent) => {
        // Recommended
        event.preventDefault();
        // Included for legacy support, e.g. Chrome/Edge < 119
        event.returnValue = true;
    }, []);

    useEffect(() => {
        if (uploadStatusController.uploading) {
            window.addEventListener('beforeunload', beforeUnloadHandler);
        } else {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
        }
    }, [beforeUnloadHandler, uploadStatusController.uploading]);

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
