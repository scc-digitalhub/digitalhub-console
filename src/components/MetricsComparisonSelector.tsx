import { Box } from '@mui/material';
import {
    Button,
    Datagrid,
    DateField,
    FilterPayload,
    InfiniteListControllerResult,
    InfinitePagination,
    InfinitePaginationContext,
    ListContextProvider,
    ListView,
    TextField,
    Toolbar,
    useInfiniteListController,
    useListContext,
    useRecordContext,
} from 'react-admin';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';

type ListToolbarProps = {
    startComparison: (ids: any[]) => void;
    getPreviousAndClose: () => any[];
};

const ListToolbar = (props: ListToolbarProps) => {
    const { startComparison, getPreviousAndClose } = props;
    const { data, selectedIds, onSelect } = useListContext();

    const selectedData = data
        ? data.filter(d => selectedIds.includes(d.id))
        : [];

    const applySelection = () => {
        startComparison(selectedData);
    };

    const reset = () => {
        onSelect(getPreviousAndClose().map(d => d.id));
    };

    return (
        <Toolbar sx={{ justifyContent: 'space-between', marginBottom: '16px' }}>
            <Button
                label="actions.apply"
                onClick={applySelection}
                variant="contained"
            >
                <KeyboardArrowRightIcon />
            </Button>
            <Button label="ra.action.cancel" onClick={reset}>
                <CloseIcon />
            </Button>
        </Toolbar>
    );
};

export type SelectorProps = {
    filter?: FilterPayload,
    /**
     * The filter inputs to display in the comparison selector.
     *
     * @see https://marmelab.com/react-admin/List.html#filters-filter-inputs
     */
    filters?:
        | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        | React.ReactElement<any, string | React.JSXElementConstructor<any>>[];
    /**
     * The content of the datagrid in the comparison selector. Must be an array of nodes.
     * Defaults to filtering on name and metadata.created
     */
    datagridFields?: React.ReactNode;
    /**
     * Filter function that will be applied to comparison selector data after fetching them.
     * Must match the predicate expected by Array.filter
     * Defaults to filtering out the current record.
     */
    postFetchFilter?: (value: any, index?: number, array?: any[]) => boolean;
};

type MetricsComparisonSelectorProps = ListToolbarProps & SelectorProps;

export const MetricsComparisonSelector = (
    props: MetricsComparisonSelectorProps
) => {
    const {
        filter,
        filters,
        datagridFields = defaultDatagridFields,
        postFetchFilter = res => res.id != record?.id,
        ...toolbarProps
    } = props;
    const record = useRecordContext();
    const listContext: InfiniteListControllerResult = useInfiniteListController(
        {
            disableSyncWithLocation: true,
            storeKey: false,
            filter: filter,
        }
    );

    console.log('list context', listContext);

    const filteredListContext = {
        ...listContext,
        data: listContext.data?.filter(postFetchFilter),
    };

    return (
        <ListContextProvider value={filteredListContext}>
            <InfinitePaginationContext.Provider
                value={{
                    hasNextPage: filteredListContext.hasNextPage,
                    fetchNextPage: filteredListContext.fetchNextPage,
                    isFetchingNextPage: filteredListContext.isFetchingNextPage,
                    hasPreviousPage: filteredListContext.hasPreviousPage,
                    fetchPreviousPage: filteredListContext.fetchPreviousPage,
                    isFetchingPreviousPage:
                        filteredListContext.isFetchingPreviousPage,
                }}
            >
                <ListView
                    component={Box}
                    actions={false}
                    filters={filters}
                    pagination={<InfinitePagination />}
                    sx={{ paddingTop: filters ? 0 : '16px' }}
                >
                    <Datagrid bulkActionButtons={<EmptyBulkActions />}>
                        {datagridFields}
                    </Datagrid>
                </ListView>
                <ListToolbar {...toolbarProps} />
            </InfinitePaginationContext.Provider>
        </ListContextProvider>
    );
};

const EmptyBulkActions = () => {
    return <span />;
};

const defaultDatagridFields: React.ReactNode = [
    <TextField
        source="name"
        label="fields.name.title"
        sortable={false}
        key={'df1'}
    />,
    <DateField
        source="metadata.created"
        showTime
        label="fields.metadata.created"
        key={'df2'}
    />,
];
