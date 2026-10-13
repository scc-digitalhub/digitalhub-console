// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Dashboard } from '@uppy/react';
import { Labeled, useTheme } from 'react-admin';
import { useEffect } from 'react';
import { useUploader } from '../UploaderContext';
import { FileSelection } from '../types';
import { toFileSelection } from '../utils';
import { PREFIX, UploadDashboard } from './UploadDashboard';

/**
 * File picker for the uploader in context. Reports the selection, never paths.
 */
export const FileInput = (props: FileInputProps) => {
    const { onChange } = props;
    const uploader = useUploader();
    const [theme] = useTheme();
    const uppy = uploader?.uppy;

    useEffect(() => {
        if (!uppy || !onChange) return;

        const handler = () => onChange(toFileSelection(uppy.getFiles()));
        uppy.on('files-added', handler).on('file-removed', handler);
        return () => {
            uppy.off('files-added', handler);
            uppy.off('file-removed', handler);
        };
    }, [uppy, onChange]);

    if (!uppy) {
        return null;
    }

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
    onChange?: (selection: FileSelection) => void;
};
