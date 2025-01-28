import { Box } from '@mui/material';
import {
    Button,
    Datagrid,
    DateField,
    InfiniteListControllerResult,
    InfinitePagination,
    InfinitePaginationContext,
    ListContextProvider,
    ListView,
    SelectInput,
    TextField,
    TextInput,
    Toolbar,
    useInfiniteListController,
    useListContext,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CloseIcon from '@mui/icons-material/Close';
import { StateColors } from './StateChips';
import { functionParser } from '../common/helper';

type ListToolbarProps = {
    startComparison: (ids: any[]) => void;
    getPreviousAndClose: () => any[];
};

const ListToolbar = (props: ListToolbarProps) => {
    const { startComparison, getPreviousAndClose } = props;
    const { selectedIds, onSelect } = useListContext();

    const applySelection = () => {
        startComparison(selectedIds);
    };

    const reset = () => {
        onSelect(getPreviousAndClose());
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

type MetricsComparisonSelectorProps = ListToolbarProps & {
    functionName: string;
};

export const MetricsComparisonSelector = (
    props: MetricsComparisonSelectorProps
) => {
    const { functionName, ...toolbarProps } = props;
    const translate = useTranslate();
    const record = useRecordContext();
    const listContext: InfiniteListControllerResult = useInfiniteListController(
        {
            disableSyncWithLocation: true,
            storeKey: false,
        }
    );

    const filteredListContext = {
        ...listContext,
        data: listContext.data?.filter(
            res =>
                functionParser(res.spec.function).functionName ==
                    functionName && res.id != record?.id
        ),
    };

    const states: any[] = [];
    for (const c in StateColors) {
        states.push({ id: c, name: translate('states.' + c.toLowerCase()) });
    }

    const postFilters = [
        <TextInput
            label="fields.name.title"
            source="q"
            alwaysOn
            resettable
            key={1}
        />,
        <SelectInput
            alwaysOn
            key={3}
            label="fields.status.state"
            source="state"
            choices={states}
            sx={{ '& .RaSelectInput-input': { margin: '0px' } }}
        />,
    ];

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
                    filters={postFilters}
                    pagination={<InfinitePagination />}
                >
                    <Datagrid bulkActionButtons={<EmptyBulkActions />}>
                        <TextField
                            source="name"
                            label="fields.name.title"
                            sortable={false}
                        />
                        <DateField
                            source="metadata.created"
                            showTime
                            label="fields.metadata.created"
                        />
                        <TextField
                            source="spec.task"
                            label="fields.task.title"
                            sortable={false}
                        />
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
