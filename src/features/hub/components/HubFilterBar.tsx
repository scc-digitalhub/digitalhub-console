// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler

// SPDX-License-Identifier: Apache-2.0

import {
    useListContext,
    useTranslate,
    FilterForm,
    SearchInput,
    SelectArrayInput,
} from 'react-admin';
import { Box, Button, Chip, Typography, useTheme } from '@mui/material';
import { useMemo } from 'react';

interface HubFilterBarProps {
    availableFilters: Record<string, string[]>;
}

export const HubFilterBar = ({ availableFilters }: HubFilterBarProps) => {
    const translate = useTranslate();
    const theme = useTheme();

    const { filterValues, setFilters } = useListContext();

    const handleClearAll = () => {
        setFilters({ q: filterValues.q || '' });
    };

    const handleRemoveFilter = (category: string, value: string) => {
        const currentCatFilters = Array.isArray(filterValues[category])
            ? filterValues[category]
            : [];
        const newCatFilters = currentCatFilters.filter(
            (v: string) => v !== value
        );
        setFilters({ ...filterValues, [category]: newCatFilters });
    };

    const searchFilters = useMemo(
        () => [
            <SearchInput
                key="q"
                source="q"
                alwaysOn
                placeholder={translate('pages.hub.search', {
                    _: 'Search by name or description',
                })}
                sx={{ width: 300 }}
            />,
        ],
        [translate]
    );

    const filterInputs = useMemo(
        () =>
            Object.entries(availableFilters).map(([category, values]) => (
                <SelectArrayInput
                    key={category}
                    source={category}
                    label={category}
                    choices={values.map(val => ({ id: val, name: val }))}
                    alwaysOn
                />
            )),
        [availableFilters]
    );

    const activeFilterChips = useMemo(
        () =>
            Object.entries(filterValues).reduce<
                { category: string; value: string }[]
            >((acc, [category, values]) => {
                if (category === 'q' || !Array.isArray(values)) return acc;
                values.forEach(value => acc.push({ category, value }));
                return acc;
            }, []),
        [filterValues]
    );

    return (
        <Box sx={{ width: '100%', mb: 1 }}>
            <Box sx={{ mb: 1 }}>
                <FilterForm filters={searchFilters} />
            </Box>
            <Box sx={{ mt: 1 }}>
                <FilterForm filters={filterInputs} />
            </Box>
            {activeFilterChips.length > 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        mt: 3,
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500, mr: 0.5 }}
                    >
                        {translate('pages.hub.active_filters', {
                            _: 'Active Filters:',
                        })}
                    </Typography>

                    {activeFilterChips.map(({ category, value }) => (
                        <Chip
                            key={`${category}-${value}`}
                            size="small"
                            onDelete={() => handleRemoveFilter(category, value)}
                            label={
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontWeight: 'bold',
                                            textTransform: 'capitalize',
                                        }}
                                    >
                                        {category}:
                                    </Typography>
                                    <Typography variant="caption">
                                        {value}
                                    </Typography>
                                </Box>
                            }
                            sx={{
                                bgcolor: 'action.hover',
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 1,
                                height: 26,
                                '& .MuiChip-deleteIcon': {
                                    color: 'text.secondary',
                                    '&:hover': { color: 'error.main' },
                                },
                            }}
                        />
                    ))}

                    <Button
                        size="small"
                        onClick={handleClearAll}
                        sx={{
                            textTransform: 'none',
                            ml: 1,
                            minWidth: 'auto',
                            color: 'text.secondary',
                            '&:hover': {
                                color: 'error.main',
                                bgcolor: 'transparent',
                            },
                        }}
                    >
                        {translate('pages.hub.clear_all', { _: 'Clear all' })}
                    </Button>
                </Box>
            )}
        </Box>
    );
};
