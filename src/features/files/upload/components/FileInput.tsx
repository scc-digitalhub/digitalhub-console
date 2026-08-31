// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Dashboard } from '@uppy/react';
import {
    CommonInputProps,
    Labeled,
    useResourceContext,
    useTheme,
} from 'react-admin';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Uploader } from '../types';
import {
    PREFIX,
    UploadDashboard,
} from './UploadDashboard';

export const FileInput = (props: FileInputProps) => {
    const { uploader, source } = props;
    const [theme] = useTheme();
    const resource = useResourceContext(props);

    //update path in source depending on upload
    const { setValue } = useFormContext();
    useEffect(() => {
        if (uploader && uploader.path) {
            setValue(source, uploader.path, { shouldValidate: true, shouldDirty: true });
        }
    }, [uploader?.path]);

    if (!uploader) {
        return null;
    }

    return (
        <UploadDashboard className={PREFIX} direction={'column'}>
            <Labeled label="fields.files.title">
                <Dashboard
                    uppy={uploader.uppy}
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

export type FileInputProps = Omit<CommonInputProps, 'defaultValue'> & {
    uploader: Uploader;
};
