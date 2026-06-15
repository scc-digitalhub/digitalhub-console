// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { GetListParams } from 'react-admin';
import {
    DownloadInfo,
    DownloadParams,
    ResourceDownloadParams,
} from './download/types';
import {
    GetListResult,
    FileInfoParams,
    ResourceFileInfoParams,
} from './info/types';
import {
    CompleteMultipartUploadParams,
    ResourceCompleteMultipartUploadParams,
    ResourceUploadParams,
    ResourceUploadPartParams,
    UploadInfo,
    UploadParams,
    UploadPartParams,
} from './upload/types';

export type FileProvider = {
    stores: (params: Pick<GetListParams, 'meta'>) => Promise<string[]>;

    deleteFiles: (
        params: Pick<GetListParams, 'meta'>,
        paths: string[]
    ) => Promise<void>;

    download: (
        params: Pick<GetListParams, 'meta'>,
        downloadParams?: DownloadParams,
        resourceDownloadParams?: ResourceDownloadParams
    ) => Promise<DownloadInfo>;

    fileInfo: (
        params: GetListParams,
        fileInfoParams?: FileInfoParams,
        resourceFileInfoParams?: ResourceFileInfoParams
    ) => Promise<GetListResult>;

    upload: (
        params: Pick<GetListParams, 'meta'>,
        uploadParams?: UploadParams,
        resourceUploadParams?: ResourceUploadParams
    ) => Promise<UploadInfo>;

    startMultipartUpload: (
        params: Pick<GetListParams, 'meta'>,
        uploadParams?: UploadParams,
        resourceUploadParams?: ResourceUploadParams
    ) => Promise<UploadInfo>;

    uploadPart: (
        params: Pick<GetListParams, 'meta'>,
        uploadParams?: UploadPartParams,
        resourceUploadParams?: ResourceUploadPartParams
    ) => Promise<UploadInfo>;

    completeMultipartUpload: (
        params: Pick<GetListParams, 'meta'>,
        uploadParams?: CompleteMultipartUploadParams,
        resourceUploadParams?: ResourceCompleteMultipartUploadParams
    ) => Promise<UploadInfo>;
};
