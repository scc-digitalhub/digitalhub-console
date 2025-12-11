// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ReactElement } from 'react';
import { FileProvider } from './FileProvider';
import { FileContext } from './FileContext';

// creates a FileContext
export const FileContextProvider = (props: FileContextProviderParams) => {
    const { fileProvider, children } = props;

    return (
        <FileContext.Provider value={{ provider: fileProvider }}>
            {children}
        </FileContext.Provider>
    );
};

export type FileContextProviderParams = {
    fileProvider: FileProvider;
    children: ReactElement;
};
