// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { AwsBody, AwsS3UploadParameters } from '@uppy/aws-s3';
import { FileProgress } from '@uppy/utils/lib/FileProgress';
import { Meta } from '@uppy/utils/lib/UppyFile';
import { Identifier } from 'react-admin';
import { Uppy } from 'uppy';

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
    //when missing the backend returns the base path for the entity
    filename?: string;
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

/**
 * Uploader bound to a target entity id, shared via context
 */
export type UploaderContextValue = {
    id: string;
    uppy: Uppy<Meta, AwsBody>;
    files: any[];
};

/**
 * Legacy wrapper around Uppy instance (upload on file-added)
 */
export type Uploader = {
    uppy: Uppy<Meta, AwsBody>;
    files: any[];
    upload: (data?: any) => void;
    path: string | null;
    setName: (name: string) => void;
};

export type UploadTarget = { id: string; name: string };

export type ResourceUploader = UploaderContextValue & {
    //upload pending files for the persisted entity
    start: (target: UploadTarget) => void;
};

/**
 * Current file selection: null when empty, `filename` only for a single file
 */
export type SelectedFiles = { filename?: string };
export type FileSelection = SelectedFiles | null;

export type PathResolver = (selection: SelectedFiles) => Promise<string>;

export type Upload = {
    id: string;
    filename?: string;
    progress: FileProgress;
    resource?: string;
    resourceId?: Identifier;
    path?: string;
    error?: any;
    remove: () => void;
    retry?: () => void;
};

export type UploadStatusController = {
    uploads: Upload[];
    uploading: boolean;
    updateUploads: (upload: Upload) => void;
    removeUploads: (toBeRemoved?: Upload) => void;
};
