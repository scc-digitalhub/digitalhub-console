// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { GetListParams } from 'react-admin';
import {
    DownloadInfo,
    DownloadParams,
    ResourceDownloadParams,
} from './download/types';
import { FileInfo, FileInfoParams, ResourceFileInfoParams } from './info/types';
import {
    CompleteMultipartUploadParams,
    ResourceCompleteMultipartUploadParams,
    ResourceUploadParams,
    ResourceUploadPartParams,
    UploadInfo,
    UploadParams,
    UploadPartParams,
} from './upload/types';

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
