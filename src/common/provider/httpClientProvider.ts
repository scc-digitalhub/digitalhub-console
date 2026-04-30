// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { fetchUtils, Options } from 'ra-core';
import { HttpClientProvider } from '../../features/httpclients/provider/HttpClientProvider';
import { FetchFunction } from './types';
import { AuthorizationAwareAuthProvider } from '@dslab/ra-auth-oidc';
import { createHeadersFromOptions } from 'ra-core/dist/cjs/dataProvider/fetch';

const isTextContentType = (contentType: string | null | undefined): boolean => {
    if (!contentType) return false;
    const ct = contentType.split(';')[0].trim().toLowerCase();
    return (
        ct.startsWith('text/') ||
        ct === 'application/json' ||
        ct.endsWith('+json')
    );
};

export const ExternalHttpProxyProvider = (
    proxyUrl: string,
    authProvider?: AuthorizationAwareAuthProvider
): HttpClientProvider => {
    const _fetch = async (url: string, options: Options = {}) => {
        const requestHeaders = createHeadersFromOptions(options);

        return fetch(url, {
            ...options,
            headers: requestHeaders,
        });
    };

    const httpClient = async (url: string, options: Options = {}) => {
        const reqHeaders = (options.headers || new Headers({})) as Headers;
        if (authProvider) {
            const authHeader = await authProvider.getAuthorization();
            if (authHeader) {
                reqHeaders.set('Authorization', authHeader);
            }
        }

        const response = await _fetch(url, { ...options, headers: reqHeaders });

        const contentType = response.headers.get('Content-Type');
        const status = response.status;
        const headers = new Headers(response.headers);

        const body = isTextContentType(contentType)
            ? await response.text()
            : '';

        //parse json from already-read body text to avoid double-consuming the stream
        let json: any = null;
        if (contentType?.includes('application/json') && body) {
            try {
                json = JSON.parse(body);
            } catch {
                // not valid json, leave as null
            }
        }

        return { status, headers, body, json };
    };

    const parseUrl = (url: string) => {
        //parse url and get scheme, host and port to set as headers, to allow proxy to route request correctly
        const normalized = url.includes('://') ? url : `http://${url}`;
        const parsed = new URL(normalized);
        const scheme = parsed.protocol.replace(':', '');
        const host = parsed.host; // includes port if present
        const path = parsed.pathname + parsed.search;

        return { scheme, host, path };
    };
    const getRequestHeaders = (headers?: Headers, contentType?: string) => {
        const requestHeaders = new Headers();

        if (contentType) {
            requestHeaders.set('Content-Type', contentType);
        }
        if (headers) {
            headers.forEach((v, k) => {
                requestHeaders.set(k, v);
            });
        }
        return requestHeaders;
    };

    return {
        fetch: async (url, options: Options = {}) => {
            const { scheme, host, path } = parseUrl(url);
            console.log(
                'Proxying request to',
                url,
                'via',
                `${proxyUrl}${path}`,
                'for',
                host
            );
            const requestHeaders = (options.headers ||
                new Headers({})) as Headers;
            requestHeaders.set('X-Proxy-Host', host);

            if (authProvider) {
                const authHeader = await authProvider.getAuthorization();
                if (authHeader) {
                    requestHeaders.set('Authorization', authHeader);
                }
            }

            return _fetch(`${proxyUrl}${path}`, {
                ...options,
                headers: requestHeaders,
            });
        },
        get: (url, params, signal) => {
            const { scheme, host, path } = parseUrl(url);
            const requestHeaders = getRequestHeaders(params.headers);
            requestHeaders.set('X-Proxy-Host', host);

            return httpClient(`${proxyUrl}${path}`, {
                headers: requestHeaders,
                signal,
            });
        },
        post: (url, params, signal) => {
            const { scheme, host, path } = parseUrl(url);

            if (!params.contentType) {
                params.contentType = 'text/plain';
            }

            const requestHeaders = getRequestHeaders(
                params.headers,
                params.contentType
            );
            requestHeaders.set('X-Proxy-Host', host);

            return httpClient(`${proxyUrl}${path}`, {
                method: 'POST',
                headers: requestHeaders,
                body: params.body,
                signal,
            });
        },
        put: (url, params, signal) => {
            if (!params.body) {
                throw new Error('Body is missing in PUT request');
            }
            if (!params.contentType) {
                params.contentType = 'text/plain';
            }
            const { scheme, host, path } = parseUrl(url);

            const requestHeaders = getRequestHeaders(
                params.headers,
                params.contentType
            );
            requestHeaders.set('X-Proxy-Host', host);

            return httpClient(`${proxyUrl}${path}`, {
                method: 'PUT',
                headers: requestHeaders,
                body: params.body,
                signal,
            });
        },
        patch: (url, params, signal) => {
            if (!params.body) {
                throw new Error('Body is missing in PATCH request');
            }
            if (!params.contentType) {
                throw new Error('Content type is missing in PATCH request');
            }
            const { scheme, host, path } = parseUrl(url);

            const requestHeaders = getRequestHeaders(
                params.headers,
                params.contentType
            );
            requestHeaders.set('X-Proxy-Host', host);

            return httpClient(`${proxyUrl}${path}`, {
                method: 'PATCH',
                headers: requestHeaders,
                body: params.body,
                signal,
            });
        },
        delete: (url, params, signal) => {
            const { scheme, host, path } = parseUrl(url);

            const requestHeaders = getRequestHeaders(params.headers);
            requestHeaders.set('X-Proxy-Host', host);

            return httpClient(`${proxyUrl}${path}`, {
                method: 'DELETE',
                headers: requestHeaders,
                signal,
            });
        },
    };
};

export const DefaultHttpProxyProvider = (
    apiUrl: string,
    httpClient: FetchFunction = fetchUtils.fetchJson
): HttpClientProvider => {
    const getProxyUrl = (projectId, recordId) => {
        if (!projectId || !recordId)
            throw new Error('projectId and recordId are required');
        return apiUrl + '/-/' + projectId + '/runs/' + recordId + '/proxy';
    };

    const getRequestHeaders = (
        url: string,
        headers: Headers | undefined,
        method: string,
        contentType?: string
    ) => {
        const requestHeaders = new Headers({
            'X-Proxy-URL': url,
            'X-Proxy-Method': method.toUpperCase(),
        });

        if (contentType) {
            requestHeaders.set('Content-Type', contentType);
        }

        //add/overwrite headers with provided ones
        if (headers) {
            headers.forEach((v, k) => {
                requestHeaders.set(k, v);
            });
        }
        return requestHeaders;
    };

    const getResponseHeaders = response => {
        //extract proxied headers
        let responseHeaders = new Headers({});
        const rh = Object.fromEntries(response.headers.entries());
        Object.keys(rh)
            .filter(k => k.toLowerCase().startsWith('x-proxy-'))
            .forEach(k => {
                responseHeaders.set(k.substring(8), rh[k]);
            });
        return responseHeaders;
    };

    return {
        fetch: () => {
            throw new Error(
                'Direct fetch is not supported in DefaultHttpProxyProvider'
            );
        },
        get: (url, params, signal) => {
            const proxyUrl = getProxyUrl(
                params.meta?.root,
                params.meta?.recordId
            );
            const requestHeaders = getRequestHeaders(
                url,
                params.headers,
                'get'
            );

            return httpClient(`${proxyUrl}`, {
                headers: requestHeaders,
                signal,
            })
                .then(res => {
                    const responseHeaders = getResponseHeaders(res);
                    return { ...res, headers: responseHeaders };
                })
                .catch(({ message, status, body }) => {
                    return { error: message, status, body };
                });
        },
        post: (url, params, signal) => {
            if (!params.body) {
                throw new Error('Body is missing in POST request');
            }
            if (!params.contentType) {
                throw new Error('Content type is missing in POST request');
            }

            const proxyUrl = getProxyUrl(
                params.meta?.root,
                params.meta?.recordId
            );
            const requestHeaders = getRequestHeaders(
                url,
                params.headers,
                'post',
                params.contentType
            );

            return httpClient(`${proxyUrl}`, {
                method: 'POST',
                headers: requestHeaders,
                body: params.body,
                signal,
            })
                .then(res => {
                    const responseHeaders = getResponseHeaders(res);
                    return { ...res, headers: responseHeaders };
                })
                .catch(({ message, status, body }) => {
                    return { error: message, status, body };
                });
        },
        put: (url, params, signal) => {
            if (!params.body) {
                throw new Error('Body is missing in PUT request');
            }
            if (!params.contentType) {
                throw new Error('Content type is missing in PUT request');
            }

            const proxyUrl = getProxyUrl(
                params.meta?.root,
                params.meta?.recordId
            );
            const requestHeaders = getRequestHeaders(
                url,
                params.headers,
                'put',
                params.contentType
            );

            return httpClient(`${proxyUrl}`, {
                method: 'PUT',
                headers: requestHeaders,
                body: params.body,
                signal,
            })
                .then(res => {
                    const responseHeaders = getResponseHeaders(res);
                    return { ...res, headers: responseHeaders };
                })
                .catch(({ message, status, body }) => {
                    return { error: message, status, body };
                });
        },
        patch: (url, params, signal) => {
            if (!params.body) {
                throw new Error('Body is missing in PATCH request');
            }
            if (!params.contentType) {
                throw new Error('Content type is missing in PATCH request');
            }

            const proxyUrl = getProxyUrl(
                params.meta?.root,
                params.meta?.recordId
            );
            const requestHeaders = getRequestHeaders(
                url,
                params.headers,
                'patch',
                params.contentType
            );

            return httpClient(`${proxyUrl}`, {
                method: 'PATCH',
                headers: requestHeaders,
                body: params.body,
                signal,
            })
                .then(res => {
                    const responseHeaders = getResponseHeaders(res);
                    return { ...res, headers: responseHeaders };
                })
                .catch(({ message, status, body }) => {
                    return { error: message, status, body };
                });
        },
        delete: (url, params, signal) => {
            const proxyUrl = getProxyUrl(
                params.meta?.root,
                params.meta?.recordId
            );
            const requestHeaders = getRequestHeaders(
                url,
                params.headers,
                'delete'
            );

            return httpClient(`${proxyUrl}`, {
                method: 'DELETE',
                headers: requestHeaders,
                signal,
            })
                .then(res => {
                    const responseHeaders = getResponseHeaders(res);
                    return { ...res, headers: responseHeaders };
                })
                .catch(({ message, status, body }) => {
                    return { error: message, status, body };
                });
        },
    };
};
