// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';
import { ListContextProvider, useList } from 'react-admin';
import { HubLayout } from './HubLayout';
 const CATALOG_URL: string =
(globalThis as any).REACT_APP_HUB_CATALOG_URL ||
(process.env.REACT_APP_HUB_CATALOG_URL as string)

const extractFilters = (items: any[]): Record<string, string[]> => {
    const filters: Record<string, Set<string>> = {};
    items.forEach(item => {
        (item.metadata?.labels || []).forEach((label: string) => {
            const [key, value] = label.split(':');
            if (key && value) {
                if (!filters[key]) filters[key] = new Set();
                filters[key].add(value);
            }
        });
    });
    return Object.fromEntries(
        Object.entries(filters).map(([k, v]) => [k, Array.from(v)])
    );
};

export const HubPage = () => {
    const [filterValues, setFilterValues] = useState<Record<string, any>>({});
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
    const [catalogData, setCatalogData] = useState<any>(null);

    useEffect(() => {
        fetch(CATALOG_URL)
            .then(res => res.json())
            .then(data => {
                console.log('Catalog data loaded:', data);
                return setCatalogData(data);
            })

            .catch(err => console.error('Failed to load catalog:', err));
    }, []);

    const fullItems = useMemo(
        () => catalogData?.catalog?.functions || [],
        [catalogData]
    );
    const hubInfo = useMemo(
        () =>
            catalogData
                ? {
                      name: catalogData.name || '',
                      description: catalogData.description || '',
                  }
                : null,
        [catalogData]
    );
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
    }, [fullItems, filterValues]);

    const listContext = useList({ data: filteredItems });
    const availableFilters = useMemo(
        () => extractFilters(fullItems),
        [fullItems]
    );
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
        setFilters: setFilterValues,
        availableFilters,
        hubInfo,
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
