// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useMemo, useState } from 'react';
import { useNotify, useTranslate } from 'react-admin';
import { Uppy } from 'uppy';
import AwsS3, { AwsBody } from '@uppy/aws-s3';
import {
    extractInfo,
    MiB,
    numberOfParts,
    sizeThreshold,
} from '../upload_rename_as_files/utils';
import { useUpload } from '../upload_rename_as_files/upload/useUpload';
import { Meta } from '@uppy/utils/lib/UppyFile';
import { useUploadPart } from '../upload_rename_as_files/upload/useUploadPart';
import { useCompleteMultipartUpload } from '../upload_rename_as_files/upload/useCompleteMultipartUpload';

/**
 * upload hook
 */

export type UploadControllerProps = {
    path: string;
};

export type UploadController = {
    uppy: Uppy<Meta, AwsBody>;
    files: any[];
    upload: (data: any) => void;
};

export const useUploadController = (
    props: UploadControllerProps
): UploadController => {
    const { path } = props;
    const notify = useNotify();
    const translate = useTranslate();
    const doUpload = useUpload();
    const doMultipartUpload = useUploadPart();
    const completeMultipartUpload = useCompleteMultipartUpload();

    //keep files info
    const [files, setFiles] = useState<any[]>([]);

    const uppyConfig = {
        onBeforeFileAdded: (currentFile, files) => {
            //disallow all remote
            if (currentFile.isRemote) {
                notify(translate('messages.upload.remote_files_unsupported'), {
                    type: 'error',
                });
                return false;
            }

            return true;
        },
    };

    const upload = (data: any) => {
        uppy?.upload();
    };

    //memoize uppy instantiation
    //NOTE: event handlers *have* to be attached once to avoid double firing!
    const uppy = useMemo(
        () =>
            new Uppy<Meta, AwsBody>(uppyConfig)
                .use(AwsS3, {
                    id: 'AwsS3',
                    shouldUseMultipart: file =>
                        file.size !== null && numberOfParts(file) > 1,
                    getChunkSize: file => sizeThreshold * MiB,
                    getUploadParameters: async file => {
                        return {
                            method: 'PUT',
                            url: file['s3']?.url,
                            fields: {},
                            headers: file.type
                                ? { 'Content-Type': file.type }
                                : undefined,
                        };
                    },
                    // ========== Multipart Uploads ==========
                    // The following methods are only useful for multipart uploads:

                    async createMultipartUpload(file) {
                        return {
                            uploadId: file['s3']?.uploadId,
                            key: file.name || '',
                        };
                    },

                    async abortMultipartUpload(file, { key, uploadId }) {},

                    async signPart(file, options) {
                        const { signal, uploadId } = options;

                        signal?.throwIfAborted();

                        const data = await doMultipartUpload({
                            path,
                            filename: file.name ?? '',
                            uploadId,
                            partNumber: options.partNumber,
                        });

                        return data;
                    },

                    async listParts(file, { key, uploadId }) {
                        const returnParts: any[] = [];
                        return returnParts;
                    },

                    async completeMultipartUpload(
                        file,
                        { key, uploadId, parts }
                    ) {
                        //parts is array of part
                        try {
                            await completeMultipartUpload({
                                path,
                                filename: file.name ?? '',
                                uploadId,
                                partList: parts.map((part: any) => part.etag),
                            });
                        } catch (error) {
                            throw new Error('Unsuccessful request');
                        }

                        return {};
                    },
                })
                .on('file-added', async file => {
                    if (doUpload) {
                        const dest = file.meta?.relativePath
                            ? file.meta.relativePath.substring(
                                  0,
                                  file.meta.relativePath.lastIndexOf('/')
                              )
                            : '';
                        const filename = file.name ?? '';
                        file['s3'] = await doUpload(
                            { path: path + dest, filename },
                            numberOfParts(file) > 1
                        );

                        const info = {
                            id: file.id,
                            info: extractInfo(file),
                            file: file,
                            path: file['s3']?.path,
                        };
                        setFiles(prev => {
                            const cur = prev.filter(f => f.id != file.id);
                            return [...cur, info];
                        });
                    }
                })
                .on('file-removed', file => {
                    if (file) {
                        setFiles(prev => {
                            return [...prev.filter(f => f.id != file.id)];
                        });
                    }
                })
                .on('upload-progress', file => {
                    if (file) {
                        setFiles(prev => {
                            return prev.map(f =>
                                f.id === file.id ? { ...f, file: file } : f
                            );
                        });
                    }
                })
                .on('upload-success', file => {
                    if (file) {
                        setFiles(prev => {
                            return prev.map(f =>
                                f.id === file.id ? { ...f, file: file } : f
                            );
                        });
                    }
                })
                .on('upload-error', (file, error) => {
                    if (file) {
                        setFiles(prev => {
                            return prev.map(f =>
                                f.id === file.id ? { ...f, file: file } : f
                            );
                        });
                    }
                })
                .on('complete', result => {}),
        [doMultipartUpload, path, completeMultipartUpload, doUpload]
    );

    return {
        uppy,
        files,
        upload,
    };
};
