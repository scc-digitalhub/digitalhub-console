// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { AwsS3UploadParameters } from '@uppy/aws-s3';
import { FileProgress } from '@uppy/utils/lib/FileProgress';
// import { UppyFile, Meta } from '@uppy/utils/lib/UppyFile';
import { Identifier } from 'react-admin';

// export type File = UppyFile<Meta, Record<string, any>>;

export type UploadInfo = AwsS3UploadParameters & {
    path: string;
    expiration: any;
    uploadId?: string;
    partNumber?: number;
};

export type UploadParams = {
    path: string;
    filename: string;
};

export type ResourceUploadParams = {
    resource: string;
    id: string;
    filename: string;
    name?: string;
};

export type UploadPartParams = {
    path: string;
    filename: string;
    uploadId: string;
    partNumber: number;
};

export type ResourceUploadPartParams = {
    resource: string;
    id: string;
    path: string;
    uploadId: string;
    partNumber: number;
};

export type CompleteMultipartUploadParams = {
    path: string;
    filename: string;
    uploadId: string;
    partList: string[];
};

export type ResourceCompleteMultipartUploadParams = {
    resource: string;
    id: string;
    path: string;
    uploadId: string;
    partList: string[];
};

export type Upload = {
    id: string;
    filename?: string;
    progress: FileProgress;
    resource: string;
    resourceId?: Identifier;
    error?: any;
    remove: () => void;
    retry?: () => void;
};
