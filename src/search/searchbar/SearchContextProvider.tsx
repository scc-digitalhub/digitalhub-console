import { ReactElement, useMemo, useState } from 'react';
import { SearchContext } from './SearchContext';
import { SearchParams, SearchProvider } from './SearchProvider';
import { useRootSelector } from '@dslab/ra-root-selector';
import { withRootSelector } from './utils';

// creates a SearchContext
export const SearchContextProvider = (props: SearchContextProviderParams) => {
    const { searchProvider, children } = props;
    const [currentSearch, setCurrentSearch] = useState<SearchParams>({});
    const { root } = useRootSelector();

    //memoized function to handle changes in search
    const searchContext = useMemo(() => {
        const handleSearch = (search: SearchParams) => {
            setCurrentSearch(search);
        };

        //wrap search provider with root selector in meta
        const providerWithRootSelector = withRootSelector(searchProvider, root);

        return {
            params: currentSearch, //can contain q, fq
            setParams: handleSearch,
            provider: providerWithRootSelector,
        };
    }, [currentSearch, root, searchProvider]);

    return (
        <SearchContext.Provider value={searchContext}>
            {children}
        </SearchContext.Provider>
    );
};

export type SearchContextProviderParams = {
    searchProvider: SearchProvider;
    children: ReactElement;
};
