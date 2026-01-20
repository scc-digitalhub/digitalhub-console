// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { useEffect, useRef, useState } from 'react';
import {
    ListControllerResult,
    SortPayload,
    useDataProvider,
    useListParams,
} from 'react-admin';
import { RunIdsResult } from './types';

export const useTriggerRunsController = (
    runs: RunIdsResult,
    resultsPerPage: number = 5
): ListControllerResult => {
    const dataProvider = useDataProvider();
    const { root } = useRootSelector();
    const [data, setData] = useState<any[]>([]);
    const isLoading = useRef(true);
    const error = useRef<any>(null);

    const [query, queryModifiers] = useListParams({
        perPage: resultsPerPage,
        resource: '',
        storeKey: false,
        disableSyncWithLocation: true,
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
        if (runs.isLoading || runs.error || !dataProvider) return;

        isLoading.current = true;
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const pageItems = runs.data.slice(startIndex, endIndex);

        const promises = pageItems.map(r =>
            dataProvider.getOne('runs', { id: r, meta: { root } })
        );

        Promise.all(promises)
            .then(values => {
                setData(values.map(v => v.data));
                isLoading.current = false;
            })
            .catch(error => {
                setData([]);
                isLoading.current = false;
                error.current = error;
            });
    }, [dataProvider, page, perPage, runs, root]);

    return {
        sort: { field: sort, order: order } as SortPayload,
        data,
        displayedFilters: displayedFilters,
        error: error.current,
        filter,
        filterValues: filterValues,
        hideFilter: hideFilter,
        isFetching: isLoading.current,
        isLoading: isLoading.current,
        isPending: false,
        onSelect: () => {},
        onToggleItem: () => {},
        onSelectAll: () => {},
        onUnselectItems: () => {},
        page: page,
        perPage: perPage,
        refetch: () => {},
        resource: '',
        selectedIds: [],
        setFilters: setFilters,
        setPage: setPage,
        setPerPage: setPerPage,
        setSort: setSort,
        showFilter: showFilter,
        total: runs.data.length,
        hasNextPage: page * perPage < runs.data.length,
        hasPreviousPage: page > 1,
    };
};
