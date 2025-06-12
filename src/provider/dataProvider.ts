// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { stringify } from 'query-string';
import { fetchUtils, DataProvider } from 'ra-core';
import { GetListParams, Options } from 'react-admin';
import {
    SearchFilter,
    SearchParams,
    SearchProvider,
    SearchResults,
} from '../search/searchbar/SearchProvider';

/**
 * Data Provider for Spring REST with Pageable support.
 * List/ManyReference expects a page in return, and will send paging/sorting parameters,
 * while Many will expect a list in a wrapper as response, and won't use paging/sorting at all
 *
 *
 * @param apiUrl
 * @param httpClient
 *
 * @example
 *
 * getList          => GET http://apiUrl/data?page=1&sort=id,ASC
 * getOne           => GET http://apiUrl/data/<id>
 * getManyReference => GET http://apiUrl/data?field=<id>
 * getMany          => GET http://apiUrl/data?id=<id>,<id>
 * create           => POST http://apiUrl/data
 * update           => PUT http://apiUrl/data/<id>
 * updateMany       => PUT http://apiUrl/data/<id>, PUT http://apiUrl/data/<id>
 * delete           => DELETE http://apiUrl/data/<id>
 *
 */

const springDataProvider = (
    apiUrl: string,
    httpClient: (
        url: any,
        options?: fetchUtils.Options | undefined
    ) => Promise<{
        status: number;
        headers: Headers;
        body: string;
        json: any;
    }> = fetchUtils.fetchJson
): DataProvider & SearchProvider => {
    return {
        apiUrl: async () => apiUrl,
        invoke: ({
            path,
            params,
            body,
            options,
        }: {
            path: string;
            params?: any;
            body?: string;
            options?: Options;
        }) => {
            let url = `${apiUrl}${path}`;
            if (params) {
                url = `${apiUrl}${path}?${stringify(params)}`;
            }
            const opts = options ? options : {};
            if (body) {
                opts.body = body;
            }
            return httpClient(url, opts).then(({ headers, json }) => {
                return json;
            });
        },
        getList: (resource, params) => {
            //handle pagination request as pageable (page,size)
            const { page, perPage } = params.pagination;
            const { field: fieldParam, order } = params.sort;
            //unbox metadata and status fields as tl params
            const field = !fieldParam
                ? fieldParam
                : fieldParam.indexOf('.') > 0
                ? fieldParam.substring(fieldParam.indexOf('.') + 1)
                : fieldParam;

            const record = params.meta?.record;
            const allVersion = params.meta?.allVersion;

            const query = {
                ...fetchUtils.flattenObject(params.filter), //additional filter parameters as-is
                sort: field + ',' + order, //sorting
                page: page - 1, //page starts from zero
                size: perPage,
            };
            let prefix = '';
            if (
                resource !== 'projects' &&
                resource !== 'templates' &&
                params.meta?.root
            ) {
                prefix = '/-/' + params.meta.root;
            }
            let url = '';
            if (allVersion && record) {
                url = `${apiUrl}${prefix}/${resource}/${
                    record.name
                }?${stringify(query)}`;
            } else {
                url = `${apiUrl}${prefix}/${resource}?${stringify(query)}`;
            }
            return httpClient(url).then(({ status, json }) => {
                if (status !== 200) {
                    throw new Error('Invalid response status ' + status);
                }
                if (!json.content) {
                    throw new Error('the response must match page<> model');
                }

                //extract data from content
                return {
                    data: json.content,
                    total: parseInt(json.totalElements),
                };
            });
        },
        //get the specific version based on id. The Url changes and it
        getOne: (resource, params) => {
            let prefix = '';
            if (resource !== 'projects' && params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }
            const url = `${apiUrl}${prefix}/${resource}/${params.id}`;
            return httpClient(url).then(({ status, json }) => {
                if (status !== 200) {
                    throw new Error('Invalid response status ' + status);
                }
                return {
                    data: json,
                };
            });
        },
        getMany: (resource, params) => {
            //no pagination!
            const query = {
                id: params.ids ? params.ids.join(',') : '',
            };
            let prefix = '';
            if (resource !== 'projects' && params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }
            const url = `${apiUrl}${prefix}/${resource}?${stringify(query)}`;
            return httpClient(url).then(({ status, json }) => {
                if (status !== 200) {
                    throw new Error('Invalid response status ' + status);
                }
                if (!json.content) {
                    throw new Error('the response must match page<> model');
                }

                return {
                    data: json.content,
                    total: json.totalElements
                        ? parseInt(json.totalElements)
                        : json.content.length,
                };
            });
        },
        getManyReference: (resource, params) => {
            //handle pagination request as pageable (page,size)
            const { page, perPage } = params.pagination;
            const { field, order } = params.sort;
            const query = {
                [params.target]: params.id, // reference key with field
                sort: field + ',' + order, //sorting
                page: page - 1, //page starts from zero
                size: perPage,
            };
            let prefix = '';
            if (resource !== 'projects' && params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }
            const url = `${apiUrl}${prefix}/${resource}?${stringify(query)}`;
            return httpClient(url).then(({ status, json }) => {
                if (status !== 200) {
                    throw new Error('Invalid response status ' + status);
                }
                if (!json.content) {
                    throw new Error('the response must match page<> model');
                }

                //extract data from content
                return {
                    data: json.content,
                    total: parseInt(json.totalElements),
                };
            });
        },
        update: (resource, params) => {
            let prefix = '';
            if (resource !== 'projects' && params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }
            if (!params.data) {
                throw new Error('Invalid data');
            }

            if (params.meta?.update === false) {
                //not updatable, call create and reset id
                const url = `${apiUrl}${prefix}/${resource}`;
                return httpClient(url, {
                    method: 'POST',
                    body:
                        typeof params.data === 'string'
                            ? params.data
                            : JSON.stringify({
                                  ...params.data,
                                  id: params.meta?.id,
                              }),
                }).then(({ json }) => ({
                    data: { ...json } as any,
                }));
            }

            const url = `${apiUrl}${prefix}/${resource}/${params.id}`;
            return httpClient(url, {
                method: 'PUT',
                body:
                    typeof params.data === 'string'
                        ? params.data
                        : JSON.stringify(params.data),
            }).then(({ json }) => ({ data: json }));
        },
        updateMany: (resource, params) => {
            let prefix = '';
            if (resource !== 'projects' && params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }
            const url = `${apiUrl}${prefix}/${resource}`;

            //make a distinct call for every entry
            return Promise.all(
                params.ids.map(id =>
                    httpClient(`${url}/${id}`, {
                        method: 'PUT',
                        body: JSON.stringify(params.data),
                    })
                )
            ).then(responses => ({
                data: responses.map(({ json }) => json.id),
            }));
        },
        create: (resource, params) => {
            let prefix = '';
            if (resource !== 'projects' && params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }
            const url = `${apiUrl}${prefix}/${resource}`;

            return httpClient(url, {
                method: 'POST',
                body:
                    typeof params.data === 'string'
                        ? params.data
                        : JSON.stringify(params.data),
            }).then(({ json }) => ({
                data: { ...json, id: json.id || '' } as any,
            }));
        },
        delete: (resource, params) => {
            let prefix = '';
            if (resource !== 'projects' && params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }
            let url = `${apiUrl}${prefix}/${resource}/${params.id}${
                params.meta?.cascade ? '?cascade=true' : ''
            }`;

            if (params.meta?.deleteAll === true && params.meta?.name) {
                url = `${apiUrl}${prefix}/${resource}?name=${params.meta.name}${
                    params.meta?.cascade ? '&cascade=true' : ''
                }`;
            }

            return httpClient(url, {
                method: 'DELETE',
            }).then(({ json }) => ({ data: json }));
        },
        deleteMany: (resource, params) => {
            let prefix = '';
            if (resource !== 'projects' && params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }
            const url = `${apiUrl}${prefix}/${resource}`;

            const promises =
                params.meta?.deleteAll === true && params.meta?.names
                    ? params.meta.names.map(name =>
                          httpClient(
                              `${url}?name=${name}${
                                  params.meta?.cascade ? '&cascade=true' : ''
                              }`,
                              {
                                  method: 'DELETE',
                              }
                          )
                      )
                    : params.ids.map(id =>
                          httpClient(
                              `${url}/${id}${
                                  params.meta?.cascade ? '?cascade=true' : ''
                              }`,
                              {
                                  method: 'DELETE',
                              }
                          )
                      );

            //make a distinct call for every entry
            return Promise.all(promises).then(responses => ({
                data: responses.map(({ json }) => json),
            }));
        },
        readSecretData: (name: string, params) => {
            let prefix = '';
            if (params.root) {
                prefix = '/-/' + params.root;
            }
            const query = {
                keys: name,
            };
            const url = `${apiUrl}${prefix}/secrets/data?${stringify(query)}`;
            return httpClient(url).then(({ status, json }) => {
                if (status !== 200) {
                    throw new Error('Invalid response status ' + status);
                }
                return {
                    data: json,
                };
            });
        },
        writeSecretData: (record, params) => {
            let prefix = '';
            if (params.root) {
                prefix = '/-/' + params.root;
            }
            let url = `${apiUrl}${prefix}/secrets/data`;
            if (!record?.name || !record.value) {
                throw new Error('Invalid data');
            }
            let body = {};
            body[record.name] = record.value;

            return httpClient(url, {
                method: 'PUT',
                body: JSON.stringify(body),
            }).then(({ status, json }) => {
                if (status !== 200) {
                    throw new Error('Invalid response status ' + status);
                }
                return {
                    data: json,
                };
            });
        },
        search: (
            searchParams: SearchParams,
            params: GetListParams
        ): Promise<SearchResults> => {
            const { page, perPage } = params.pagination;
            const { field, order } = params.sort;
            const query = {
                ...fetchUtils.flattenObject(params.filter), //additional filter parameters as-is
                sort: field + ',' + order, //sorting
                page: page - 1, //page starts from zero
                size: perPage,
            };

            const q = searchParams.q
                ? `q=${encodeURIComponent(searchParams.q)}`
                : '';

            const fq = searchParams.fq
                ?.map(
                    (filter: SearchFilter) =>
                        `fq=${encodeURIComponent(filter.filter)}`
                )
                .join('&');

            const pageQuery = stringify(query);

            let prefix = '';
            if (params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }
            const url = `${apiUrl}${prefix}/solr/search/item?`;

            return httpClient(
                `${url}${[q, fq, pageQuery].filter(Boolean).join('&')}`,
                {
                    method: 'GET',
                }
            ).then(({ status, json }) => {
                if (status !== 200) {
                    throw new Error('Invalid response status ' + status);
                }
                if (!json) {
                    throw new Error('Empty response from server');
                }
                if (!json.content) {
                    throw new Error('the response must match page<> model');
                }
                //extract data from content
                return {
                    data: json.content,
                    total: parseInt(json.totalElements),
                };
            });
        },
        download: (resource, params) => {
            let prefix = '';
            let sub = '';
            if (resource !== 'projects' && params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }
            if (params.sub) {
                sub = `?${stringify({ sub: params.sub })}`;
            }
            const url = `${apiUrl}${prefix}/${resource}/${params.id}/files/download${sub}`;
            return httpClient(url).then(({ status, body }) => {
                if (status !== 200) {
                    throw new Error('Invalid response status ' + status);
                }
                if (!body) {
                    throw new Error('Resource not found');
                }
                const jsonBody = JSON.parse(body);
                return {
                    url: jsonBody?.url,
                };
            });
        },
        fileInfo: (resource, params) => {
            let prefix = '';
            if (resource !== 'projects' && params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }
            const url = `${apiUrl}${prefix}/${resource}/${params.id}/files/info`;
            return httpClient(url).then(({ status, body }) => {
                if (status !== 200) {
                    throw new Error('Invalid response status ' + status);
                }
                if (!body) {
                    throw new Error('Resource not found');
                }
                const jsonBody = JSON.parse(body);
                return {
                    info: jsonBody,
                };
            });
        },
        //Post
        upload: (resource, params) => {
            let prefix = '';
            if (resource !== 'projects' && params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }
            const url = `${apiUrl}${prefix}/${resource}/${params.id}/files/upload?filename=${params.filename}`;
            return httpClient(url, { method: 'POST' }).then(
                ({ status, body }) => {
                    if (status !== 200) {
                        throw new Error('Invalid response status ' + status);
                    }
                    if (!body) {
                        throw new Error('Resource not found');
                    }
                    const jsonBody = JSON.parse(body);
                    return {
                        path: jsonBody.path,
                        url: jsonBody.url,
                        expiration: jsonBody.expiration,
                    };
                }
            );
        },
        //POST
        uploadMultipartStart: (resource, params) => {
            let prefix = '';
            if (resource !== 'projects' && params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }
            const url = `${apiUrl}${prefix}/${resource}/${params.id}/files/multipart/start?filename=${params.filename}`;
            return httpClient(url, { method: 'POST' }).then(
                ({ status, body }) => {
                    if (status !== 200) {
                        throw new Error('Invalid response status ' + status);
                    }
                    if (!body) {
                        throw new Error('Resource not found');
                    }
                    const jsonBody = JSON.parse(body);
                    return {
                        path: jsonBody.path,
                        uploadId: jsonBody.uploadId,
                    };
                }
            );
        },
        //PUT
        uploadMultipartPart: (resource, params) => {
            let prefix = '';
            if (resource !== 'projects' && params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }
            const url = `${apiUrl}${prefix}/${resource}/${params.id}/files/multipart/part?filename=${params.filename}&uploadId=${params.uploadId}&partNumber=${params.partNumber}`;
            return httpClient(url, { method: 'PUT' }).then(
                ({ status, body }) => {
                    if (status !== 200) {
                        throw new Error('Invalid response status ' + status);
                    }
                    if (!body) {
                        throw new Error('Resource not found');
                    }
                    const jsonBody = JSON.parse(body);
                    return {
                        path: jsonBody.path,
                        url: jsonBody.url,
                        expiration: jsonBody.expiration,
                    };
                }
            );
        },
        //POST
        uploadMultipartComplete: (resource, params) => {
            let prefix = '';
            if (resource !== 'projects' && params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }
            const eTagPartList = params.eTagPartList
                ? params.eTagPartList.map(etag => `partList=${etag}`).join('&')
                : '';
            const url = `${apiUrl}${prefix}/${resource}/${params.id}/files/multipart/complete?filename=${params.filename}&uploadId=${params.uploadId}&${eTagPartList}`;
            return httpClient(url, { method: 'POST' }).then(
                ({ status, body }) => {
                    if (status !== 200) {
                        throw new Error('Invalid response status ' + status);
                    }
                    if (!body) {
                        throw new Error('Resource not found');
                    }
                    const jsonBody = JSON.parse(body);
                    return {
                        path: jsonBody.path,
                        url: jsonBody.url,
                        expiration: jsonBody.expiration,
                    };
                }
            );
        },
        //Lineage for Entities
        getLineage: (resource, params) => {
            let prefix = '';
            if (resource !== 'projects' && params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }
            const url = `${apiUrl}${prefix}/${resource}/${params.id}/relationships`;
            return httpClient(url).then(({ status, body }) => {
                if (status !== 200) {
                    throw new Error('Invalid response status ' + status);
                }
                if (!body) {
                    throw new Error('Resource not found');
                }
                const jsonBody = JSON.parse(body);
                return {
                    lineage: jsonBody,
                };
            });
        },
        //Lineage for whole project
        getProjectLineage: (resource, params) => {
            const url = `${apiUrl}/${resource}/${params.id}/relationships`;
            return httpClient(url).then(({ status, body }) => {
                if (status !== 200) {
                    throw new Error('Invalid response status ' + status);
                }
                if (!body) {
                    throw new Error('Resource not found');
                }
                const jsonBody = JSON.parse(body);
                return {
                    lineage: jsonBody,
                };
            });
        },
        getMetrics: (resource, params) => {
            let prefix = '';
            if (resource !== 'projects' && params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }
            const url = `${apiUrl}${prefix}/${resource}/${params.id}/metrics`;
            return httpClient(url).then(({ status, body }) => {
                if (status !== 200) {
                    throw new Error('Invalid response status ' + status);
                }
                if (!body) {
                    throw new Error('Resource not found');
                }
                const jsonBody = JSON.parse(body);
                return {
                    metrics: jsonBody,
                };
            });
        },
    };
};

export default springDataProvider;
