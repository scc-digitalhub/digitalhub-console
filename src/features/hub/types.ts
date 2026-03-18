// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

export type HubResourceType = 'functions' | 'datasets' | 'models' | 'artifacts' | 'projects';

export interface HubCatalog {
    functions: HubItem[];
    datasets: HubItem[];
    models: HubItem[];
    projects: HubProjectItem[];
}

export interface HubItem {
    name: string;
    kind: string;
    metadata: {
        name: string;
        version?: string;
        description?: string;
        labels?: string[];
        path?: string;
        repository?: string;
    };
    spec?: any;
    type?: HubResourceType;
}

export interface HubProjectItem extends HubItem {
    spec: {
        functions?: HubItem[];
        datasets?: HubItem[];
        models?: HubItem[];
    };
}