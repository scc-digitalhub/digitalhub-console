// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { GetListParams } from 'react-admin';
import { UploadInfo } from './types';
import {
    DownloadInfo,
    DownloadParams,
    ResourceDownloadParams,
} from './download/types';
import { FileInfo, FileInfoParams, ResourceFileInfoParams } from './info/types';

//TODO add also /files/delete

export type FileProvider = {
    stores: (params: Pick<GetListParams, 'meta'>) => Promise<string[]>;
    download: (
        params: Pick<GetListParams, 'meta'>,
        downloadParams?: DownloadParams,
        resourceDownloadParams?: ResourceDownloadParams
    ) => Promise<DownloadInfo>;
    fileInfo: (
        params: Pick<GetListParams, 'meta'>,
        fileInfoParams?: FileInfoParams,
        resourceFileInfoParams?: ResourceFileInfoParams
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
