import { useRootSelector } from '@dslab/ra-root-selector';

import React, { useEffect, useState } from 'react';
import {
    Button,
    Datagrid,
    DateField,
    FileField,
    FunctionField,
    Labeled,
    Link,
    ListContextProvider,
    ListView,
    NumberField,
    RecordContextProvider,
    ResourceContextProvider,
    TextField,
    Toolbar,
    TopToolbar,
    useDataProvider,
    useList,
    useTranslate,
} from 'react-admin';
import { useProjectPermissions } from '../provider/authProvider';
import {
    Box,
    Breadcrumbs,
    CardContent,
    Container,
    Divider,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import { PageTitle } from '../components/PageTitle';
import BrowserIcon from '@mui/icons-material/Inventory2';
import ReloadIcon from '@mui/icons-material/Replay';
import UploadIcon from '@mui/icons-material/Upload';
import { StateChips } from '../components/StateChips';

import FolderRounded from '@mui/icons-material/FolderRounded';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DocumentFileIcon from '@mui/icons-material/Article';
import PublicIcon from '@mui/icons-material/Public';
import TableChart from '@mui/icons-material/TableChart';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import GenericFileIcon from '@mui/icons-material/InsertDriveFile';
import AudioFileIcon from '@mui/icons-material/AudioFile';

import { PreviewButton } from './PreviewButton';
import { FlatCard } from '../components/FlatCard';
import { DownloadButton } from './DownloadButton';
import {
    getMimeTypeFromExtension,
    getTypeFromMimeType,
    prettyBytes,
} from './utils';
import { DeleteButton } from './DeleteButton';
import { FileIcon } from './FileIcon';

export const FileDetails = (props: {
    file: any | null;
    onDelete?: (file) => void;
    onDownload?: (file) => void;
    onPreview?: (file) => void;
}) => {
    const { file, onDelete, onDownload, onPreview } = props;
    const { root: projectId } = useRootSelector();

    const dataProvider = useDataProvider();
    const [info, setInfo] = useState<any | null>(null);

    useEffect(() => {
        if (dataProvider && file) {
            dataProvider
                .invoke({
                    path: '/-/' + projectId + '/files/info',
                    params: { path: file.path },
                    options: { method: 'GET' },
                })
                .then(json => {
                    if (json && json.length > 0) {
                        setInfo({ ...json[0], path: file.path });
                    }
                });
        }
    }, [dataProvider, file, setInfo]);

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
                        <Stack direction={'row'} gap={1} pb={2}>
                            <DownloadButton size="small" color="success" />
                            <PreviewButton
                                size="small"
                                disabled={!isPreviewable}
                            />
                            <DeleteButton
                                size="small"
                                onDelete={() => onDelete && onDelete(file)}
                            />
                        </Stack>

                        <Stack spacing={1}>
                            <Labeled>
                                <TextField source="name" />
                            </Labeled>
                            <Labeled>
                                <TextField source="path" />
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
                                    <TextField source="hash" />
                                </Labeled>
                            )}
                            {/* <Labeled label="size">
                                <>{prettyBytes(info.size, 2)}</>
                            </Labeled>
                            <Labeled label="mimeType">
                                {info.content_type}
                            </Labeled> */}
                        </Stack>
                    </RecordContextProvider>
                )}
            </CardContent>
        </FlatCard>
    );
};
