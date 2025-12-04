// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Dashboard } from '@uppy/react';
import { styled } from '@mui/system';
import {
    CommonInputProps,
    Labeled,
    useInput,
    useResourceContext,
    useTheme,
} from 'react-admin';
import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { UploadController } from '../controllers/uploadController';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

export const FileInput = (props: FileInputProps) => {
    const { uploader, source } = props;
    const [theme] = useTheme();
    const resource = useResourceContext(props);

    //update path in source depending on upload
    const { field } = useInput({ resource, source });
    useEffect(() => {
        if (uploader && field && uploader.path) {
            field.onChange(uploader.path);
        }
    }, [uploader?.path]);

    if (!uploader) {
        return null;
    }

    return (
        <Uploader className={PREFIX} direction={'column'}>
            <Labeled label="fields.files.title">
                <Dashboard
                    uppy={uploader.uppy}
                    theme={theme === 'dark' ? 'dark' : 'light'}
                    hideUploadButton
                    disableThumbnailGenerator
                    proudlyDisplayPoweredByUppy={false}
                    width={'100%'}
                    height={'180px'}
                />
            </Labeled>
        </Uploader>
    );
};

export type FileInputProps = Omit<CommonInputProps, 'defaultValue'> & {
    uploader: UploadController;
};

const PREFIX = 'UppyUploader';
export const Uploader = styled(Stack, {
    name: PREFIX,
})(({ theme }) => ({
    width: '100%',
    [`& .uppy-Dashboard-inner`]: { border: '0 none' },
    [`& .uppy-Dashboard-AddFiles-title`]: {
        fontSize: (theme.typography as any)['body1'].fontSize,
    },
    [`& .uppy-Dashboard-Item`]: {
        height: '128px',
        [`& .uppy-Dashboard-Item-preview`]: {
            height: '64px',
        },
    },
}));
