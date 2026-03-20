// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';
import {
    useListContext,
    useTranslate,
    FilterForm,
    SelectArrayInput,
    TextInput,
} from 'react-admin';
import { Box, Divider } from '@mui/material';
import { useHubResources } from '../useHubResources';

interface HubFilterBarProps {
    showTypeFilter?: boolean;
}

export const HubFilterBar = ({ showTypeFilter }: HubFilterBarProps) => {
    const translate = useTranslate();
    const { availableFilters } = useListContext() as any;
    const hubResources = useHubResources();
    const searchFilter = useMemo(
        () => [
            <TextInput
                key="q"
                source="q"
                label={translate('pages.hub.search.title')}
                alwaysOn
                resettable
                fullWidth
                helperText={false}
            />,
        ],
        [translate]
    );

    const typeFilter = useMemo(
        () =>
            showTypeFilter
                ? [
                      <SelectArrayInput
                          key="resourceName"
                          source="resourceName"
                          label="Resource Type"
                          choices={hubResources.map(r => ({
                              id: r.name,
                              name: r.name
                          }))}
                          alwaysOn
                          helperText={false}
                      />,
                  ]
                : [],
                [showTypeFilter, hubResources, translate]
            );

    const labelFilters = useMemo(
        () =>
            Object.entries(availableFilters || {}).map(([category, values]) => (
                <SelectArrayInput
                    key={category}
                    source={category}
                    label={category}
                    choices={(values as string[]).map(val => ({
                        id: val,
                        name: val,
                    }))}
                    sx={{
                        '& .MuiInputLabel-root:not(.MuiInputLabel-shrink)': {
                            transform: 'none',
                            bottom: 0,
                            left: 10,
                            display: 'flex',
                            alignItems: 'center',
                        },
                    }}
                    alwaysOn
                    helperText={false}
                />
            )),
        [availableFilters]
    );

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                width: '100%',
            }}
        >
            {/* search: full width */}
            <Box
                sx={{
                    width: '100%',
                    '& .RaFilterForm-filterFormInput': { width: '100%' },
                }}
            >
                <FilterForm filters={searchFilter} />
            </Box>

            {/* select filtri: wrap su più righe */}
            {(showTypeFilter || labelFilters.length > 0) && (
                <>
                    <Divider />
                    <Box
                        sx={{
                            flexWrap: 'wrap',
                            gap: 1,
                            '& .RaFilterForm-filterFormInput': {
                                minWidth: 160,
                                paddingTop: 0,
                            },
                        }}
                    >
                        <FilterForm
                            filters={[...typeFilter, ...labelFilters]}
                        />
                    </Box>
                </>
            )}
        </Box>
    );
};
