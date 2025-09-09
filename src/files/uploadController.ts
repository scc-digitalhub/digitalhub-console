// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { useMemo, useState } from 'react';
import { useDataProvider, useNotify, useTranslate } from 'react-admin';
import { Uppy } from 'uppy';
import AwsS3 from '@uppy/aws-s3';

/**
 * private helpers
 */
const MiB = 0x10_00_00;
function partSize(file): number {
    if (file.size <= 100 * MiB) return 1;
    else {
        return Math.ceil(file.size / (100 * MiB));
    }
}
function extractInfo(file: any): any {
    return {
        //no subfolders support for browser upload!
        path: file.name,
        name: file.name,
        content_type: file.type,
        last_modified: new Date(file.data?.lastModified).toUTCString(),
        size: file.size,
    };
}

/**
 * upload hook
 */

export type UploadControllerProps = {
    path?: string;
};

export type UploadController = {
    uppy: Uppy;
    files: any[];
    upload: (data: any) => void;
};

export const useUploadController = (
    props: UploadControllerProps
): UploadController => {
    const { path } = props;

    const dataProvider = useDataProvider();
    const { root: projectId } = useRootSelector();
    const notify = useNotify();
    const translate = useTranslate();

    //keep files info
    const [files, setFiles] = useState<any[]>([]);

    const doUpload = file => {
        const dest = file.meta?.relativePath
            ? file.meta.relativePath.substring(
                  0,
                  file.meta.relativePath.lastIndexOf('/')
              )
            : '';
        const filename = file.name;

        return dataProvider
            .invoke({
                path: `/-/${projectId}/files/upload?path=${
                    path + dest
                }&filename=${filename}`,
                options: { method: 'POST' },
            })
            .then(json => {
                return json;
            });
    };

    const startMultipartUpload = file => {
        return dataProvider
            .invoke({
                path: `/-/${projectId}/files/multipart/start?path=${path}&filename=${file.name}`,
                options: { method: 'POST' },
            })
            .then(json => {
                return json;
            });
    };

    const doMultipartUpload = params => {
        return dataProvider
            .invoke({
                path: `/-/${projectId}/files/multipart/part?path=${path}&filename=${params.filename}&uploadId=${params.uploadId}&partNumber=${params.partNumber}`,
                options: { method: 'PUT' },
            })
            .then(json => {
                return json;
            });
    };

    const completeMultipartUpload = params => {
        const eTagPartList = params.eTagPartList
            ? params.eTagPartList.map(etag => `partList=${etag}`).join('&')
            : '';
        return dataProvider
            .invoke({
                path: `/-/${projectId}/files/multipart/complete?path=${path}&filename=${params.filename}&uploadId=${params.uploadId}&${eTagPartList}`,
                options: { method: 'POST' },
            })
            .then(json => {
                return json;
            });
    };

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
            new Uppy(uppyConfig)
                .use(AwsS3, {
                    id: 'AwsS3',
                    shouldUseMultipart: file =>
                        file.size !== null && file.size > 100 * MiB,
                    getChunkSize: file => 100 * MiB,
                    getUploadParameters: async file => {
                        return {
                            method: 'PUT',
                            url: file['s3']?.uploadUrl,
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
                            // uploadId: uploadId.current,
                            uploadId: file['s3']?.uploadId,
                            key: file.name || '',
                        };
                    },

                    async abortMultipartUpload(file, { key, uploadId }) {
                        // const filename = encodeURIComponent(key)
                        // const uploadIdEnc = encodeURIComponent(uploadId)
                        // const response = await fetch(
                        //     `/s3/multipart/${uploadIdEnc}?key=${filename}`,
                        //     {
                        //         method: 'DELETE',
                        //     },
                        // )
                        // if (!response.ok)
                        //     throw new Error('Unsuccessful request', { cause: response })
                    },

                    async signPart(file, options) {
                        const { signal, uploadId } = options;

                        signal?.throwIfAborted();

                        const data = await doMultipartUpload({
                            filename: file.name,
                            uploadId: uploadId,
                            partNumber: options.partNumber,
                        });

                        return data;
                    },

                    async listParts(file, { key, uploadId }) {
                        const returnParts: any[] = [];
                        // const filename = encodeURIComponent(key)
                        // const response = await fetch(
                        //     `/s3/multipart/${uploadId}?key=${filename}`
                        // )

                        // if (!response.ok)
                        //     throw new Error('Unsuccessful request', { cause: response })

                        // const data = await response.json()

                        // return data
                        return returnParts;
                    },

                    async completeMultipartUpload(
                        file,
                        { key, uploadId, parts }
                    ) {
                        //parts is array of part
                        try {
                            await completeMultipartUpload({
                                filename: file.name,
                                uploadId,
                                eTagPartList: parts.map(
                                    (part: any) => part.etag
                                ),
                            });
                        } catch (error) {
                            throw new Error('Unsuccessful request');
                        }

                        return {};
                    },
                })
                .on('file-added', async file => {
                    if (dataProvider) {
                        const partSizeNumber = partSize(file);
                        let res: any = null;
                        if (partSizeNumber === 1) {
                            res = await doUpload(file);
                            file['s3'] = { uploadUrl: res?.url };
                        } else {
                            res = await startMultipartUpload(file);
                            file['s3'] = { uploadId: res?.uploadId };
                        }

                        const info = {
                            id: file.id,
                            info: extractInfo(file),
                            file: file,
                            path: res?.path,
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
        [dataProvider, setFiles, path]
    );

    return {
        uppy,
        files,
        upload,
    };
};
