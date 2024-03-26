import {
    Datagrid,
    Loading,
    TextField,
    Error,
    ListContextProvider,
    Pagination,
    SortPayload,
    ShowButton,
    useRecordContext,
    useListParams,
    ListControllerResult,
} from 'react-admin';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import TableChartIcon from '@mui/icons-material/TableChart';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useSearch } from '@dslab/ra-search-bar';
import { useEffect, useState } from 'react';
import { useRootSelector } from '@dslab/ra-root-selector';
import { RowButtonGroup } from './RowButtonGroup';
import { Container, Tooltip } from '@mui/material';

const mapTypes = {
    function: {
        plural: 'functions',
        icon: (
            <Tooltip title="function">
                <ElectricBoltIcon />
            </Tooltip>
        ),
    },
    artifact: {
        plural: 'artifacts',
        icon: (
            <Tooltip title="artifact">
                <TableChartIcon />
            </Tooltip>
        ),
    },
    dataitem: {
        plural: 'dataitems',
        icon: (
            <Tooltip title="dataitem">
                <InsertDriveFileIcon />
            </Tooltip>
        ),
    },
};
export const SearchList = () => {
    const { params: searchParams, setParams, provider } = useSearch();
    console.log('context', searchParams);
    // const [page, setPage] = useState(1);
    // const [perPage, setPerPage] = useState(5);
    const [total, setTotal] = useState(1000);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const { root } = useRootSelector();

    const [query, queryModifiers] = useListParams({
        perPage: 5,
        sort: { field: 'updated', order: 'DESC' } as SortPayload,
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
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
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
        isFetching: loading, //TODO ?
        isLoading: loading,
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

    if (loading) return <Loading />;
    if (error) return <Error />;
    if (!results) return null;

    console.log('results', total, results);

    return (
        <ListContextProvider value={listContext}>
            <Container>
                <Datagrid
                    bulkActionButtons={false}
                    className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root RaList-content css-bhp9pd-MuiPaper-root-MuiCard-root"
                >
                    <IconResource />
                    {/* <TextField source="type" label="Type"/> */}
                    <TextField source="metadata.name" label="Name" />
                    <TextField source="kind" label="Kind" />
                    <TextField
                        source="metadata.description"
                        label="Description"
                    />
                    <TextField source="metadata.updated" label="Updated" />
                    <RowButtonGroup>
                        <ShowResourceButton />
                    </RowButtonGroup>
                </Datagrid>
                <Pagination />
            </Container>
        </ListContextProvider>
    );
};

const ShowResourceButton = () => {
    const record = useRecordContext();
    return <ShowButton resource={mapTypes[record.type].plural} />;
};
const IconResource = () => {
    const record = useRecordContext();
    return <>{mapTypes[record.type].icon}</>;
};
