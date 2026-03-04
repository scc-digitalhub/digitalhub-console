// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext } from 'react';
import { HttpClientProvider } from './HttpClientProvider';

interface HttpClientContextValue {
    provider: HttpClientProvider;
}

export const HttpClientContext = createContext<
    HttpClientContextValue | undefined
>(undefined);

// hook to get context value
export const useHttpClientContext = () => {
    const httpClientContext = useContext(HttpClientContext);
    if (httpClientContext === undefined) {
        throw new Error(
            'useHttpClientContext must be used inside an HttpClientContext'
        );
    }
    return httpClientContext;
};

//hook to get provider
export const useHttpClientProvider = () => {
    const httpClientContext = useHttpClientContext();
    if (httpClientContext === undefined) {
        throw new Error(
            'useHttpClientContext must be used inside an HttpClientContext'
        );
    }
    return httpClientContext.provider;
};
