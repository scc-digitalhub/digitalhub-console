import {
    Datagrid,
    Loading,
    TextField,
    Error,
    useList,
    ListContextProvider,
    Pagination,
    SortPayload,
} from 'react-admin';
import { useSearch } from '@dslab/ra-search-bar';
import { useEffect, useState } from 'react';
import { useRootSelector } from '@dslab/ra-root-selector';

export const SearchList = () => {
    const { params: searchParams, setParams, provider } = useSearch();
    console.log('context', searchParams);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(50);
    const [total, setTotal] = useState(1000);
    const [results, setResults] = useState<[]>([]);
    const [paginationState, setPaginationState] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const { root } = useRootSelector();
 
    useEffect(() => {
        let newSearch = JSON.parse(JSON.stringify(searchParams)) as typeof searchParams;
        const params = {
            pagination: { page, perPage },
            sort: { field: 'updated', order: 'DESC' } as SortPayload,
            filter: {},
        };
        if (!newSearch.fq) {
            newSearch.fq = [];
        }
        newSearch.fq.push({filter: `project:${root}`});
        provider.search(newSearch,params)
            .then(({ data }) => {
                setResults(data.content);
                setPerPage(data.pageable.pageSize);
                setTotal(data.totalElements);
                setPage(data.pageable.pageNumber);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            })
    }, [provider, searchParams, root]);

    const listContext = useList({ data: results, isLoading: loading });

    if (loading) return <Loading />;
    if (error) return <Error />;
    if (!results) return null;

    console.log('results', results);

    return (
        <ListContextProvider value={listContext}>
            <Datagrid expand={<></>} bulkActionButtons={false}>
                <TextField source="type" />
                <TextField source="metadata.name" />
                <TextField source="kind" />
                <TextField source="metadata.description" />
                <TextField source="metadata.updated" />
            </Datagrid>
            <Pagination />
            <Pagination 
                    page={page}
                    perPage={perPage}
                    setPage={setPage}
                    total={total} />
        </ListContextProvider>
    );
};
