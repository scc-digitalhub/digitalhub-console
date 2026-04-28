// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { fetchUtils, Options } from 'ra-core';
import { HttpClientProvider } from '../../features/httpclients/HttpClientProvider';
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
        const response = await fetch(url, {
            ...options,
            headers: requestHeaders,
        });

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

    const httpClient = async (url: string, options: Options = {}) => {
        const headers = (options.headers || new Headers({})) as Headers;
        if (authProvider) {
            const authHeader = await authProvider.getAuthorization();
            if (authHeader) {
                headers.set('Authorization', authHeader);
            }
        }

        options.headers = headers;
        return _fetch(url, options);
    };

    const getRequestHeaders = (
        url: string,
        headers?: Headers,
        contentType?: string
    ) => {
        const requestHeaders = new Headers();
        if (url.startsWith('http')) {
            requestHeaders.set('X-Proxy-URL', url);
        } else {
            requestHeaders.set('X-Proxy-Host', url);
        }

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
        get: (url, params, signal) => {
            const requestHeaders = getRequestHeaders(url, params.headers);

            return httpClient(`${proxyUrl}`, {
                headers: requestHeaders,
                signal,
            });
        },
        post: (url, params, signal) => {
            if (!params.contentType) {
                params.contentType = 'text/plain';
            }

            const requestHeaders = getRequestHeaders(
                url,
                params.headers,
                params.contentType
            );

            return httpClient(`${proxyUrl}`, {
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

            const requestHeaders = getRequestHeaders(
                url,
                params.headers,
                params.contentType
            );

            return httpClient(`${proxyUrl}`, {
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

            const requestHeaders = getRequestHeaders(
                url,
                params.headers,
                params.contentType
            );

            return httpClient(`${proxyUrl}`, {
                method: 'PATCH',
                headers: requestHeaders,
                body: params.body,
                signal,
            });
        },
        delete: (url, params, signal) => {
            const requestHeaders = getRequestHeaders(url, params.headers);

            return httpClient(`${proxyUrl}`, {
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
