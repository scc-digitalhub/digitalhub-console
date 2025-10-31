import { useRootSelector } from '@dslab/ra-root-selector';

import { useEffect, useState } from 'react';
import {
    DateField,
    FunctionField,
    Labeled,
    RecordContextProvider,
    TextField,
    useDataProvider,
} from 'react-admin';
import { CardContent, Divider, Stack, Typography } from '@mui/material';

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
import { ShareButton } from './ShareButton';

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
