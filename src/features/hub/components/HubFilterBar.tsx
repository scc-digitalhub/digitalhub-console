// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler

// SPDX-License-Identifier: Apache-2.0

import {
    useListContext,
    useTranslate,
    FilterForm,
    ListNoResults,
    SelectArrayInput,
    TextInput,
} from 'react-admin';
import { Box } from '@mui/material';
import { useMemo } from 'react';
import { ALL_TYPES } from '../types';

interface HubFilterBarProps {
    availableFilters: Record<string, string[]>;
    showTypeFilter?: boolean;
}

export const HubFilterBar = ({
    availableFilters,
    showTypeFilter,
}: HubFilterBarProps) => {
    const translate = useTranslate();
    const { filterValues, total } = useListContext();
    //free text search filter
    const searchFilters = useMemo(
        () => [
            <TextInput
                key="q"
                source="q"
                label={translate('pages.hub.search.title')}
                alwaysOn
                resettable
            />,
        ],
        [translate]
    );

    //filters for each category
    //select multiple values
    const filterInputs = useMemo(
        () =>
            Object.entries(availableFilters).map(([category, values]) => (
                <SelectArrayInput
                    key={category}
                    source={category}
                    choices={values.map(val => ({ id: val, name: val }))}
                    alwaysOn
                    sx={{
                        '& .MuiInputLabel-root:not(.MuiInputLabel-shrink)': {
                            transform: 'none',
                            bottom: 0,
                            left: 10,
                            display: 'flex',
                            alignItems: 'center',
                        },
                    }}
                />
            )),
        [availableFilters]
    );

    const hasActiveFilters = useMemo(
        () =>
            Object.entries(filterValues).some(([key, value]) => {
                if (key === 'q') return !!String(value || '').trim();
                return Array.isArray(value) ? value.length > 0 : !!value;
            }),
        [filterValues]
    );
    //if I'm in the generic hub page. show type filter,
    //  otherwise if I'm already filtering by type, hide it
    const typeFilter = useMemo(
        () =>
            showTypeFilter
                ? [
                      <SelectArrayInput
                          key="resourceType"
                          source="resourceType"
                          label="Resource Type"
                          choices={ALL_TYPES.map(t => ({ id: t, name: t }))}
                          alwaysOn
                      />,
                  ]
                : [],
        [showTypeFilter]
    );
    const showNoFilteredResults = hasActiveFilters && (total || 0) === 0;

    return (
        <Box>
            <Box sx={{ mb: 1 }}>
                <FilterForm filters={searchFilters} />
            </Box>
            {showTypeFilter && (
                <Box>
                    <FilterForm filters={typeFilter} />
                </Box>
            )}
            <Box>
                <FilterForm filters={filterInputs} />
            </Box>
            {showNoFilteredResults && <ListNoResults resource="hub" />}
        </Box>
    );
};
