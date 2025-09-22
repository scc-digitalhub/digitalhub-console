// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

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
    useTranslate,
} from 'react-admin';
import Inbox from '@mui/icons-material/Inbox';
import { RowButtonGroup } from '../components/buttons/RowButtonGroup';
import { Box, Chip, Container, Tooltip, Typography } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { FlatCard } from '../components/FlatCard';
import { useSearchController } from './useSearchController';
import { useSearch } from './searchbar/SearchContext';
import { FunctionIcon } from '../resources/functions/icon';
import { ArtifactIcon } from '../resources/artifacts/icon';
import { DataItemIcon } from '../resources/dataitems/icon';
import { WorkflowIcon } from '../resources/workflows/icon';
import { ModelIcon } from '../resources/models/icon';

const mapTypes = {
    function: {
        plural: 'functions',
        icon: (
            <Tooltip title="function">
                <FunctionIcon />
            </Tooltip>
        ),
    },
    artifact: {
        plural: 'artifacts',
        icon: (
            <Tooltip title="artifact">
                <ArtifactIcon />
            </Tooltip>
        ),
    },
    dataitem: {
        plural: 'dataitems',
        icon: (
            <Tooltip title="dataitem">
                <DataItemIcon />
            </Tooltip>
        ),
    },
    workflow: {
        plural: 'workflows',
        icon: (
            <Tooltip title="workflow">
                <WorkflowIcon />
            </Tooltip>
        ),
    },
    model: {
        plural: 'models',
        icon: (
            <Tooltip title="model">
                <ModelIcon />
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
                    <Datagrid
                        bulkActionButtons={false}
                        empty={<NoResults />}
                        resource="searchres"
                        sx={{
                            '& em': {
                                backgroundColor: alpha(
                                    theme.palette?.primary?.main,
                                    0.3
                                ),
                            },
                        }}
                    >
                        <IconResource />
                        <RichTextField
                            source="metadata.name"
                            label="fields.name.title"
                        />
                        <TextField source="kind" label="fields.kind" />
                        <RichTextField
                            source="metadata.description"
                            label="fields.description.title"
                        />
                        <DateField
                            source="metadata.updated"
                            label="fields.updated.title"
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
    return (
        <ShowButton resource={mapTypes[record?.type.toLowerCase()].plural} />
    );
};

const IconResource = () => {
    const record = useRecordContext();
    return mapTypes[record?.type].icon;
};

const NoResults = () => {
    const translate = useTranslate();

    return (
        <Root className="RaList-noResults">
            <div className={EmptyClasses.message}>
                <Inbox className={EmptyClasses.icon} />
                <Typography
                    variant="h4"
                    component="p"
                    sx={{ marginBottom: '16px' }}
                >
                    {translate('messages.search.no_results')}
                </Typography>
            </div>
        </Root>
    );
};

const ResultsHeader = () => {
    const { params: searchParams } = useSearch();
    const translate = useTranslate();
    let current: string[] = [];

    searchParams.fq?.forEach(sf => {
        current.push(sf.filter);
    });

    return (
        <Box sx={{ pb: 2, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ textAlign: 'left' }}>
                <Typography variant="h6" color={'secondary.light'}>
                    {translate('messages.search.current_filters')}
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
