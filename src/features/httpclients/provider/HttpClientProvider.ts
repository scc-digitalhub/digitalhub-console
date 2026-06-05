// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { fetchUtils } from 'react-admin';

export type HttpClientProvider = {
    authorize(url: string): Promise<boolean> | undefined;
    embed(url: string): Promise<string> | undefined;
    openNew(url: string): Promise<void> | undefined;
    fetch: (url: string, options?: fetchUtils.Options) => Promise<Response>;
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

export type HttpClientRequest = {
    url: string;
    method: string;
    contentType: string;
    headers?: Headers;
    body: string;
};
