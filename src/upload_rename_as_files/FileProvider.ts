// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { GetListParams } from 'react-admin';
import { DownloadInfo, FileInfo, UploadInfo } from './types';

//TODO add also /files/stores and /files/delete ?

export type FileProvider = {
    download: (
        params: Pick<GetListParams, 'meta'>,
        downloadParams?: {
            path: string;
            duration?: number;
        },
        resourceDownloadParams?: {
            resource: string;
            id: string;
            sub?: string;
        }
    ) => Promise<DownloadInfo>;
    fileInfo: (
        params: Pick<GetListParams, 'meta'>,
        fileInfoParams?: {
            path: string;
        },
        resourceFileInfoParams?: {
            resource: string;
            id: string;
        }
    ) => Promise<FileInfo[]>;
    upload: (
        params: Pick<GetListParams, 'meta'>,
        uploadParams?: {
            path: string;
            filename: string;
        },
        resourceUploadParams?: {
            resource: string;
            id: string;
            filename: string;
            name?: string;
        }
    ) => Promise<UploadInfo>;
    startMultipartUpload: (
        params: Pick<GetListParams, 'meta'>,
        uploadParams?: {
            path: string;
            filename: string;
        },
        resourceUploadParams?: {
            resource: string;
            id: string;
            filename: string;
            name?: string;
        }
    ) => Promise<UploadInfo>;
    uploadPart: (
        params: Pick<GetListParams, 'meta'>,
        uploadParams?: {
            path: string;
            filename: string;
            uploadId: string;
            partNumber: number;
        },
        resourceUploadParams?: {
            resource: string;
            id: string;
            path: string;
            uploadId: string;
            partNumber: number;
        }
    ) => Promise<UploadInfo>;
    completeMultipartUpload: (
        params: Pick<GetListParams, 'meta'>,
        uploadParams?: {
            path: string;
            filename: string;
            uploadId: string;
            partList: string[];
        },
        resourceUploadParams?: {
            resource: string;
            id: string;
            path: string;
            uploadId: string;
            partList: string[];
        }
    ) => Promise<UploadInfo>;
};
