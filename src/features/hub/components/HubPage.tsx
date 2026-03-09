// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useMemo, useState } from 'react';
import { ListContextProvider, useList } from 'react-admin';
import { HubLayout } from './HubLayout';
import catalogData from '../../../../data.json';

const fullItems = catalogData.catalog.functions;

const extractFilters = (items: any[]) => {
    const filters: Record<string, Set<string>> = {};
    items.forEach(item => {
        item.metadata?.labels?.forEach((label: string) => {
            const [category, value] = label.split(':');
            if (category && value) (filters[category] ??= new Set()).add(value);
        });
    });
    return Object.fromEntries(
        Object.entries(filters)
            .sort()
            .map(([k, v]) => [k, Array.from(v).sort()])
    );
};

export const HubPage = () => {
    const [filterValues, setFilterValues] = useState<Record<string, any>>({});
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

    const filteredItems = useMemo(() => {
        return fullItems.filter(item => {
            const searchLower = (filterValues.q || '').toLowerCase();
            if (
                searchLower &&
                ![
                    item.metadata?.name,
                    item.metadata?.description,
                    item.name,
                ].some(field =>
                    (field || '').toLowerCase().includes(searchLower)
                )
            )
                return false;

            const activeCats = Object.keys(filterValues).filter(
                c => c !== 'q' && filterValues[c]?.length > 0
            );
            if (!activeCats.length) return true;

            const labels = item.metadata?.labels || [];
            return activeCats.every(cat =>
                filterValues[cat].some((val: string) =>
                    labels.includes(`${cat}:${val}`)
                )
            );
        });
    }, [filterValues]);

    const listContext = useList({ data: filteredItems });

    const availableFilters = useMemo(() => extractFilters(fullItems), []);

    const activeTemplate = useMemo(() => {
        if (!selectedTemplate) return null;

        return (
            filteredItems.find(
                item =>
                    item.name === selectedTemplate.name &&
                    item.metadata?.version ===
                        selectedTemplate.metadata?.version
            ) || null
        );
    }, [filteredItems, selectedTemplate]);

    const customContext = {
        ...listContext,
        filterValues,
        setFilters: (filters: any) => setFilterValues(filters),
        availableFilters,
        hubInfo: {
            name: catalogData.name,
            description: catalogData.description,
        },
        selectedTemplate: activeTemplate,
        setSelectedTemplate,
    } as any;

    return (
        <ListContextProvider value={customContext}>
            <HubLayout />
        </ListContextProvider>
    );

    /* * FUTURE TODO:
     * In the future with dataProvider we can replace with:
     * return (
     * <ListBase resource="functions" >
     * <HubLayout />
     * </ListBase>
     * );
     */
};
