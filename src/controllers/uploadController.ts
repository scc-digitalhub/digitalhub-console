// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { useMemo, useRef, useState } from 'react';
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
import { UploadInfo } from '../upload_rename_as_files/FileProvider';
import { extractInfo, MiB } from '../upload_rename_as_files/utils';

/**
 * private helpers
 */
const sizeThreshold = 100;
function partCount(file): number {
    return file.size <= sizeThreshold * MiB
        ? 1
        : Math.ceil(file.size / (sizeThreshold * MiB));
}
function partSize(file): number {
    return file.size <= sizeThreshold * MiB
        ? file.size
        : Math.ceil(file.size / partCount(file));
}

/**
 * upload hook
 */

export type UploadControllerProps = {
    resource?: string;
    record?: RaRecord;
    id?: string;
    name?: string;
};

export type UploadController = {
    uppy: Uppy;
    files: any[];
    path: string | null;
    setName: (name: string) => void;
    upload: (data: any) => void;
};

export const useUploadController = (
    props: UploadControllerProps
): UploadController => {
    const { id: idProps, name: nameProps = null } = props;

    const resource = useResourceContext(props);
    const record = useRecordContext(props);
    const id = record?.id || idProps;
    const name = useRef(nameProps);

    const dataProvider = useDataProvider();
    const { root: projectId } = useRootSelector();
    const notify = useNotify();
    const translate = useTranslate();

    const { updateUploads } = useUploadStatusContext();

    //keep files info
    const [files, setFiles] = useState<any[]>([]);

    const doUpload = (file): UploadInfo => {
        const dest = file.meta?.relativePath
            ? file.meta.relativePath.substring(
                  0,
                  file.meta.relativePath.lastIndexOf('/')
              )
            : '';
        const filename = file.name;

        return dataProvider
            .upload({ meta: { root: projectId } }, undefined, {
                resource,
                id,
                filename: dest + filename,
                name: name.current ?? undefined,
            })
            .then(json => {
                return json;
            });
    };

    const startMultipartUpload = (file): UploadInfo => {
        const dest = file.meta?.relativePath
            ? file.meta.relativePath.substring(
                  0,
                  file.meta.relativePath.lastIndexOf('/')
              )
            : '';
        const filename = file.name;

        return dataProvider
            .startMultipartUpload({ meta: { root: projectId } }, undefined, {
                resource,
                id,
                filename: dest + filename,
                name: name.current ?? undefined,
            })
            .then(json => {
                return json;
            });
    };

    const doMultipartUpload = (file, params): UploadInfo => {
        const { s3: uploadInfo } = file;
        if (!uploadInfo?.path) {
            throw new Error('missing s3 path');
        }
        return dataProvider
            .uploadPart({ meta: { root: projectId } }, undefined, {
                resource,
                id,
                path: uploadInfo.path,
                uploadId: params.uploadId,
                partNumber: params.partNumber,
            })
            .then(json => {
                return json;
            });
    };

    const completeMultipartUpload = (file, params): UploadInfo => {
        const { s3: uploadInfo } = file;
        if (!uploadInfo?.path) {
            throw new Error('missing s3 path');
        }

        return dataProvider
            .completeMultipartUpload({ meta: { root: projectId } }, undefined, {
                resource,
                id,
                path: uploadInfo.path,
                uploadId: params.uploadId,
                partList: params.eTagPartList,
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
                        file.size !== null && partCount(file) > 1,
                    getChunkSize: file => partSize(file),
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
                        const { signal } = options;

                        signal?.throwIfAborted();

                        const data = await doMultipartUpload(file, options);
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
                            await completeMultipartUpload(file, {
                                key,
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
                        const count = partCount(file);
                        if (count === 1) {
                            file['s3'] = await doUpload(file);
                        } else {
                            file['s3'] = await startMultipartUpload(file);
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
        setName: value => {
            name.current = value;
        },
    };
};
