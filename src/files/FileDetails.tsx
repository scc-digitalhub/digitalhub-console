import { useRootSelector } from '@dslab/ra-root-selector';

import { useEffect, useState, MouseEvent } from 'react';
import {
    DateField,
    FunctionField,
    Labeled,
    RecordContextProvider,
    TextField,
    useDataProvider,
} from 'react-admin';
import {
    CardContent,
    Divider,
    Popover,
    Stack,
    Typography,
} from '@mui/material';

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
import { IdField } from '../components/IdField';

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

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

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
                                <IdField
                                    source="path"
                                    noWrap
                                    aria-owns={
                                        open ? 'mouse-over-popover' : undefined
                                    }
                                    aria-haspopup="true"
                                    onMouseEnter={handlePopoverOpen}
                                    onMouseLeave={handlePopoverClose}
                                />
                            </Labeled>
                            <Popover
                                id="mouse-over-popover"
                                sx={{ pointerEvents: 'none' }}
                                open={open}
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                onClose={handlePopoverClose}
                                disableRestoreFocus
                                slotProps={{
                                    paper: {
                                        variant: 'outlined',
                                        square: true,
                                    },
                                }}
                            >
                                <Typography variant="body2" sx={{ p: 1 }}>
                                    {info.path}
                                </Typography>
                            </Popover>
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
