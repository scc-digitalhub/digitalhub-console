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
import Inbox from '@mui/icons-material/Inbox';
import { useSearch } from '@dslab/ra-search-bar';
import { useEffect, useState } from 'react';
import { useRootSelector } from '@dslab/ra-root-selector';
import { RowButtonGroup } from '../components/RowButtonGroup';
import { Container, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FlatCard } from '../components/FlatCard';

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
    const { params: searchParams, provider } = useSearch();
    console.log('context', searchParams);
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

    if (loading) return <Loading />;
    if (error) return <Error error={error} resetErrorBoundary={() => {}} />;
    if (!results) return null;
    if (results.length === 0) return <NoResults />;

    console.log('results', total, results);

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

    return (
        <ListContextProvider value={listContext}>
            <Container maxWidth={false} sx={{ paddingTop: '18px', marginX: 0 }}>
                <FlatCard sx={{ paddingY: '18px' }}>
                    <Datagrid bulkActionButtons={false}>
                        <IconResource />
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
                </FlatCard>
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

const NoResults = () => {
    const emptyMessage = 'Your search gave no results';

    return (
        <Root className="RaList-noResults">
            <div className={EmptyClasses.message}>
                <Inbox className={EmptyClasses.icon} />
                <Typography variant="h4" paragraph>
                    {emptyMessage}
                </Typography>
            </div>
        </Root>
    );
};

const PREFIX = 'RaEmpty';

export const EmptyClasses = {
    message: `${PREFIX}-message`,
    icon: `${PREFIX}-icon`,
};

const Root = styled('span', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    flex: 1,
    [`& .${EmptyClasses.message}`]: {
        textAlign: 'center',
        opacity: theme.palette.mode === 'light' ? 0.5 : 0.8,
        margin: '0 1em',
        color:
            theme.palette.mode === 'light'
                ? 'inherit'
                : theme.palette.text.primary,
    },

    [`& .${EmptyClasses.icon}`]: {
        width: '9em',
        height: '9em',
    },
}));
