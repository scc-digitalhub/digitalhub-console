// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef, useState } from 'react';
import { GetListParams, SortPayload } from 'react-admin';
import { keyParser } from '../../utils/parsers';
import { useSearchProvider } from '../../../features/search/SearchContext';
import { SearchFilter } from '../../../features/search/SearchProvider';
import { StoreSearchItem } from './types';

export type StorePathSearchProps = {
    text: string;
    value: string;
    filters?: SearchFilter[];
    paused?: boolean;
    resultsPerPage?: number;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
    getOptionValue?: (item: StoreSearchItem) => string;
};

export const defaultGetOptionValue = (item: StoreSearchItem) =>
    item.key ?? item.path ?? String(item.id);

const escapeSolr = (value: string) =>
    value.replace(/([+\-&|!(){}[\]^"~*?:\\/\s])/g, '\\$1');

const buildIncrementalQuery = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || trimmed.includes('://')) return '';
    return `${escapeSolr(trimmed)}*`;
};

const buildStoreSearchParams = (
    text: string,
    value: string,
    filters?: SearchFilter[]
): { q: string; fq?: SearchFilter[]; isResolve: boolean } | null => {
    // 1. Resolve an existing store:// URI (edit, template or paste):
    // search by name and narrow down to the exact id when available
    if (value.startsWith('store://')) {
        try {
            const parts = keyParser(value);
            const q = parts.name ? buildIncrementalQuery(parts.name) : '';
            if (!q) return null;
            const fq = [
                ...(filters ?? []),
                ...(parts.id ? [{ filter: `id:"${parts.id}"` }] : []),
            ];
            return { q, fq, isResolve: true };
        } catch {
            return null;
        }
    }

    // 2. Incremental search from free text
    const q = buildIncrementalQuery(text);
    if (!q) return null;

    return { q, fq: filters, isResolve: false };
};

// Return the same reference when already empty, to avoid useless re-renders
const clearOptions = (prev: StoreSearchItem[]) => (prev.length ? [] : prev);

export const useStorePathSearch = ({
    text,
    value,
    filters,
    paused = false,
    resultsPerPage = 15,
    sortField = 'metadata.updated',
    sortOrder = 'DESC',
    getOptionValue = defaultGetOptionValue,
}: StorePathSearchProps) => {
    const provider = useSearchProvider();
    const [options, setOptions] = useState<StoreSearchItem[]>([]);
    const [resolved, setResolved] = useState<StoreSearchItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // Latest getter without re-triggering the search effect
    const getOptionValueRef = useRef(getOptionValue);
    getOptionValueRef.current = getOptionValue;

    // Stable dependency: callers may pass a new (but equal) filters array on every render
    const filtersKey = JSON.stringify(filters ?? []);

    useEffect(() => {
        let active = true;
        setError(false);

        if (paused || !provider) {
            setOptions(clearOptions);
            setLoading(false);
            return;
        }

        const currentFilters: SearchFilter[] = JSON.parse(filtersKey);
        const searchQuery = buildStoreSearchParams(
            text,
            value,
            currentFilters.length ? currentFilters : undefined
        );
        if (!searchQuery) {
            setResolved(null);
            setOptions(clearOptions);
            setLoading(false);
            return;
        }

        const { isResolve, ...searchParams } = searchQuery;

        const listParams: GetListParams = {
            pagination: { page: 1, perPage: isResolve ? 50 : resultsPerPage },
            sort: { field: sortField, order: sortOrder } as SortPayload,
            filter: {},
        };

        // Previous options are kept visible while the new request is pending
        const timer = setTimeout(
            () => {
                setLoading(true);
                provider
                    .search(searchParams, listParams)
                    .then(({ data }) => {
                        if (!active) return;
                        const items = data as StoreSearchItem[];
                        if (isResolve) {
                            setResolved(
                                items.find(
                                    item =>
                                        getOptionValueRef.current(item) ===
                                        value
                                ) ?? null
                            );
                            setOptions(clearOptions);
                        } else {
                            setOptions(items);
                        }
                    })
                    .catch(() => {
                        if (active) setError(true);
                    })
                    .finally(() => {
                        if (active) setLoading(false);
                    });
            },
            isResolve ? 0 : 300
        );

        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [
        text,
        value,
        filtersKey,
        paused,
        resultsPerPage,
        sortField,
        sortOrder,
        provider,
    ]);

    return { options, loading, error, resolved };
};
