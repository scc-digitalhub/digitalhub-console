// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useMemo, useRef, useState } from 'react';
import { AwsS3, Uppy } from 'uppy';
import { AwsBody } from '@uppy/aws-s3';
import { Meta } from '@uppy/utils/lib/UppyFile';
import { useNotify, useResourceContext, useTranslate } from 'react-admin';
import { Uploader, UploadInfo } from './types';
import { useUpload } from './useUpload';
import { useUploadPart } from './useUploadPart';
import { useCompleteMultipartUpload } from './useCompleteMultipartUpload';
import { extractInfo, MiB, numberOfParts, sizeThreshold } from './utils';
import { UploadResult } from '@uppy/core';
import { useFileContext } from '../FileContext';

const ID_PREFIX = 'uppy_';

export type GetUploaderProps = {
    id: string;
    onBeforeUpload?: (data?: any) => Promise<any> | undefined;
    onUploadComplete?: (
        result: UploadResult<Meta, AwsBody>
    ) => Promise<any> | undefined;
    onBeforeFileAdded?: (currentFile, files) => boolean;
    //resource-related props
    resource?: string;
    recordId?: string;
    name?: string;
    //non-resource-related props
    path?: string;
};

/**
 * Hook to create an uploader, i.e., a wrapper around an Uppy instance
 */
export const useGetUploader = (props: GetUploaderProps): Uploader => {
    const {
        id,
        onBeforeUpload,
        onUploadComplete,
        onBeforeFileAdded,
        path: pathFromProps,
        recordId,
        name: nameProps = null,
    } = props;
    const name = useRef(nameProps);
    const resource = useResourceContext(props);
    const notify = useNotify();
    const translate = useTranslate();
    const doUpload = useUpload();
    const doMultipartUpload = useUploadPart();
    const completeMultipartUpload = useCompleteMultipartUpload();
    const {
        uploadStatusController: { updateUploads },
    } = useFileContext();

    //keep files info
    const [files, setFiles] = useState<any[]>([]);

    const uppyConfig = useMemo(() => {
        return {
            id: ID_PREFIX + id,
            onBeforeFileAdded: (currentFile, files) => {
                //disallow all remote
                if (currentFile.isRemote) {
                    notify(
                        translate('messages.upload.remote_files_unsupported'),
                        {
                            type: 'error',
                        }
                    );
                    return false;
                }

                //restrictions for uploads in a resource context
                if (resource) {
                    //allow single file for zip
                    if (files) {
                        const exists = Object.keys(files).filter(
                            k => 'application/zip' == files[k].type
                        );
                        if (exists?.length > 0) {
                            notify(
                                translate(
                                    'messages.upload.single_zip_file_supported'
                                ),
                                {
                                    type: 'error',
                                }
                            );
                            return false;
                        }
                    }
                    if (
                        Object.keys(files).length > 0 &&
                        'application/zip' == currentFile.type
                    ) {
                        notify(
                            translate(
                                'messages.upload.single_zip_file_supported'
                            ),
                            {
                                type: 'error',
                            }
                        );
                        return false;
                    }
                }

                //if function with additional checks has been passed, call it
                if (onBeforeFileAdded) {
                    return onBeforeFileAdded(currentFile, files);
                }

                return true;
            },
        };
    }, [id, notify, resource, translate, onBeforeFileAdded]);

    //memoize uppy instantiation
    //NOTE: event handlers *have* to be attached once to avoid double firing!
    const uppy = useMemo(() => {
        return new Uppy<Meta, AwsBody>(uppyConfig)
            .use(AwsS3, {
                id: 'AwsS3',
                shouldUseMultipart: file =>
                    file.size !== null && numberOfParts(file) > 1,
                getChunkSize: () => sizeThreshold * MiB,
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

                async abortMultipartUpload() {},

                async signPart(file, options) {
                    const { signal, uploadId } = options;

                    signal?.throwIfAborted();

                    let data: UploadInfo;
                    if (pathFromProps && !resource) {
                        data = await doMultipartUpload({
                            path: pathFromProps,
                            filename: file.name ?? '',
                            uploadId,
                            partNumber: options.partNumber,
                        });
                    } else {
                        const { s3: uploadInfo } = file;
                        if (!uploadInfo?.path) {
                            throw new Error('missing s3 path');
                        }
                        data = await doMultipartUpload({
                            resource: resource ?? '',
                            id: recordId ?? '',
                            path: uploadInfo.path,
                            uploadId: options.uploadId,
                            partNumber: options.partNumber,
                        });
                    }

                    return data;
                },

                async listParts() {
                    const returnParts: any[] = [];
                    return returnParts;
                },

                async completeMultipartUpload(file, { uploadId, parts }) {
                    //parts is array of part
                    try {
                        if (pathFromProps && !resource) {
                            await completeMultipartUpload({
                                path: pathFromProps,
                                filename: file.name ?? '',
                                uploadId,
                                partList: parts.map((part: any) => part.etag),
                            });
                        } else {
                            const { s3: uploadInfo } = file;
                            if (!uploadInfo?.path) {
                                throw new Error('missing s3 path');
                            }
                            await completeMultipartUpload({
                                resource: resource ?? '',
                                id: recordId ?? '',
                                path: uploadInfo.path,
                                uploadId,
                                partList: parts.map((part: any) => part.etag),
                            });
                        }
                    } catch (error) {
                        throw new Error('Unsuccessful request');
                    }

                    return {};
                },
            })
            .on('file-added', async file => {
                const dest = file.meta?.relativePath
                    ? file.meta.relativePath.substring(
                          0,
                          file.meta.relativePath.lastIndexOf('/')
                      )
                    : '';
                const filename = file.name ?? '';

                if (pathFromProps && !resource) {
                    file['s3'] = await doUpload(
                        { path: pathFromProps + dest, filename },
                        numberOfParts(file) > 1
                    );
                } else {
                    file['s3'] = await doUpload(
                        {
                            resource: resource ?? '',
                            id: recordId ?? '',
                            filename:
                                (file.meta?.relativePath as string) ?? filename,
                            name: name.current ?? undefined,
                        },
                        numberOfParts(file) > 1
                    );
                }

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
                    if (resource) {
                        updateUploads({
                            id: file.id + `_${recordId}`,
                            filename: file.name,
                            progress: file.progress,
                            resource,
                            resourceId: recordId,
                            remove: () => uppy?.removeFile(file.id),
                        });
                    }
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
                    if (resource) {
                        updateUploads({
                            id: file.id + `_${recordId}`,
                            filename: file.name,
                            progress: file.progress,
                            resource,
                            resourceId: recordId,
                            remove: () => uppy?.removeFile(file.id),
                            error,
                            retry: () => {
                                const postRetryCallback = () => {
                                    let result: UploadResult<Meta, AwsBody> = {
                                        successful: [],
                                        failed: [],
                                    };
                                    result.successful = uppy
                                        ?.getFiles()
                                        .filter(f => f.progress.uploadComplete);
                                    result.failed = uppy
                                        ?.getFiles()
                                        .filter(f => f.error);
                                    if (onUploadComplete) {
                                        onUploadComplete(result);
                                    }
                                };
                                if (onBeforeUpload) {
                                    onBeforeUpload()?.then(res => {
                                        if (res)
                                            uppy?.retryUpload(file.id).then(
                                                postRetryCallback
                                            );
                                    });
                                } else {
                                    uppy?.retryUpload(file.id).then(
                                        postRetryCallback
                                    );
                                }
                            },
                        });
                    }
                    setFiles(prev => {
                        return prev.map(f =>
                            f.id === file.id ? { ...f, file: file } : f
                        );
                    });
                }
            })
            .on('complete', result => {
                if (onUploadComplete) onUploadComplete(result);
            });
    }, [
        completeMultipartUpload,
        doMultipartUpload,
        doUpload,
        onBeforeUpload,
        onUploadComplete,
        pathFromProps,
        recordId,
        resource,
        updateUploads,
        uppyConfig,
    ]);

    const path = useMemo(() => {
        let p =
            files?.length > 0
                ? files.length == 1
                    ? files[0].path
                    : files[0].path.substring(
                          0,
                          files[0].path.length - files[0].info.path.length
                      )
                : null;

        //handle zip
        if (
            p?.startsWith('s3://') &&
            p.endsWith('.zip') &&
            files?.length == 1
        ) {
            p = 'zip+' + p;
        }
        return p;
    }, [files?.length]);

    return {
        uppy,
        files,
        upload: (data?: any) => {
            if (onBeforeUpload) {
                onBeforeUpload(data)?.then(res => {
                    if (res) uppy?.upload();
                });
            } else {
                uppy?.upload();
            }
        },
        path: pathFromProps ?? path,
        setName: value => {
            name.current = value;
        },
    };
};
