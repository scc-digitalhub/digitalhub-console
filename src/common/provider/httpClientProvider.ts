// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { fetchUtils } from 'ra-core';
import { HttpClientProvider } from '../../features/httpclients/HttpClientProvider';
import { FetchFunction } from './types';

const httpClientProvider = (
    apiUrl: string,
    httpClient: FetchFunction = fetchUtils.fetchJson
): HttpClientProvider => {
    return {
        apiUrl: () => apiUrl,
        client: (url, opts) => httpClient(url, opts),
        checkHealth: (base, path, key, proxy, signal) => {
            if (!base) return Promise.resolve({ ok: false });

            return httpClient(`${apiUrl}${proxy}`, {
                method: 'POST',
                headers: new Headers({
                    'X-Proxy-URL': `${base}${path}`,
                    'X-Proxy-Method': 'GET',
                    'Content-Type': 'application/json',
                }),
                signal,
            } as any)
                .then(({ status, json }) => {
                    return {
                        ok: !!json?.[key],
                        status,
                        message: json?.message?.toString(),
                        json,
                    };
                })
                .catch(error => {
                    return {
                        ok: false,
                        status: error?.status,
                        message: error?.body?.message || error?.message,
                    };
                });
        },
    };
};

export default httpClientProvider;
