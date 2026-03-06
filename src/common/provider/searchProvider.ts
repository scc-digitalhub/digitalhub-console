// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { stringify } from 'query-string';
import { fetchUtils } from 'ra-core';
import { GetListParams } from 'react-admin';
import {
    SearchFilter,
    SearchParams,
    SearchProvider,
    SearchResults,
} from '../../features/search/SearchProvider';
import { FetchFunction } from './types';

const searchProvider = (
    apiUrl: string,
    httpClient: FetchFunction = fetchUtils.fetchJson
): SearchProvider => {
    return {
        search: (
            searchParams: SearchParams,
            params: GetListParams
        ): Promise<SearchResults> => {
            const { page, perPage } = params.pagination || {
                page: 1,
                perPage: 10,
            };
            const { field, order } = params.sort || {
                field: 'id',
                order: 'ASC',
            };
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
            const url = `${apiUrl}${prefix}/solr/search/${
                params.meta?.group ? 'group' : 'item'
            }?`;

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

export default searchProvider;
