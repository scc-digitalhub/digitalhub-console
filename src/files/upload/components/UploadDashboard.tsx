// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { styled } from '@mui/system';
import { Stack } from '@mui/material';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

export const PREFIX = 'UppyUploader';

export const UploadDashboard = styled(Stack, {
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
