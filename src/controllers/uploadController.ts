// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { useMemo, useState } from 'react';
import {
    RaRecord,
    useDataProvider,
    useNotify,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { Uppy } from 'uppy';
import AwsS3 from '@uppy/aws-s3';
import { useUploadStatusContext } from '../contexts/UploadStatusContext';

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
    resource?: string;
    record?: RaRecord;
    id?: string;
};

export type UploadController = {
    uppy: Uppy;
    files: any[];
    path: string | null;
    /**
     * Set resource state to UPLOADING, then start the upload.
     * @param data record
     * @returns
     */
    upload: (data: any) => void;
};

export const useUploadController = (
    props: UploadControllerProps
): UploadController => {
    const { id: idProps } = props;

    const resource = useResourceContext(props);
    const record = useRecordContext(props);
    const id = record?.id || idProps;

    const dataProvider = useDataProvider();
    const { root } = useRootSelector();
    const notify = useNotify();
    const translate = useTranslate();

    const { updateUploads } = useUploadStatusContext();

    //keep files info
    const [files, setFiles] = useState<any[]>([]);

    const uppyConfig = {
        onBeforeFileAdded: (currentFile, files) => {
            //block files over max
            if (currentFile.size > 1000 * MiB) {
                notify(translate('messages.upload.file_too_big'), {
                    type: 'error',
                });
                return false;
            }

            //disallow all remote
            if (currentFile.isRemote) {
                notify(translate('messages.upload.remote_files_unsupported'), {
                    type: 'error',
                });
                return false;
            }

            //allow single file for zip
            if (files) {
                const exists = Object.keys(files).filter(
                    k => 'application/zip' == files[k].type
                );
                if (exists?.length > 0) {
                    notify(
                        translate('messages.upload.single_zip_file_supported'),
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
                notify(translate('messages.upload.single_zip_file_supported'), {
                    type: 'error',
                });
                return false;
            }

            return true;
        },
    };

    const upload = (data: any) => {
        if (dataProvider && resource) {
            //update resource state to UPLOADING
            if (!data.status) data.status = {};
            data.status.state = 'UPLOADING';

            dataProvider
                .update(resource, {
                    id: data.id,
                    data: data,
                    previousData: null,
                })
                .then(() => {
                    uppy?.upload();
                });
        }
    };

    const retry = (fileId: string) => {
        if (dataProvider && resource) {
            //update resource state to UPLOADING
            dataProvider.getOne(resource, { id }).then(res => {
                let data = res.data;
                if (data) {
                    data.status.state = 'UPLOADING';

                    dataProvider
                        .update(resource, {
                            id: data.id,
                            data: data,
                            previousData: null,
                        })
                        .then(() => {
                            //set final resource state here, as "complete" event is not fired
                            uppy?.retryUpload(fileId).then(
                                () => {
                                    if (uppy?.getFiles().some(f => f.error)) {
                                        //some upload is still failed, set ERROR
                                        data.status.state = 'ERROR';
                                    } else if (
                                        uppy
                                            ?.getFiles()
                                            .every(
                                                f =>
                                                    !f.error &&
                                                    f.progress.uploadComplete
                                            )
                                    ) {
                                        //all files uploaded, set READY
                                        data.status.state = 'READY';
                                    }
                                    //set successful files on status
                                    data.status.files = uppy
                                        ?.getFiles()
                                        .filter(
                                            f =>
                                                !f.error &&
                                                f.progress.uploadComplete
                                        )
                                        .map(f => extractInfo(f));
                                    dataProvider.update(resource, {
                                        id: data.id,
                                        data: data,
                                        previousData: null,
                                    });
                                },
                                error => {
                                    console.log('upload error', error);
                                    data.status.state = 'ERROR';
                                    data.status.message = error;
                                    dataProvider.update(resource, {
                                        id: data.id,
                                        data: data,
                                        previousData: null,
                                    });
                                }
                            );
                        });
                }
            });
        }
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

                        const data = await dataProvider.uploadMultipartPart(
                            resource,
                            {
                                id: id,
                                meta: { root },
                                filename: file.name,
                                uploadId: uploadId,
                                partNumber: options.partNumber,
                            }
                        );

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
                            await dataProvider.uploadMultipartComplete(
                                resource,
                                {
                                    id: id,
                                    meta: { root },
                                    filename: file.name,
                                    uploadId,
                                    eTagPartList: parts.map(
                                        (part: any) => part.etag
                                    ),
                                }
                            );
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
                            res = await dataProvider.upload(resource, {
                                id: id,
                                meta: { root },
                                filename: file.name,
                            });
                            file['s3'] = { uploadUrl: res?.url };
                        } else {
                            res = await dataProvider.uploadMultipartStart(
                                resource,
                                {
                                    id: id,
                                    meta: { root },
                                    filename: file.name,
                                }
                            );
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
                    if (file && resource) {
                        updateUploads({
                            id: file.id + `_${id}`,
                            filename: file.name,
                            progress: file.progress,
                            resource: resource,
                            resourceId: id,
                            remove: () => uppy?.removeFile(file.id),
                        });
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
                    if (file && resource) {
                        updateUploads({
                            id: file.id + `_${id}`,
                            filename: file.name,
                            progress: file.progress,
                            resource: resource,
                            resourceId: id,
                            remove: () => uppy?.removeFile(file.id),
                            error,
                            retry: () => retry(file.id),
                        });
                        setFiles(prev => {
                            return prev.map(f =>
                                f.id === file.id ? { ...f, file: file } : f
                            );
                        });
                    }
                })
                .on('complete', result => {
                    if (dataProvider && resource) {
                        //update resource state to READY or ERROR
                        dataProvider.getOne(resource, { id }).then(res => {
                            let data = res.data;
                            if (data) {
                                const state =
                                    result.successful &&
                                    result.successful.length > 0 &&
                                    result.failed?.length === 0
                                        ? 'READY'
                                        : 'ERROR';
                                data.status.state = state;
                                data.status.files = result.successful?.map(f =>
                                    extractInfo(f)
                                );

                                dataProvider.update(resource, {
                                    id: data.id,
                                    data: data,
                                    previousData: null,
                                });
                            }
                        });
                    }
                }),
        [dataProvider, setFiles, updateUploads, resource]
    );

    const path = useMemo(() => {
        let p =
            files?.length > 0
                ? files.length == 1
                    ? files[0].path
                    : files[0].path.substring(
                          0,
                          files[0].path.lastIndexOf('/') + 1
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
        path,
        upload,
    };
};
