// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { CommonInputProps } from 'react-admin';
import {
    SearchFilter,
    SearchRecord,
} from '../../../features/search/SearchProvider';

/** A store entity as returned by the search provider. */
export type StoreSearchItem = SearchRecord & {
    name?: string;
    type?: string;
    kind?: string;
    /** store:// key of the entity, built by the backend */
    key?: string;
    path?: string;
};

export type StorePathInputProps = Omit<
    CommonInputProps,
    'defaultValue' | 'onChange'
> & {
    defaultValue?: string | null;
    /** Search filters (Solr `fq`) to narrow the suggested entities */
    filters?: SearchFilter[];
    /** Value written into the form for a selected item (default: its store:// key) */
    getOptionValue?: (option: StoreSearchItem) => string;
    /** Label shown for an item (default: its name) */
    getOptionLabel?: (option: StoreSearchItem) => string;
    readOnly?: boolean;
    onChange?: (value: string) => void;
};
