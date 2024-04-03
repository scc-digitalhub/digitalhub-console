import {
    Datagrid,
    Loading,
    TextField,
    Error,
    ListContextProvider,
    Pagination,
    ShowButton,
    useRecordContext,
    DateField,
} from 'react-admin';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import TableChartIcon from '@mui/icons-material/TableChart';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Inbox from '@mui/icons-material/Inbox';
import { RowButtonGroup } from '../components/RowButtonGroup';
import { Container, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FlatCard } from '../components/FlatCard';
import { useSearchController } from './useSearchController';

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
    const { error, isLoading, listContext } = useSearchController({
        sortField: 'updated',
        sortOrder: 'DESC',
    });

    if (isLoading) return <Loading />;
    if (error) return <Error error={error} resetErrorBoundary={() => {}} />;
    if (!listContext.data) return null;
    if (listContext.data.length === 0) return <NoResults />;

    console.log('results', listContext.total, listContext.data);

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
                        <DateField source="metadata.updated" label="Updated" showTime />
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
    return mapTypes[record.type].icon;
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
