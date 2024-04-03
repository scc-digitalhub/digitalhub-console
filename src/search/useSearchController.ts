import { useRootSelector } from '@dslab/ra-root-selector';
import { useSearch } from '@dslab/ra-search-bar';
import { useEffect, useState } from 'react';
import { ListControllerResult, SortPayload, useListParams } from 'react-admin';

export const useSearchController = ({
    resultsPerPage = 5,
    sortField = 'id',
    sortOrder = 'ASC',
}: SearchControllerProps = {}): SearchcontrollerResult => {
    const { params: searchParams, provider } = useSearch();
    const { root } = useRootSelector();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();
    const [total, setTotal] = useState(0);
    const [results, setResults] = useState<any[]>([]);

    console.log('context', searchParams);

    const [query, queryModifiers] = useListParams({
        perPage: resultsPerPage,
        sort: { field: sortField, order: sortOrder } as SortPayload,
        resource: '',
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
        let newSearch = JSON.parse(
            JSON.stringify(searchParams)
        ) as typeof searchParams;
        const params = {
            pagination: { page, perPage },
            sort: { field: sort, order: order } as SortPayload,
            filter: {},
        };
        if (!newSearch.fq) {
            newSearch.fq = [];
        }
        newSearch.fq.push({ filter: `project:${root}` });
        provider
            .search(newSearch, params)
            .then(({ data, total }) => {
                setResults(data);
                if (total) {
                    setTotal(total);
                }
                setIsLoading(false);
            })
            .catch(error => {
                setError(error);
                setIsLoading(false);
            });
    }, [provider, searchParams, root, page, perPage, sort, order]);

    //create Listcontext for pagination handling
    const listContext: ListControllerResult = {
        sort: { field: sort, order: order } as SortPayload,
        data: results,
        displayedFilters: displayedFilters,
        error,
        filter,
        filterValues: filterValues,
        hideFilter: hideFilter,
        isFetching: isLoading, //TODO ?
        isLoading: isLoading,
        onSelect: () => {},
        onToggleItem: () => {},
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
        total: total,
        hasNextPage: page * perPage < total,
        hasPreviousPage: page > 1,
    };

    return {
        error,
        isLoading,
        listContext,
    };
};

export type SearchControllerProps = {
    resultsPerPage?: number;
    sortField?: string;
    sortOrder?: string;
};

export type SearchcontrollerResult = {
    error?: any;
    isLoading: boolean;
    listContext: ListControllerResult;
};
