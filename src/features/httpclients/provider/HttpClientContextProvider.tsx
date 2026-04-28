// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ReactElement, useMemo } from 'react';
import { HttpClientContext } from '../HttpClientContext';
import { HttpClientProvider } from './HttpClientProvider';
import { useRootSelector } from '@dslab/ra-root-selector';

export const HttpClientContextProvider = (
    props: HttpClientContextProviderParams
) => {
    const { httpClientProvider, children } = props;
    const { root } = useRootSelector();

    const httpClientContext = useMemo(() => {
        function injectRoot(params: any) {
            const meta = params?.meta || {};
            meta.root = root;
            return {
                ...params,
                meta,
            };
        }

        //patch provider methods with root in meta
        const providerWithRootSelector = {};
        Object.keys(httpClientProvider).forEach(method => {
            providerWithRootSelector[method] = (url, params, signal) => {
                return httpClientProvider[method](
                    url,
                    injectRoot(params),
                    signal
                );
            };
        });

        return {
            provider: providerWithRootSelector as HttpClientProvider,
        };
    }, [httpClientProvider, root]);

    return (
        <HttpClientContext.Provider value={httpClientContext}>
            {children}
        </HttpClientContext.Provider>
    );
};

export type HttpClientContextProviderParams = {
    httpClientProvider: HttpClientProvider;
    children: ReactElement;
};
