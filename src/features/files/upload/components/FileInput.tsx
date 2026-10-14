// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Dashboard } from '@uppy/react';
import {
    Labeled,
    useNotify,
    useTheme,
    useTranslate,
} from 'react-admin';
import { useEffect, useId, useState } from 'react';
import { AwsBody } from '@uppy/aws-s3';
import { Meta } from '@uppy/utils/lib/UppyFile';
import { Uppy } from 'uppy';
import { useUploadCoordinator } from '../UploaderContext';
import { FileSelection } from '../types';
import { toFileSelection } from '../utils';
import { PREFIX, UploadDashboard } from './UploadDashboard';

/**
 * File picker for the uploader in context. Reports the selection, never paths.
 */
export const FileInput = (props: FileInputProps) => {
    const { onChange } = props;
    const uploader = useUploadCoordinator();
    const [theme] = useTheme();
    const notify = useNotify();
    const translate = useTranslate();
    const reactId = useId();
    const [uppy] = useState(
        () =>
            new Uppy<Meta, AwsBody>({
                id: `file-input-${reactId}`,
                onBeforeFileAdded: (currentFile, files) => {
                    if (currentFile.isRemote) {
                        notify(
                            translate(
                                'messages.upload.remote_files_unsupported'
                            ),
                            { type: 'error' }
                        );
                        return false;
                    }

                    const existing = Object.values(files);
                    if (
                        existing.some(
                            file => file.type === 'application/zip'
                        ) ||
                        (existing.length > 0 &&
                            currentFile.type === 'application/zip')
                    ) {
                        notify(
                            translate(
                                'messages.upload.single_zip_file_supported'
                            ),
                            { type: 'error' }
                        );
                        return false;
                    }

                    return true;
                },
            })
    );

    useEffect(() => {
        const handler = () => onChange?.(toFileSelection(uppy.getFiles()), uppy);
        uppy.on('files-added', handler).on('file-removed', handler);
        return () => {
            uppy.off('files-added', handler);
            uppy.off('file-removed', handler);
        };
    }, [uppy, onChange]);

    if (!uploader) return null;

    return (
        <UploadDashboard className={PREFIX} direction={'column'}>
            <Labeled label="fields.files.title">
                <Dashboard
                    uppy={uppy}
                    theme={theme === 'dark' ? 'dark' : 'light'}
                    hideUploadButton
                    disableThumbnailGenerator
                    proudlyDisplayPoweredByUppy={false}
                    fileManagerSelectionType="both"
                    width={'100%'}
                    height={'180px'}
                />
            </Labeled>
        </UploadDashboard>
    );
};

export type FileInputProps = {
    onChange?: (
        selection: FileSelection,
        uppy: Uppy<Meta, AwsBody>
    ) => void;
};
