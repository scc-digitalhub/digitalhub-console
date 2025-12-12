// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { AwsS3UploadParameters } from '@uppy/aws-s3';
import { FileProgress } from '@uppy/utils/lib/FileProgress';
import { Identifier } from 'react-admin';

export type UploadInfo = AwsS3UploadParameters &  {
    path: string;
    expiration: any;
    uploadId?: string;
    partNumber?: number;
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
