// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useTranslate } from 'react-admin';
import { Box, Typography } from '@mui/material';
import { useGetStores } from '../../stores/useGetStores';
import { FileBrowser } from '../../fileBrowser/components/FileBrowser';
import { FilePreview } from '../../filePreview/components/FilePreview';
import { EmptyMessage } from '../../../../common/components/layout/EmptyMessage';
import { Spinner } from '../../../../common/components/layout/Spinner';

/**
 * Explore the files referenced by `path` (e.g. `record.spec.path`):
 * - folder (ends with `/`) on a supported store: browser locked to `path`
 * - file: preview of the single file
 */
export const FileExplorer = (props: { path: string; readOnly?: boolean }) => {
    const { path, readOnly = true } = props;
    const translate = useTranslate();
    const isFolder = path.endsWith('/');

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom>
                {translate('fields.status.files')}
            </Typography>
            {isFolder ? (
                <FolderExplorer path={path} readOnly={readOnly} />
            ) : (
                <FilePreview file={{ path }} readOnly={readOnly} />
            )}
        </Box>
    );
};

const FolderExplorer = (props: { path: string; readOnly: boolean }) => {
    const { path, readOnly } = props;
    const getStores = useGetStores();
    const [stores, setStores] = useState<string[] | null>(null);

    useEffect(() => {
        getStores()
            .then(json => setStores(json || []))
            .catch(() => setStores([]));
    }, [getStores]);

    if (stores === null) {
        return <Spinner />;
    }

    const isSupported = stores.some(s =>
        path.startsWith(s.endsWith('/') ? s : s + '/')
    );

    if (!isSupported) {
        return <EmptyMessage message="fields.info.empty" />;
    }

    return <FileBrowser key={path} root={path} readOnly={readOnly} />;
};
