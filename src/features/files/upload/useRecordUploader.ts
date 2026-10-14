// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { MutableRefObject, useCallback, useRef, useState } from 'react';
import { AwsS3, Uppy } from 'uppy';
import { AwsBody } from '@uppy/aws-s3';
import { UploadResult } from '@uppy/core';
import { Body, Meta, UppyFile } from '@uppy/utils/lib/UppyFile';
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
import {
    ResourceUploader,
    UploadInfo,
    UploadSlot,
    UploadTarget,
    PathResolutionContext,
} from './types';
import { useUpload } from './useUpload';
import { useUploadPart } from './useUploadPart';
import { useCompleteMultipartUpload } from './useCompleteMultipartUpload';
import { extractInfo, MiB, numberOfParts, relativePath, sizeThreshold } from './utils';

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

type UploadTransport = {
    getUploadInfo: (file: UppyFile<Meta, Body>) => Promise<UploadInfo>;
    signPart: (
        file: UppyFile<Meta, Body>,
        uploadId: string,
        partNumber: number
    ) => Promise<UploadInfo>;
    complete: (
        file: UppyFile<Meta, Body>,
        uploadId: string,
        partList: string[]
    ) => Promise<void>;
};

// Per-slot target and transport are resolved by prepare().
type Session = {
    target?: UploadTarget;
    transport?: UploadTransport;
    prepared?: boolean;
};

type RegisteredSlot = UploadSlot & {
    session: Session;
    uploadInfos: Map<string, UploadInfo>;
};

const requireTarget = (session: Session): UploadTarget => {
    if (!session.target) throw new Error('Upload not started');
    return session.target;
};

const findById = (record: any, targetId: string): any => {
    if (!record || typeof record !== 'object') return undefined;
    if (record.id != null && String(record.id) === String(targetId)) {
        return record;
    }
    for (const extension of record.extensions ?? []) {
        const match = findById(extension, targetId);
        if (match) return match;
    }
    return undefined;
};

const findUniqueExtensionByName = (record: any, targetName: string): any => {
    const matches = (record?.extensions ?? []).filter(
        (extension: any) => extension.name === targetName
    );
    return matches.length === 1 ? matches[0] : undefined;
};

const resolveNestedTarget = (
    data: any,
    context: NonNullable<UploadSlot['target']>
): UploadTarget | undefined => {
    const savedTarget =
        (context.id ? findById(data, context.id) : undefined) ??
        (context.name ? findUniqueExtensionByName(data, context.name) : undefined);
    if (savedTarget?.id && savedTarget?.name) {
        return {
            id: savedTarget.id,
            name: savedTarget.name,
            resource: context.resource,
        };
    }
    if (context.id && context.name) {
        return {
            id: context.id,
            name: context.name,
            resource: context.resource,
        };
    }
    return undefined;
};

const resolveSlotTarget = (
    data: any,
    slot: RegisteredSlot,
    parentResource: string
): UploadTarget | undefined => {
    const context = slot.target;
    const isNestedTarget =
        context?.resource != null && context.resource !== parentResource;

    if (isNestedTarget && context) return resolveNestedTarget(data, context);

    if (data?.id && data?.name) {
        return {
            id: data.id,
            name: data.name,
            resource: context?.resource ?? parentResource,
        };
    }
    if (context?.id && context.name) {
        return {
            id: context.id,
            name: context.name,
            resource: context.resource ?? parentResource,
        };
    }
    return undefined;
};

const setState = (
    ctx: Latest,
    target: UploadTarget,
    state: string,
    extra?: Record<string, any>
) =>
    updateUploadState(
        ctx.dataProvider,
        target.resource ?? ctx.resource,
        target.id,
        state,
        extra
    );

const configureUppy = (
    uppy: Uppy<Meta, AwsBody>,
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
        const { updateUploads } = latest.current;
        const target = requireTarget(session);
        const { id: recordId } = target;
        updateUploads({
            id: `${file.id}_${recordId}`,
            filename: file.name,
            progress: file.progress,
            resource: target.resource ?? latest.current.resource,
            resourceId: recordId,
            remove: () => uppy.removeFile(file.id),
            error,
            retry: error ? () => retry(file.id) : undefined,
        });
    };

    uppy.use(AwsS3, {
        id: 'AwsS3',
        shouldUseMultipart: file =>
            file.size !== null && numberOfParts(file) > 1,
        getChunkSize: () => sizeThreshold * MiB,
        getUploadParameters: file => ({
            method: 'PUT',
            url: requireInfo(file, 'url').url,
            fields: {},
            headers: file.type ? { 'Content-Type': file.type } : undefined,
        }),
        createMultipartUpload: file => {
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
            if (!session.transport) throw new Error('Upload not prepared');
            requireInfo(file, 'path');
            return session.transport.signPart(
                file,
                uploadId ?? requireInfo(file, 'uploadId').uploadId!,
                partNumber
            );
        },
        listParts: () => [],
        completeMultipartUpload: async (file, { uploadId, parts }) => {
            if (!session.transport) throw new Error('Upload not prepared');
            requireInfo(file, 'path');
            await session.transport.complete(
                file,
                uploadId ?? requireInfo(file, 'uploadId').uploadId!,
                parts.map((part: any) => part.etag)
            );
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
            if (file) {
                console.log('[uploader] file upload error', {
                    file: file.name,
                    message: error?.message,
                });
                track(file, error);
            }
        });

    return uppy;
};

/**
 * Fetch upload urls and upload all files for the persisted entity `target`.
 * Runs detached from the component lifecycle.
 */
const startUpload = async (
    uppy: Uppy<Meta, AwsBody>,
    ctx: Latest,
    session: Session
) => {
    const { notify, translate } = ctx;
    const target = requireTarget(session);
    console.log('[uploader] starting transfer', {
        resource: target.resource ?? ctx.resource,
        id: target.id,
        name: target.name,
        files: uppy.getFiles().map(file => file.name),
    });

    try {
        await setState(ctx, target, 'UPLOADING');

        const result: UploadResult<Meta, AwsBody> | undefined =
            await uppy.upload();
        console.log('[uploader] transfer finished', {
            resource: target.resource ?? ctx.resource,
            id: target.id,
            successful: result?.successful?.length ?? 0,
            failed: result?.failed?.length ?? 0,
        });
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

const createResourceUploadTransport = (
    ctx: Latest,
    target: UploadTarget,
    uploadInfos: Map<string, UploadInfo>,
    resolutionContext: PathResolutionContext
): UploadTransport => ({
    getUploadInfo: async file => {
        const filename = [
            resolutionContext.filenamePrefix,
            relativePath(file),
        ]
            .filter(Boolean)
            .join('/');
        console.log('[uploader] resolving upload info', {
            resource: resolutionContext.resource,
            id: resolutionContext.id,
            name: resolutionContext.name,
            filename,
            uploadTarget: {
                resource: target.resource ?? ctx.resource,
                id: target.id,
                name: target.name,
            },
        });
        const info = await ctx.doUpload(
            {
                resource: resolutionContext.resource,
                id: resolutionContext.id,
                name: resolutionContext.name,
                filename,
            },
            numberOfParts(file) > 1
        );
        uploadInfos.set(file.id, info);
        console.log('[uploader] upload info resolved', {
            file: file.name,
            hasUrl: Boolean(info.url),
            hasUploadId: Boolean(info.uploadId),
        });
        return info;
    },
    signPart: async (file, uploadId, partNumber) => {
        const info = uploadInfos.get(file.id);
        if (!info?.path) throw new Error('Upload path not available');
        try {
            return await ctx.doMultipartUpload({
                resource: target.resource ?? ctx.resource,
                id: target.id,
                path: info.path,
                uploadId,
                partNumber,
            });
        } catch (error: any) {
            console.error(error);
            throw new Error(
                ctx.translate('messages.upload.upload_part_error', {
                    partNumber,
                    fileName: file.name,
                    message: error.message,
                })
            );
        }
    },
    complete: async (file, uploadId, partList) => {
        const info = uploadInfos.get(file.id);
        if (!info?.path) throw new Error('Upload path not available');
        try {
            await ctx.completeMultipartUpload({
                resource: target.resource ?? ctx.resource,
                id: target.id,
                path: info.path,
                uploadId,
                partList,
            });
        } catch (error: any) {
            console.error(error);
            throw new Error(
                ctx.translate(
                    'messages.upload.complete_multipart_server_error',
                    { fileName: file.name, message: error.message }
                )
            );
        }
    },
});

/**
 * Form coordinator for local file slots. Saved records are resolved before
 * start so the transfer itself needs no record arguments.
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
        backgroundUploadManager,
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

    const slots = useRef(new Map<string, RegisteredSlot>());

    const registerSlot = useCallback((slot: UploadSlot) => {
        let registered = slots.current.get(slot.id);
        if (!registered) {
            registered = {
                ...slot,
                session: {},
                uploadInfos: new Map(),
            };
            slots.current.set(slot.id, registered);
            configureUppy(
                slot.uppy,
                latest,
                registered.session,
                registered.uploadInfos,
                setFiles
            );
        } else {
            Object.assign(registered, slot);
        }
        console.log('[uploader] slot registered', {
            slotId: slot.id,
            target: slot.target,
            resolutionContext: slot.resolutionContext,
            files: slot.uppy.getFiles().map(file => file.name),
        });

        setFiles(previous => [
            ...previous.filter(
                file =>
                    !slot.uppy
                        .getFiles()
                        .some(selected => selected.id === file.id)
            ),
            ...slot.uppy.getFiles().map(file => ({
                id: file.id,
                info: extractInfo(file),
            })),
        ]);
    }, []);

    const prepare = async (data: any) => {
        console.log('[uploader] preparing slots', {
            resource: resource ?? '',
            slotCount: slots.current.size,
            savedRecordId: data?.id,
            extensions: data?.extensions?.map((extension: any) => ({
                id: extension.id,
                name: extension.name,
            })),
        });
        for (const slot of Array.from(slots.current.values())) {
            const target = resolveSlotTarget(data, slot, resource ?? '');
            if (!target) {
                console.log('[uploader] slot target unresolved', {
                    slotId: slot.id,
                    requestedTarget: slot.target,
                    files: slot.uppy.getFiles().map(file => file.name),
                });
                if (slot.uppy.getFiles().length > 0) {
                    notify('messages.upload.upload_start_error', {
                        type: 'error',
                    });
                }
                continue;
            }
            slot.session.target = {
                id: target.id,
                name: target.name,
                resource: target.resource ?? resource ?? '',
            };
            const resolutionContext = slot.resolutionContext ?? {
                resource: target.resource ?? resource ?? '',
                id: target.id,
                name: target.name,
            };
            slot.session.transport = createResourceUploadTransport(
                latest.current,
                slot.session.target,
                slot.uploadInfos,
                resolutionContext
            );
            slot.session.prepared = false;
            console.log('[uploader] slot target resolved', {
                slotId: slot.id,
                target: slot.session.target,
                resolutionContext,
                files: slot.uppy.getFiles().map(file => file.name),
            });
        }

        await Promise.all(
            Array.from(slots.current.values()).map(async slot => {
                if (!slot.session.target || !slot.session.transport) return;
                try {
                    await Promise.all(
                        slot.uppy.getFiles().map(async file => {
                            const info = await slot.session.transport!.getUploadInfo(
                                file
                            );
                            slot.uploadInfos.set(file.id, info);
                        })
                    );
                    slot.session.prepared = true;
                    console.log('[uploader] slot prepared', {
                        slotId: slot.id,
                        fileCount: slot.uppy.getFiles().length,
                    });
                } catch (error: any) {
                    console.log('[uploader] slot preparation failed', {
                        slotId: slot.id,
                        message: error?.message,
                    });
                    const target = slot.session.target;
                    if (target) {
                        await setState(
                            latest.current,
                            target,
                            'ERROR',
                            { message: error?.message }
                        ).catch(console.error);
                    }
                    notify(translate('messages.upload.upload_start_error'), {
                        type: 'error',
                    });
                }
            })
        );
    };

    const start = () => {
        const jobs: Array<() => Promise<void>> = [];
        for (const slot of Array.from(slots.current.values())) {
            const target = slot.session.target;
            if (
                !target ||
                !slot.session.prepared ||
                slot.uppy.getFiles().length === 0
            ) {
                console.log('[uploader] slot not queued', {
                    slotId: slot.id,
                    hasTarget: Boolean(target),
                    prepared: Boolean(slot.session.prepared),
                    fileCount: slot.uppy.getFiles().length,
                });
                continue;
            }
            console.log('[uploader] queueing slot', {
                slotId: slot.id,
                target,
                fileCount: slot.uppy.getFiles().length,
            });
            jobs.push(() =>
                startUpload(
                    slot.uppy,
                    latest.current,
                    slot.session
                )
            );
        }
        console.log('[uploader] starting queued jobs', { jobCount: jobs.length });
        backgroundUploadManager.start(jobs);
    };

    return { id, files, registerSlot, prepare, start };
};
