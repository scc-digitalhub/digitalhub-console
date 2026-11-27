// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { SearchFilter } from '../../features/search/SearchProvider';

/**
 * Store search filters for the function `path` input, per function kind:
 * suggests only the models a serving runtime can load.
 *
 * Kinds not listed here search across all entity types (models, artifacts,
 * dataitems...). Update this map when adding a new serving runtime.
 */
export const functionPathFilters: Record<string, SearchFilter[]> = {
    ollamaserve: [
        { filter: 'type:model' },
        { filter: 'kind:(ollama OR huggingface)' },
    ],
    huggingfaceserve: [
        { filter: 'type:model' },
        { filter: 'kind:huggingface' },
    ],
    mlflowserve: [{ filter: 'type:model' }, { filter: 'kind:mlflow' }],
    sklearnserve: [{ filter: 'type:model' }, { filter: 'kind:sklearn' }],
};
