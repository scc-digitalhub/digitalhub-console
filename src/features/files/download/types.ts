// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

export type DownloadInfo = {
    path: string;
    url: string;
    expiration: any;
};

export type DownloadParams = {
    path: string;
    duration?: number;
};

export type ResourceDownloadParams = {
    resource: string;
    id: string;
    sub?: string;
};
