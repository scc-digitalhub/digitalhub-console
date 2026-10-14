// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ReactElement, useCallback, useEffect, useMemo, useRef } from 'react';
import { FileProvider } from './FileProvider';
import { FileContext } from './FileContext';
import { useUploadStatusController } from './upload/useUploadStatusController';

// creates a FileContext
export const FileContextProvider = (props: FileContextProviderParams) => {
    const { fileProvider, children } = props;
    const uploadStatusController = useUploadStatusController();
    const activeJobs = useRef(new Set<Promise<void>>());

    const startBackgroundJobs = useCallback((jobs: Array<() => Promise<void>>) => {
        jobs.forEach(job => {
            const activeJob = Promise.resolve()
                .then(job)
                .catch(console.error)
                .finally(() => activeJobs.current.delete(activeJob));
            activeJobs.current.add(activeJob);
        });
    }, []);
    const backgroundUploadManager = useMemo(
        () => ({ start: startBackgroundJobs }),
        [startBackgroundJobs]
    );
    const contextValue = useMemo(
        () => ({
            provider: fileProvider,
            uploadStatusController,
            backgroundUploadManager,
        }),
        [fileProvider, uploadStatusController, backgroundUploadManager]
    );

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
        <FileContext.Provider value={contextValue}>
            {children}
        </FileContext.Provider>
    );
};

export type FileContextProviderParams = {
    fileProvider: FileProvider;
    children: ReactElement;
};
