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

interface HubFilterBarProps {
    availableFilters: Record<string, string[]>;
}

export const HubFilterBar = ({ availableFilters }: HubFilterBarProps) => {
    const translate = useTranslate();
    const { filterValues, total } = useListContext();

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

    const showNoFilteredResults = hasActiveFilters && (total || 0) === 0;

    return (
        <Box>
            <Box sx={{ mb: 1 }}>
                <FilterForm filters={searchFilters} />
            </Box>
            <Box>
                <FilterForm filters={filterInputs} />
            </Box>

            {showNoFilteredResults && (
                <Box>
                    <ListNoResults resource="functions" />
                </Box>
            )}
        </Box>
    );
};
