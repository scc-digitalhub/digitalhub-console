// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

export type HttpClientProvider = {
    get: (
        url: string,
        params: Params,
        signal?: AbortSignal
    ) => Promise<HttpClientResponse>;
    post: (
        url: string,
        params: PostParams,
        signal?: AbortSignal
    ) => Promise<HttpClientResponse>;
    put: (
        url: string,
        params: PostParams,
        signal?: AbortSignal
    ) => Promise<HttpClientResponse>;
    patch: (
        url: string,
        params: PostParams,
        signal?: AbortSignal
    ) => Promise<HttpClientResponse>;
    delete: (
        url: string,
        params: Params,
        signal?: AbortSignal
    ) => Promise<HttpClientResponse>;
};

export type Params = {
    headers?: Headers;
    meta?: any;
};

export type PostParams = Params & {
    body: string;
    contentType: string;
};

export type HttpClientResponse = {
    status: number;
    headers?: Headers;
    body: string;
    json?: any;
    error?: any;
};
