// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef, useState } from 'react';
import {
    GetListParams,
    isEmpty,
    ListControllerResult,
    SortPayload,
    useListParams,
} from 'react-admin';
import { useSearch } from './searchbar/SearchContext';

export const useSearchController = ({
    resultsPerPage = 5,
    sortField = 'id',
    sortOrder = 'ASC',
    groupedSearch = false,
}: SearchControllerProps = {}): SearchControllerResult => {
    const { params: searchParams, provider } = useSearch();
    const isLoading = useRef(true);
    const [response, setResponse] = useState<Response>({
        total: 0,
        results: [],
    });

    const [query, queryModifiers] = useListParams({
        perPage: resultsPerPage,
        sort: { field: sortField, order: sortOrder } as SortPayload,
        resource: '',
        storeKey: false,
    });

    const {
        page,
        perPage,
        sort,
        order,
        filter,
        filterValues,
        displayedFilters,
    } = query;

    const { setFilters, hideFilter, showFilter, setPage, setPerPage, setSort } =
        queryModifiers;

    useEffect(() => {
        if (!provider) {
            return;
        }

        if (
            Object.keys(searchParams).length === 0 ||
            Object.values(searchParams).every(s => isEmpty(s))
        ) {
            //set empty response
            setResponse({ total: 0, results: [] });
            isLoading.current = false;
            return;
        }

        let copyOfSearchParams = JSON.parse(
            JSON.stringify(searchParams)
        ) as typeof searchParams;

        const params: GetListParams = {
            pagination: { page, perPage },
            sort: { field: sort, order: order } as SortPayload,
            filter: {},
            meta: groupedSearch ? { group: true } : {},
        };

        provider
            .search(copyOfSearchParams, params)
            .then(({ data, total }) => {
                if (groupedSearch) {
                    setResponse({
                        total: total || 0,
                        results: data.map(v => {
                            const groupInfo = v.keyGroup.split('_');
                            return {
                                ...v,
                                kind: groupInfo[0],
                                name: groupInfo[2],
                                type: v.docs[0].type,
                            };
                        }),
                    });
                } else {
                    setResponse({ total: total || 0, results: data });
                }
                isLoading.current = false;
            })
            .catch(error => {
                setResponse({ total: 0, results: [], error });
                isLoading.current = false;
            });
    }, [searchParams, page, perPage, sort, order, provider, groupedSearch]);

    //create Listcontext for pagination handling
    const listContext: ListControllerResult = {
        sort: { field: sort, order: order } as SortPayload,
        data: response.results,
        displayedFilters: displayedFilters,
        error: response.error,
        filter,
        filterValues: filterValues,
        hideFilter: hideFilter,
        isFetching: isLoading.current, //TODO ?
        isLoading: isLoading.current,
        isPending: false,
        onSelect: () => {},
        onToggleItem: () => {},
        onSelectAll: () => {},
        onUnselectItems: () => {},
        page: query.page,
        perPage: query.perPage,
        refetch: () => {},
        resource: '',
        selectedIds: [],
        setFilters: setFilters,
        setPage: setPage,
        setPerPage: setPerPage,
        setSort: setSort,
        showFilter: showFilter,
        total: response.total,
        hasNextPage: page * perPage < response.total,
        hasPreviousPage: page > 1,
    };

    return {
        listContext,
    };
};

type Response = {
    error?: any;
    total: number;
    results: any[];
};

export type SearchControllerProps = {
    resultsPerPage?: number;
    sortField?: string;
    sortOrder?: string;
    groupedSearch?: boolean;
};

export type SearchControllerResult = {
    listContext: ListControllerResult;
};
