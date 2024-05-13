import { createContext, useContext } from 'react';
import { SearchParams, SearchProvider } from './SearchProvider';

// everything that can be stored in search context
interface SearchContextValue {
    params: SearchParams;
    setParams: (record: SearchParams) => void;
    provider: SearchProvider;
}

// context
export const SearchContext = createContext<SearchContextValue | undefined>(
    undefined
);

// hook to get context value
export const useSearch = () => {
    const search = useContext(SearchContext);
    if (search === undefined) {
        throw new Error(
            'useSearchProvider must be used inside a SearchContext'
        );
    }
    return search;
};

export const useSearchProvider = () => {
    const searchContextValue = useSearch();
    if (searchContextValue === undefined) {
        throw new Error(
            'useSearchProvider must be used inside a SearchContext'
        );
    }
    return searchContextValue.provider;
};
