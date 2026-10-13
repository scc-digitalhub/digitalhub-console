// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { MutableRefObject, useRef, useState } from 'react';
import { AwsS3, Uppy } from 'uppy';
import { AwsBody } from '@uppy/aws-s3';
import { UploadResult } from '@uppy/core';
import { Meta, UppyFile } from '@uppy/utils/lib/UppyFile';
import {
    DataProvider,
    useDataProvider,
    useNotify,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import {
    updateUploadState,
    uploadResultStatus,
} from '../../../common/hooks/useStateUpdateCallbacks';
import { useFileContext } from '../FileContext';
import { ResourceUploader, UploadInfo, UploadTarget } from './types';
import { useUpload } from './useUpload';
import { useUploadPart } from './useUploadPart';
import { useCompleteMultipartUpload } from './useCompleteMultipartUpload';
import { extractInfo, MiB, numberOfParts, relativePath, sizeThreshold } from './utils';

const ID_PREFIX = 'uppy_';

type UploadFile = UppyFile<Meta, AwsBody>;

type Latest = {
    resource: string;
    dataProvider: DataProvider;
    notify: ReturnType<typeof useNotify>;
    translate: ReturnType<typeof useTranslate>;
    doUpload: ReturnType<typeof useUpload>;
    doMultipartUpload: ReturnType<typeof useUploadPart>;
    completeMultipartUpload: ReturnType<typeof useCompleteMultipartUpload>;
    updateUploads: ReturnType<
        typeof useFileContext
    >['uploadStatusController']['updateUploads'];
};

//target of the running upload, set by start()
type Session = { target?: UploadTarget };

const requireTarget = (session: Session): UploadTarget => {
    if (!session.target) throw new Error('Upload not started');
    return session.target;
};

const setState = (
    ctx: Latest,
    target: UploadTarget,
    state: string,
    extra?: Record<string, any>
) => updateUploadState(ctx.dataProvider, ctx.resource, target.id, state, extra);

const createUppy = (
    id: string,
    latest: MutableRefObject<Latest>,
    session: Session,
    uploadInfos: Map<string, UploadInfo>,
    setFiles: (update: (prev: any[]) => any[]) => void
): Uppy<Meta, AwsBody> => {
    const requireInfo = (
        file: { id: string; name?: string },
        field: 'path' | 'uploadId' | 'url'
    ) => {
        const info = uploadInfos.get(file.id);
        if (!info?.[field]) {
            throw new Error(
                latest.current.translate(
                    'messages.upload.complete_multipart_error',
                    { fileName: file.name, missingField: field }
                )
            );
        }
        return info;
    };

    const retry = async (fileId: string) => {
        const ctx = latest.current;
        const target = requireTarget(session);
        try {
            await setState(ctx, target, 'UPLOADING');
            await uppy.retryUpload(fileId);
            const all = uppy.getFiles();
            const { state, files } = uploadResultStatus({
                successful: all.filter(f => f.progress.uploadComplete),
                failed: all.filter(f => f.error),
            });
            await setState(ctx, target, state, { files });
        } catch (error: any) {
            console.error(error);
            setState(ctx, target, 'ERROR', { message: error?.message }).catch(
                console.error
            );
        }
    };

    const track = (file: UploadFile, error?: any) => {
        const { resource, updateUploads } = latest.current;
        const { id: recordId } = requireTarget(session);
        updateUploads({
            id: `${file.id}_${recordId}`,
            filename: file.name,
            progress: file.progress,
            resource,
            resourceId: recordId,
            remove: () => uppy.removeFile(file.id),
            error,
            retry: error ? () => retry(file.id) : undefined,
        });
    };

    const uppy = new Uppy<Meta, AwsBody>({
        id: ID_PREFIX + id,
        onBeforeFileAdded: (currentFile, files) => {
            const { notify, translate } = latest.current;
            if (currentFile.isRemote) {
                notify(translate('messages.upload.remote_files_unsupported'), {
                    type: 'error',
                });
                return false;
            }

            //allow a single file for zip
            const existing = Object.values(files);
            if (
                existing.some(f => f.type === 'application/zip') ||
                (existing.length > 0 && currentFile.type === 'application/zip')
            ) {
                notify(translate('messages.upload.single_zip_file_supported'), {
                    type: 'error',
                });
                return false;
            }

            return true;
        },
    });

    uppy.use(AwsS3, {
        id: 'AwsS3',
        shouldUseMultipart: file =>
            file.size !== null && numberOfParts(file) > 1,
        getChunkSize: () => sizeThreshold * MiB,
        getUploadParameters: async file => ({
            method: 'PUT',
            url: requireInfo(file, 'url').url,
            fields: {},
            headers: file.type ? { 'Content-Type': file.type } : undefined,
        }),
        createMultipartUpload: async file => {
            const info = uploadInfos.get(file.id);
            if (!info?.uploadId) {
                throw new Error(
                    latest.current.translate(
                        'messages.upload.create_multipart_error'
                    )
                );
            }
            return { uploadId: info.uploadId, key: file.name || '' };
        },
        abortMultipartUpload: async () => {},
        signPart: async (file, { signal, uploadId, partNumber }) => {
            signal?.throwIfAborted();
            const { resource, doMultipartUpload, translate } = latest.current;
            const { id: recordId } = requireTarget(session);
            const info = requireInfo(file, 'path');
            try {
                return await doMultipartUpload({
                    resource,
                    id: recordId,
                    path: info.path,
                    uploadId: uploadId ?? requireInfo(file, 'uploadId').uploadId!,
                    partNumber,
                });
            } catch (error: any) {
                console.error(error);
                throw new Error(
                    translate('messages.upload.upload_part_error', {
                        partNumber,
                        fileName: file.name,
                        message: error.message,
                    })
                );
            }
        },
        listParts: async () => [],
        completeMultipartUpload: async (file, { uploadId, parts }) => {
            const { resource, completeMultipartUpload, translate } =
                latest.current;
            const { id: recordId } = requireTarget(session);
            const info = requireInfo(file, 'path');
            try {
                await completeMultipartUpload({
                    resource,
                    id: recordId,
                    path: info.path,
                    uploadId: uploadId ?? requireInfo(file, 'uploadId').uploadId!,
                    partList: parts.map((part: any) => part.etag),
                });
            } catch (error: any) {
                console.error(error);
                throw new Error(
                    translate(
                        'messages.upload.complete_multipart_server_error',
                        { fileName: file.name, message: error.message }
                    )
                );
            }
            return {};
        },
    });

    uppy.on('file-added', file => {
        setFiles(prev => [
            ...prev.filter(f => f.id !== file.id),
            { id: file.id, info: extractInfo(file) },
        ]);
    })
        .on('file-removed', file => {
            if (file) setFiles(prev => prev.filter(f => f.id !== file.id));
        })
        .on('upload-progress', file => {
            if (file) track(file);
        })
        .on('upload-error', (file, error) => {
            if (file) track(file, error);
        });

    return uppy;
};

/**
 * Fetch upload urls and upload all files for the persisted entity `target`.
 * Runs detached from the component lifecycle.
 */
const startUpload = async (
    uppy: Uppy<Meta, AwsBody>,
    uploadInfos: Map<string, UploadInfo>,
    ctx: Latest,
    target: UploadTarget
) => {
    const { resource, doUpload, notify, translate } = ctx;
    const { id, name } = target;

    try {
        await setState(ctx, target, 'UPLOADING');

        for (const file of uppy.getFiles()) {
            const info = await doUpload(
                { resource, id, name, filename: relativePath(file) },
                numberOfParts(file) > 1
            );
            uploadInfos.set(file.id, info);
        }

        const result: UploadResult<Meta, AwsBody> | undefined =
            await uppy.upload();
        if (result) {
            const { state, files } = uploadResultStatus(result);
            await setState(ctx, target, state, { files });
        }
    } catch (error: any) {
        console.error(error);
        notify(translate('messages.upload.upload_start_error'), {
            type: 'error',
        });
        setState(ctx, target, 'ERROR', { message: error?.message }).catch(
            console.error
        );
    }
};

/**
 * Uploader for the current resource, owned by the page. `id` is the placeholder
 * entity id used before save. Files are only collected locally: `start(target)`
 * uploads them for the persisted entity.
 */
export const useResourceUploader = (props: { id: string }): ResourceUploader => {
    const { id } = props;
    const resource = useResourceContext();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const translate = useTranslate();
    const doUpload = useUpload();
    const doMultipartUpload = useUploadPart();
    const completeMultipartUpload = useCompleteMultipartUpload();
    const {
        uploadStatusController: { updateUploads },
    } = useFileContext();

    const [files, setFiles] = useState<any[]>([]);

    //uppy handlers are attached once and read the latest values from here
    const latest = useRef<Latest>(null as unknown as Latest);
    latest.current = {
        resource: resource ?? '',
        dataProvider,
        notify,
        translate,
        doUpload,
        doMultipartUpload,
        completeMultipartUpload,
        updateUploads,
    };

    const [session] = useState<Session>(() => ({}));
    const [uploadInfos] = useState(() => new Map<string, UploadInfo>());
    const [uppy] = useState(() =>
        createUppy(id, latest, session, uploadInfos, setFiles)
    );

    //detached: files upload in background after the entity is persisted
    const start = (target: UploadTarget) => {
        if (uppy.getFiles().length === 0) return;
        session.target = target;
        void startUpload(uppy, uploadInfos, latest.current, target);
    };

    return { id, uppy, files, start };
};
