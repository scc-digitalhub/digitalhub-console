import { useEffect, useState } from 'react';
import { GetListParams, SortPayload } from 'react-admin';
import { keyParser } from '../../common/utils/parsers';
import { useSearchProvider } from './SearchContext';
import { SearchFilter, SearchRecord } from './SearchProvider';

export type StoreSearchItem = SearchRecord & {
    name?: string;
    type?: string;
    kind?: string;
    key?: string;
    path?: string;
};

export type StorePathSearchProps = {
    text: string;
    value: string;
    filters?: SearchFilter[];
    paused?: boolean;
    resultsPerPage?: number;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
};

const buildIncrementalQuery = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || trimmed.includes('://')) return '';
    const escaped = trimmed.replace(/([+\-&|!(){}[\]^"~*?:\\/])/g, '\\$1');
    return `${escaped}*`;
};

const buildStoreSearchParams = (
    text: string,
    value: string,
    filters?: SearchFilter[]
): { q: string; fq?: SearchFilter[]; isResolve: boolean } | null => {
    // 1. Risoluzione di un URI store:// già presente (es. in Edit o paste):
    // cerca per nome usando la stessa query q + filters che il backend supporta
    if (value.startsWith('store://')) {
        try {
            const parts = keyParser(value);
            const q = parts.name ? buildIncrementalQuery(parts.name) : '';
            if (!q) return null;
            return { q, fq: filters, isResolve: true };
        } catch {
            return null;
        }
    }

    // 2. Ricerca incrementale da testo libero
    const q = buildIncrementalQuery(text);
    if (!q) return null;

    return { q, fq: filters, isResolve: false };
};

export const useStorePathSearch = ({
    text,
    value,
    filters,
    paused = false,
    resultsPerPage = 15,
    sortField = 'metadata.updated',
    sortOrder = 'DESC',
}: StorePathSearchProps) => {
    const provider = useSearchProvider();
    const [options, setOptions] = useState<StoreSearchItem[]>([]);
    const [resolved, setResolved] = useState<StoreSearchItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        let active = true;
        setOptions([]);
        setLoading(false);
        setError(false);

        if (paused || !provider) return;

        const searchQuery = buildStoreSearchParams(text, value, filters);
        if (!searchQuery) {
            setResolved(null);
            return;
        }

        const { isResolve, ...searchParams } = searchQuery;

        const listParams: GetListParams = {
            pagination: { page: 1, perPage: isResolve ? 50 : resultsPerPage },
            sort: { field: sortField, order: sortOrder } as SortPayload,
            filter: {},
        };

        const timer = setTimeout(() => {
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
                                    (item.key ?? item.path ?? String(item.id)) ===
                                    value
                            ) ?? null
                        );
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
        }, isResolve ? 0 : 300);

        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [text, value, filters, paused, resultsPerPage, sortField, sortOrder, provider]);

    return { options, loading, error, resolved };
};