// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useResourceDefinitions } from 'react-admin';
import { useMemo } from 'react';

export interface HubResourceDefinition {
    /** nome della risorsa in react-admin (es. 'functions') */
    name: string;
    /** chiave nel catalogo JSON (es. 'functions', 'datasets') 
     *  se non specificata, usa name */
    catalogKey: string;
}

/**
 * Restituisce tutte le risorse che hanno options.hub = true,
 * derivando automaticamente catalogKey da options.catalogKey o dal name.
 *
 * In index.ts di ogni risorsa:
 *   options: { hub: true, catalogKey: 'datasets' }  // se il nome nel catalogo è diverso
 *   options: { hub: true }                           // se il nome coincide
 */
export const useHubResources = (): HubResourceDefinition[] => {
    const definitions = useResourceDefinitions();

    return useMemo(
        () =>
            Object.entries(definitions)
                .filter(([, def]) => def.options?.hub === true)
                .map(([name, def]) => ({
                    name,
                    catalogKey: def.options?.catalogKey ?? name,
                })),
        [definitions]
    );
};