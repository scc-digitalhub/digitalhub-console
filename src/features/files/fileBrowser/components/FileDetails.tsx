// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import {
    DateField,
    FunctionField,
    Labeled,
    RecordContextProvider,
    TextField,
    TopToolbar,
} from 'react-admin';
import { CardContent, Stack, Typography } from '@mui/material';
import { PreviewButton } from '../../download/components/PreviewButton';
import { DownloadButton } from '../../download/components/DownloadButton';
import { prettyBytes } from '../utils';
import { DeleteButton } from '../../delete/components/DeleteButton';
import { FileIcon } from './FileIcon';
import { ShareButton } from '../../download/components/ShareButton';
import { useGetFileInfo } from '../../info/useGetInfo';
import { FileInfo } from '../../info/types';
import { getMimeTypeFromExtension, getTypeFromMimeType } from '../../utils';
import { FlatCard } from '../../../../common/components/layout/FlatCard';
import { IdField } from '../../../../common/components/fields/IdField';

export const FileDetails = (props: {
    file: any | null;
    onDelete?: (file) => void;
    onDownload?: (file) => void;
    onPreview?: (file) => void;
    readOnly?: boolean;
}) => {
    const { file, onDelete, readOnly = false } = props;
    const getFileInfo = useGetFileInfo();
    const [info, setInfo] = useState<FileInfo | null>(null);
    const path: string | undefined = file?.path;

    useEffect(() => {
        setInfo(null);
        if (path) {
            getFileInfo({ path }).then(json => {
                if (json && json.data?.length > 0) {
                    setInfo({ ...json.data[0], path });
                }
            });
        }
    }, [path, getFileInfo]);

    if (!file) {
        return <></>;
    }

    const fileType =
        (file?.content_type
            ? getTypeFromMimeType(file.content_type)
            : undefined) ||
        getTypeFromMimeType(
            getMimeTypeFromExtension(file.name.split('.').pop())
        ) ||
        // details always refer to a file: avoid FileIcon's folder fallback
        'file';

    return (
        <FlatCard>
            <CardContent>
                <Stack direction={'row'} gap={1}>
                    <FileIcon fontSize="large" fileType={fileType} />
                    <Typography
                        variant="h6"
                        sx={{
                            textWrap: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            width: '100%',
                        }}
                    >
                        {file.name}
                    </Typography>
                </Stack>

                {info && (
                    <RecordContextProvider value={info}>
                        <TopToolbar>
                            <DownloadButton
                                size="small"
                                iconButton
                                color="success"
                            />
                            <PreviewButton size="small" iconButton />
                            <ShareButton size="small" iconButton />
                            {!readOnly && (
                                <DeleteButton
                                    size="small"
                                    iconButton
                                    onDelete={() => onDelete?.(file)}
                                />
                            )}
                        </TopToolbar>

                        <Stack spacing={1}>
                            <Labeled>
                                <TextField source="name" />
                            </Labeled>
                            <Labeled>
                                <IdField
                                    source="path"
                                    noWrap
                                    truncate={30}
                                    label="fields.path.title"
                                />
                            </Labeled>
                            <Labeled>
                                <TextField source="content_type" />
                            </Labeled>
                            <Labeled>
                                <FunctionField
                                    source="size"
                                    sortable={false}
                                    render={r =>
                                        r.size ? prettyBytes(r.size, 2) : ''
                                    }
                                />
                            </Labeled>
                            <Labeled>
                                <DateField showTime source="last_modified" />
                            </Labeled>
                            {info.hash && (
                                <Labeled>
                                    <IdField
                                        source="hash"
                                        noWrap
                                        truncate={30}
                                        copy={false}
                                    />
                                </Labeled>
                            )}
                        </Stack>
                    </RecordContextProvider>
                )}
            </CardContent>
        </FlatCard>
    );
};
