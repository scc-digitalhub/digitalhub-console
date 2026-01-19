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
} from 'react-admin';
import { CardContent, Divider, Stack, Typography } from '@mui/material';
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
}) => {
    const { file, onDelete } = props;
    const getFileInfo = useGetFileInfo();
    const [info, setInfo] = useState<FileInfo | null>(null);

    useEffect(() => {
        if (file) {
            getFileInfo({ path: file.path }).then(json => {
                if (json && json.length > 0) {
                    setInfo({ ...json[0], path: file.path });
                }
            });
        }
    }, [file, getFileInfo, setInfo]);

    if (!file) {
        return <></>;
    }

    const fileType =
        (file?.content_type
            ? getTypeFromMimeType(file.content_type)
            : undefined) ||
        getTypeFromMimeType(
            getMimeTypeFromExtension(file.name.split('.').pop())
        );

    const isPreviewable = fileType && ['image', 'text'].includes(fileType);

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

                <Divider />

                {info && (
                    <RecordContextProvider value={info}>
                        <Stack
                            direction={'row'}
                            pb={2}
                            justifyContent="space-around"
                        >
                            <DownloadButton
                                size="small"
                                iconButton
                                color="success"
                            />
                            <PreviewButton
                                size="small"
                                iconButton
                                disabled={!isPreviewable}
                            />
                            <ShareButton size="small" iconButton />
                            <DeleteButton
                                size="small"
                                iconButton
                                onDelete={() => onDelete && onDelete(file)}
                            />
                        </Stack>

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
