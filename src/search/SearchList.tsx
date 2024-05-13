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
    RichTextField,
} from 'react-admin';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import TableChartIcon from '@mui/icons-material/TableChart';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AccountTree from '@mui/icons-material/AccountTree';
import Inbox from '@mui/icons-material/Inbox';
import { RowButtonGroup } from '../components/RowButtonGroup';
import { Box, Chip, Container, Tooltip, Typography } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { FlatCard } from '../components/FlatCard';
import { useSearchController } from './useSearchController';
import { useSearch } from './searchbar/SearchContext';

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
    workflow: {
        plural: 'workflows',
        icon: (
            <Tooltip title="workflow">
                <AccountTree />
            </Tooltip>
        ),
    },
};

export const SearchList = () => {
    const theme = useTheme();
    const { listContext } = useSearchController({
        sortField: 'metadata.updated',
        sortOrder: 'DESC',
    });

    if (listContext.isLoading) return <Loading />;
    if (listContext.error)
        return (
            <Error error={listContext.error} resetErrorBoundary={() => {}} />
        );
    if (!listContext.data) return null;

    console.log('results', listContext.total, listContext.data);
    listContext.data.forEach(res => {
        //replace metadata fields with highlights
        if (res.highlights && Object.keys(res.highlights).length !== 0) {
            for (const [key, value] of Object.entries(res.highlights)) {
                res.metadata[key.split('.')[1]] = value;
            }
        }
    });

    return (
        <ListContextProvider value={listContext}>
            <Container maxWidth={false} sx={{ paddingTop: '18px', marginX: 0 }}>
                <ResultsHeader />
                <FlatCard sx={{ paddingY: '18px' }}>
                    <Datagrid bulkActionButtons={false} empty={<NoResults />}>
                        <IconResource />
                        <RichTextField
                            source="metadata.name"
                            label="Name"
                            sx={{
                                '& em': {
                                    backgroundColor: alpha(
                                        theme.palette?.primary?.main,
                                        0.3
                                    ),
                                },
                            }}
                        />
                        <TextField source="kind" label="Kind" />
                        <RichTextField
                            source="metadata.description"
                            label="Description"
                            sx={{
                                '& em': {
                                    backgroundColor: alpha(
                                        theme.palette?.primary?.main,
                                        0.3
                                    ),
                                },
                            }}
                        />
                        <DateField
                            source="metadata.updated"
                            label="Updated"
                            showTime
                        />
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

const ResultsHeader = () => {
    const { params: searchParams } = useSearch();
    let current: string[] = [];

    searchParams.fq?.forEach(sf => {
        current.push(sf.filter);
    });

    return (
        <Box sx={{ pb: 2, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ textAlign: 'left' }}>
                <Typography variant="h6" color={'secondary.light'}>
                    {'Current search filters:'}
                </Typography>
            </Box>
            <Box>
                {current.map((s, i) => (
                    <Chip label={s} key={i} sx={{ marginLeft: 1 }} />
                ))}
            </Box>
        </Box>
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
