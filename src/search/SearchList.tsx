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
    RichTextField,
    useTranslate,
    useResourceDefinitions,
    DateField,
} from 'react-admin';
import {
    Box,
    Chip,
    Container,
    FormControlLabel,
    Switch,
    Tooltip,
    Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { FlatCard } from '../components/FlatCard';
import { useSearchController } from './useSearchController';
import { useSearch } from './searchbar/SearchContext';
import { createElement, useState } from 'react';
import { NoResults } from './NoResults';
import { RowButtonGroup } from '../components/buttons/RowButtonGroup';
import { ChipsField } from '../components/ChipsField';
import { MultiField } from './MultiField';

const replaceWithHighlights = res => {
    //replace metadata fields with highlights
    if (res.highlights && Object.keys(res.highlights).length !== 0) {
        for (const [key, value] of Object.entries(res.highlights)) {
            res.metadata[key.split('.')[1]] = value;
        }
    }
};

export const SearchList = () => {
    const theme = useTheme();
    const translate = useTranslate();
    const [groupedSearch, setGroupedSearch] = useState<boolean>(false);
    const { listContext } = useSearchController({
        sortField: 'metadata.updated',
        sortOrder: 'DESC',
        groupedSearch,
    });

    if (listContext.isLoading) return <Loading />;
    if (listContext.error)
        return (
            <Error error={listContext.error} resetErrorBoundary={() => {}} />
        );
    if (!listContext.data) return null;

    if (groupedSearch) {
        listContext.data.forEach(res => {
            res.docs?.forEach(replaceWithHighlights);
        });
    } else {
        listContext.data.forEach(replaceWithHighlights);
    }

    const handleSwitch = (e: any) => {
        setGroupedSearch(e.target.checked);
    };

    return (
        <ListContextProvider value={listContext}>
            <Container maxWidth={false} sx={{ paddingTop: '18px', marginX: 0 }}>
                <ResultsHeader />
                <Box sx={{ textAlign: 'right' }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={groupedSearch}
                                onChange={handleSwitch}
                            />
                        }
                        label={translate('messages.search.group_results')}
                    />
                </Box>
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
                            '& .MultiField': {
                                padding: '0 !important',
                                height: 0,
                            },
                            '& .MultiFieldCell': {
                                border: 0,
                            },
                        }}
                    >
                        <IconResource />
                        <RichTextField
                            source="name"
                            label="fields.name.title"
                            sortable={false}
                        />
                        <TextField
                            source="kind"
                            label="fields.kind"
                            sortable={false}
                        />
                        {groupedSearch ? (
                            <MultiField
                                source="metadata.version"
                                label="fields.version.title"
                                component={RichTextField}
                                sortable={false}
                                noWrap
                                cellClassName="MultiField"
                            />
                        ) : (
                            <RichTextField
                                source="metadata.version"
                                label="fields.version.title"
                                sortable={false}
                            />
                        )}
                        {groupedSearch ? (
                            <MultiField
                                source="metadata.labels"
                                label="fields.labels.title"
                                component={ChipsField}
                                sortable={false}
                                cellClassName="MultiField"
                            />
                        ) : (
                            <ChipsField
                                source="metadata.labels"
                                label="fields.labels.title"
                                sortable={false}
                            />
                        )}
                        {groupedSearch ? (
                            <MultiField
                                source="metadata.updated"
                                label="fields.updated.title"
                                component={DateField}
                                showTime
                                cellClassName="MultiField"
                            />
                        ) : (
                            <DateField
                                source="metadata.updated"
                                label="fields.updated.title"
                                showTime
                            />
                        )}
                        {groupedSearch ? (
                            <MultiField
                                source=""
                                component={ShowResourceButton}
                                cellClassName="MultiField"
                            />
                        ) : (
                            <RowButtonGroup>
                                <ShowResourceButton />
                            </RowButtonGroup>
                        )}
                    </Datagrid>
                    <Pagination />
                </FlatCard>
            </Container>
        </ListContextProvider>
    );
};

const ShowResourceButton = () => {
    const record = useRecordContext();
    const definitions = useResourceDefinitions();
    let def = Object.entries(definitions).find(
        defPair => defPair[1].options.type == record?.type
    );
    return <ShowButton resource={def?.[0]} />;
};

const IconResource = () => {
    const record = useRecordContext();
    const definitions = useResourceDefinitions();
    let definition = Object.values(definitions).find(
        def => def.options.type == record?.type
    );
    return (
        <Tooltip title={record?.type.toLowerCase()}>
            {createElement(definition?.icon)}
        </Tooltip>
    );
};

const ResultsHeader = () => {
    const { params: searchParams, setParams } = useSearch();
    const translate = useTranslate();
    let current: string[] = [];

    searchParams.fq?.forEach(sf => {
        current.push(sf.filter);
    });

    const handleDelete = deletedFilter => {
        setParams({
            ...searchParams,
            fq: searchParams.fq
                ? searchParams.fq.filter(f => f.filter !== deletedFilter)
                : [],
        });
    };

    return (
        <Box sx={{ pb: 2, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ textAlign: 'left' }}>
                <Typography variant="h6" color={'secondary.light'}>
                    {translate('messages.search.current_filters')}
                </Typography>
            </Box>
            <Box>
                {current.map((s, i) => (
                    <Chip
                        label={s}
                        key={i}
                        sx={{ marginLeft: 1 }}
                        onDelete={() => handleDelete(s)}
                    />
                ))}
            </Box>
        </Box>
    );
};
