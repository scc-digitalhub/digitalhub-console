// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';
import { ListContextProvider, useList } from 'react-admin';
import { HubLayout } from './HubLayout';
import { useHubResources } from '../useHubResources';

//load catalog url from env variable, with fallback to globalThis for older react-scripts versions that don't support env variables starting with REACT_APP
const CATALOG_URL: string =
    (globalThis as any).REACT_APP_HUB_CATALOG_URL ||
    (process.env.REACT_APP_HUB_CATALOG_URL as string);

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
//type of resource passed as prop to filter by type and show/hide type filter
interface HubPageProps {
    resourceName?: string;
}

export const HubPage = ({ resourceName }: HubPageProps) => {
    const [filterValues, setFilterValues] = useState<Record<string, any>>({});
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
    const [catalogData, setCatalogData] = useState<any>(null);

    const hubResources = useHubResources();
    const currentResource = useMemo(
        () => hubResources.find(r => r.name === resourceName) ?? null,
        [hubResources, resourceName]
    );
    //download the catalog only once
    useEffect(() => {
        fetch(CATALOG_URL)
            .then(res => res.json())
            .then(data => setCatalogData(data))
            .catch(err => console.error('Failed to load catalog:', err));
    }, []);

    //prepare the list of items to show based on the catalog and
    //the selected resource type, adding the resourceName as property to each item for easier filtering later
    //if resourceName is not specified, show all items from all types  
    const fullItems = useMemo(() => {
        if (!catalogData?.catalog) return [];

        if (currentResource) {
            return (catalogData.catalog[currentResource.catalogKey] || []).map(
                (item: any) => ({
                    ...item,
                    resourceName: currentResource.name,
                    catalogKey: currentResource.catalogKey,
                })
            );
        }

        return hubResources.flatMap(res =>
            (catalogData.catalog[res.catalogKey] || []).map((item: any) => ({
                ...item,
                resourceName: res.name,       
                catalogKey: res.catalogKey,   

            }))
        );
    }, [catalogData, currentResource, hubResources]);
    //filter items based on search query, resource type filter and other label filters
    //useMemo for performance optimization, so that filtering is only recalculated when fullItems or filterValues change
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
            if (filterValues.resourceName?.length > 0) {
                if (!filterValues.resourceName.includes(item.resourceName))
                    return false;
            }
            const activeCats = Object.keys(filterValues).filter(
                c =>
                    c !== 'q' &&
                    c !== 'resourceName' &&
                    filterValues[c]?.length > 0
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

    //prepare the context value for the list, including the filtered items, 
    // filter values and available filters extracted from the full list of items
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

    //data filtered
    //filters
    //function to set filters
    //available filters extracted from the catalog
    //selected template
    //function to set selected template

    const customContext = {
        ...listContext,
        filterValues,
        setFilters: setFilterValues,
        availableFilters,
        selectedTemplate: activeTemplate,
        setSelectedTemplate,
    } as any;
//showTypeFilter for showing filter by resource or not, generic hub page shows the filter, 
// while specific pages for resource types hide it, since they are already filtered by type
//resourceName for title, subtitle and description
    return (
        <ListContextProvider value={customContext}>
            <HubLayout
                showTypeFilter={!resourceName}   
                resourceName={resourceName}
            />
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
