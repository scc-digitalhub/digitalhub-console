// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { fetchUtils } from 'react-admin';

export type HttpClientProvider = {
    apiUrl: () => string;
    client: (
        url: string,
        options?: fetchUtils.Options
    ) => Promise<{
        status: number;
        headers: Headers;
        body: string;
        json: any;
    }>;
    /**
     * Performs a proxied health check POST to the API proxy endpoint.
     * Returns true if the returned JSON contains key === true.
     */
    checkHealth: (
        base: string,
        path: string,
        key: string,
        proxy: string,
        signal?: AbortSignal
    ) => Promise<{
        ok: boolean;
        status?: number;
        message?: string;
        json?: any;
    }>;
};
