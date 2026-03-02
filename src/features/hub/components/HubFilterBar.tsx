// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler

// SPDX-License-Identifier: Apache-2.0

import {
    useListContext,
    useTranslate,
    FilterForm,
    SearchInput,
} from 'react-admin';
import { Box, Button, Chip, Typography, useTheme } from '@mui/material';
import { FilterDropdown } from './FilterDropdown';

interface HubFilterBarProps {
    availableFilters: Record<string, string[]>;
}

export const HubFilterBar = ({ availableFilters }: HubFilterBarProps) => {
    const translate = useTranslate();
    const theme = useTheme();

    const { filterValues, setFilters } = useListContext();

    const handleToggle = (category: string, value: string) => {
        const currentCatFilters = filterValues[category] || [];
        const newCatFilters = currentCatFilters.includes(value)
            ? currentCatFilters.filter((v: string) => v !== value)
            : [...currentCatFilters, value];

        setFilters({ ...filterValues, [category]: newCatFilters });
    };

    const handleClearAll = () => {
        setFilters({ q: filterValues.q || '' });
    };

    const activeFilters = Object.entries(filterValues).filter(
        ([key, vals]) => key !== 'q' && Array.isArray(vals) && vals.length > 0
    );

    const searchFilters = [
        <SearchInput
            key="q"
            source="q"
            alwaysOn
            placeholder={translate('pages.hub.search', {
                _: 'Search by name or description',
            })}
            sx={{ width: 300 }}
        />,
    ];

    return (
        <Box sx={{ width: '100%', mb: 1 }}>
            {' '}
            <Box sx={{ mb: 3 }}>
                <FilterForm filters={searchFilters} />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    gap: 1,
                }}
            >
                {Object.entries(availableFilters).map(([category, values]) => (
                    <FilterDropdown
                        key={category}
                        category={category}
                        values={values}
                        filterValues={filterValues}
                        handleToggle={handleToggle}
                    />
                ))}
            </Box>
            {activeFilters.length > 0 && (
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

                    {activeFilters.flatMap(([category, values]) =>
                        (values as string[]).map(val => (
                            <Chip
                                key={`${category}-${val}`}
                                size="small"
                                onDelete={() => handleToggle(category, val)}
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
                                            {val}
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
                        ))
                    )}

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
