import { Box } from '@mui/material';
import {
    Button,
    Datagrid,
    DateField,
    ListBase,
    ListView,
    SelectInput,
    TextField,
    TextInput,
    Toolbar,
    useListContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CloseIcon from '@mui/icons-material/Close';
import { StateColors } from './StateChips';

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

type MetricsComparisonSelectorProps = {
    toolbarProps: ListToolbarProps;
};

export const MetricsComparisonSelector = (props: MetricsComparisonSelectorProps) => {
    const { toolbarProps } = props;
    const translate = useTranslate();
    const resource = useResourceContext();

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
        <ListBase resource={resource} disableSyncWithLocation storeKey={false}>
            <ListView component={Box} actions={false} filters={postFilters}>
                <Datagrid bulkActionButtons={<span />}>
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
        </ListBase>
    );
};
