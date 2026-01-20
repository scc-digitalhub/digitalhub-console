// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { SearchProvider } from './SearchProvider';

export const withRootSelector = (
    searchProvider: SearchProvider,
    root: string | undefined
): SearchProvider => {
    function injectRoot(params: any) {
        const meta = params?.meta || {};
        meta.root = root;
        return {
            ...params,
            meta,
        };
    }

    //explode and patch methods
    const { search, ...rest } = searchProvider;

    return {
        search: (searchParams, params) => {
            return search(searchParams, injectRoot(params));
        },
        ...rest,
    };
};
