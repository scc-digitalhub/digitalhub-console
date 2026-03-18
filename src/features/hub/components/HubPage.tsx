// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';
import { ListContextProvider, useList } from 'react-admin';
import { HubLayout } from './HubLayout';
import { HubResourceType } from '../types';
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
interface HubPageProps {
    resourceType?: HubResourceType; 
}

export const ALL_TYPES: HubResourceType[] = ['functions', 'datasets', 'models', 'artifacts', 'projects'];

export const HubPage = ({ resourceType }: HubPageProps) => {
    const [filterValues, setFilterValues] = useState<Record<string, any>>({});
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
    const [catalogData, setCatalogData] = useState<any>(null);

    useEffect(() => {
        fetch(CATALOG_URL)
            .then(res => res.json())
            .then(data => setCatalogData(data))
            .catch(err => console.error('Failed to load catalog:', err));
    }, []);

    const fullItems = useMemo(() => {
        if (!catalogData?.catalog) return [];

        if (resourceType) {
            return (catalogData.catalog[resourceType] || []).map(item => ({
                ...item,
                resourceType: resourceType,
            }));
        }

        return ALL_TYPES.flatMap(type =>
            (catalogData.catalog[type] || []).map(item => ({
                ...item,
                resourceType: type,
            }))
        );
    }, [catalogData, resourceType]);
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
                if (filterValues.resourceType?.length > 0) {
                    if (!filterValues.resourceType.includes(item.resourceType)) return false;
                }
                const activeCats = Object.keys(filterValues).filter(
                    c => c !== 'q' && c !== 'resourceType' && filterValues[c]?.length > 0
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
        selectedTemplate: activeTemplate,
        setSelectedTemplate,
    } as any;

    return (
        <ListContextProvider value={customContext}>
            <HubLayout 
            showTypeFilter={!resourceType} 
            resourceType={resourceType} />
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
