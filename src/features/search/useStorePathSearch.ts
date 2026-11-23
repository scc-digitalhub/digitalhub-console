import { useEffect, useState } from 'react';
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

// Costruisce una query incrementale per la ricerca nello store, 
// aggiungendo un asterisco finale per il wildcard, escape dei caratteri speciali
//se vuoto o contiene '://', restituisce una stringa vuota (nn viene cercato ma preso cosi)
const buildIncrementalQuery = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || trimmed.includes('://')) return '';
    const escaped = trimmed.replace(/([+\-&|!(){}[\]^"~*?:\\/])/g, '\\$1');
    return `${escaped}*`;
};

// gestisce virgolette e backslash nei valori di ricerca
const quoteValue = (value: string) =>
    `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

export const useStorePathSearch = ({ text, value, filters, paused }: {
    text: string;
    value: string;
    filters?: SearchFilter[];
    paused: boolean;
}) => {
    //  options: rsultati della ricerca nello store,
    //  loading: stato di caricamento,
    //  error: stato di errore,
    //  resolved: elemento risolto dal valore corrente (potrebbe essere free solo)
    const provider = useSearchProvider();
    const [options, setOptions] = useState<StoreSearchItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [resolved, setResolved] = useState<StoreSearchItem | null>(null);


    // Effettua la ricerca nello store basata sul testo (text) inserito,
    //  con debounce (300ms) e gestione dello stato di caricamento ed errori
    useEffect(() => {
        let active = true;
        setOptions([]);
        setLoading(false);
        setError(false);
        const q = buildIncrementalQuery(text);
        if (paused || !q) return;

        const timer = setTimeout(() => {
            setLoading(true);
            provider.search({ q, fq: filters }, {
                pagination: { page: 1, perPage: 15 },
                sort: { field: 'metadata.updated', order: 'DESC' },
                filter: {},
            }).then(result => {
                if (active) setOptions(result.data as StoreSearchItem[]);
            }).catch(() => {
                if (active) setError(true);
            }).finally(() => {
                if (active) setLoading(false);
            });
        }, 300);

        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [text, provider, filters, paused]);

    useEffect(() => {
        let active = true;
        setResolved(null);
        if (!value.startsWith('store://')) return;
        try {
            const parts = keyParser(value);
            if (!parts.project || !parts.resource || !parts.kind || !parts.name) return;
            const fields = {
                project: parts.project,
                type: parts.resource.slice(0, -1),
                kind: parts.kind,
                name: parts.name,
                ...(parts.id ? { id: parts.id } : {}),
            };
            const fq = Object.entries(fields).map(([field, entry]) => ({
                filter: `${field}:${quoteValue(entry)}`,
            }));
            provider.search({ q: '*:*', fq }, {
                pagination: { page: 1, perPage: 1 },
                sort: { field: 'metadata.updated', order: 'DESC' },
                filter: {},
            }).then(result => {
                if (active) {
                    setResolved(result.data.find(item => item.key === value) ?? null);
                }
            }).catch(() => {
                if (active) setError(true);
            });
        } catch {
            return;
        }
        return () => { active = false; };
    }, [value, provider]);

    return { options, loading, error, resolved };
};