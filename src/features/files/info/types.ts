// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

export type FileInfo = {
    path?: string;
    name: string;
    contentType: string;
    size: number;
    lastModified: any;
    hash: string;
};

export type FileInfoParams = {
    path: string;
    token?: string;
};

export type ResourceFileInfoParams = {
    resource: string;
    id: string;
};
export interface GetListResult {
    data: FileInfo[];
    total?: number;
    pageInfo?: {
        hasNextPage?: boolean;
        hasPreviousPage?: boolean;
        token?: string;
        nextToken?: string;
    };
    meta?: any;
}
