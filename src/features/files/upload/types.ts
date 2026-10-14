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

export type UploadSlot = {
    id: string;
    uppy: Uppy<Meta, AwsBody>;
    resolutionContext?: PathResolutionContext;
    target?: UploadTargetContext;
};

export type UploadTargetContext = {
    id?: string;
    name?: string;
    resource?: string;
};

export type UploaderContextValue = {
    id: string;
    uppy: Uppy<Meta, AwsBody>;
    files: any[];
};

export type UploadCoordinatorContextValue = {
    id: string;
    files: any[];
    registerSlot: (slot: UploadSlot) => void;
    unregisterSlotsForTarget: (target: UploadTargetContext) => void;
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

export type UploadTarget = { id: string; name: string; resource?: string };

export type ResourceUploader = UploadCoordinatorContextValue & {
    prepare: (data: any) => Promise<void>;
    start: () => void;
};

export type SelectedFile = {
    id: string;
    filename: string;
    relativePath: string;
    size: number | null;
    contentType: string;
};

/** Current selection for one path field; null means no files are selected. */
export type FileSelection = { files: SelectedFile[] } | null;

export type PathResolutionContext = {
    resource: string;
    id: string;
    name: string;
    filenamePrefix?: string;
    basePathSuffix?: string;
};

export type PathResolver = {
    context: PathResolutionContext;
    target: UploadTargetContext;
    resolve: (params: { filename?: string }) => Promise<string>;
};

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
