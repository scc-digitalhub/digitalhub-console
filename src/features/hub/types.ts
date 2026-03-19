// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

export type HubResourceType =
    | 'functions'
    | 'datasets'
    | 'models'
    | 'artifacts'
    | 'projects';

export const ALL_TYPES: HubResourceType[] = [
    'functions',
    'datasets',
    'models',
    'artifacts',
    'projects',
];

export const RESOURCE_MAP: Record<HubResourceType, string> = {
    functions: 'functions',
    datasets: 'dataitems', //su data.json sono chiamati dataitems, ma in console sono datasets
    models: 'models',
    artifacts: 'artifacts',
    projects: 'projects',
};

export interface HubItemMetadata {
    name: string;
    version?: string;
    description?: string;
    labels?: string[];
    path?: string;
    repository?: string;
}

export interface HubItem {
    name: string;
    kind: string;
    metadata: HubItemMetadata;
    spec?: any;
}

export interface HubProjectItem extends HubItem {
    spec: {
        functions?: HubItem[];
        datasets?: HubItem[];
        models?: HubItem[];
        artifacts?: HubItem[];  
    };
}

export interface HubCatalog {
    functions: HubItem[];
    datasets: HubItem[];
    models: HubItem[];
    artifacts: HubItem[];   
    projects: HubProjectItem[];
}