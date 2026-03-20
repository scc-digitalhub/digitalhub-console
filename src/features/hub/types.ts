// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

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
    [resourceName: string]: HubItem[] | HubProjectItem[];
}