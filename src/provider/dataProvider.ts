import { stringify } from 'query-string';
import { fetchUtils, DataProvider } from 'ra-core';
import { GetListParams } from 'react-admin';
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
            if (resource !== 'projects' && params.meta?.root) {
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
                            : JSON.stringify({ ...params.data, id: null }),
                }).then(({ json }) => ({
                    data: { ...params.data, id: json.id } as any,
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
                data: { ...params.data, id: json.id } as any,
            }));
        },
        delete: (resource, params) => {
            let prefix = '';
            if (resource !== 'projects' && params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }
            let url = `${apiUrl}${prefix}/${resource}/${params.id}?cascade=true`;

            if (params.meta?.deleteAll === true && params.meta?.name) {
                url = `${apiUrl}${prefix}/${resource}?name=${params.meta.name}`;
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

            //make a distinct call for every entry
            return Promise.all(
                params.ids.map(id =>
                    httpClient(`${url}/${id}`, {
                        method: 'DELETE',
                    })
                )
            ).then(responses => ({ data: responses.map(({ json }) => json) }));
        },
        getSecretData: params => {
            let prefix = '';
            if (params.root) {
                prefix = '/-/' + params.root;
                delete params.root;
            }
            const url = `${apiUrl}${prefix}/secrets/data?${stringify(params)}`;
            return httpClient(url).then(({ status, json }) => {
                if (status !== 200) {
                    throw new Error('Invalid response status ' + status);
                }
                return {
                    data: json,
                };
            });
        },
        createSecret: params => {
            let prefix = '/-/' + params.project;
            let url = `${apiUrl}${prefix}/secrets`;
            url += '/data ';
            delete params['project'];
            // const paramsSecret=JSON.parse(JSON.stringify(params.data));
            // const newObj = Object.assign({}, params.data);

            return httpClient(url, {
                method: 'PUT',
                body: JSON.stringify(params),
            }).then(({ json }) => ({ data: json }));
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
    };
};

export default springDataProvider;
