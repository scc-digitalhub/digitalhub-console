// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    useRecordContext,
    useNotify,
    Button,
    FieldProps,
    ButtonProps,
    RaRecord,
    LoadingIndicator,
    useTranslate,
    IconButtonWithTooltip,
    useResourceContext,
} from 'react-admin';
import PreviewIcon from '@mui/icons-material/Preview';
import CloseIcon from '@mui/icons-material/Close';
import React, {
    Fragment,
    ReactElement,
    useCallback,
    useEffect,
    useState,
} from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/mode-drools';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-text';
import { LazyLog } from '@melloware/react-logviewer';
import { usePapaParse } from 'react-papaparse';
import { DataGrid } from '@mui/x-data-grid';
import {
    Box,
    Breakpoint,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    ImageList,
    ImageListItem,
    Stack,
    styled,
} from '@mui/material';
import { CreateInDialogButtonClasses } from '@dslab/ra-dialog-crud';
import { NoContent } from '../../../components/NoContent';
import {
    getMimeTypeFromExtension,
    getTypeFromMimeType,
} from '../../fileBrowser/utils';
import { useDownload } from '../useDownload';
import {
    DownloadParams,
    ResourceDownloadParams,
} from '../types';

const defaultIcon = <PreviewIcon fontSize="small" />;

//whitelisted source languages for code editor
const languages = {
    'text/x-python': 'python',
    'text/x-java': 'java',
    'text/x-javascript': 'javascript',
    'text/markdown': 'md',
    'text/css': 'css',
    'text/html': 'html',
    'application/json': 'json',
    'application/xml': 'xml',
    'application/x-yaml': 'yaml',
    'text/x-shellscript': 'sh',
};

export const PreviewButton = (props: PreviewButtonProps) => {
    const {
        color = 'info',
        label = 'fields.preview',
        icon = defaultIcon,
        fullWidth = true,
        maxWidth = 'md',
        size = 'medium',
        iconButton = false,
        fileName: fileNameProp,
        sub,
        path: pathProp,
        fileType: fileTypeProp,
        contentType: contentTypeProps,
        ...rest
    } = props;

    const translate = useTranslate();
    const [open, setOpen] = useState(false);

    const resource = useResourceContext(props);
    //could be a file or a whole record
    const record = useRecordContext(props);

    const isLoading = !record;

    const handleDialogOpen = e => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose = e => {
        e.stopPropagation();
        setOpen(false);
    };

    const handleClick = useCallback(e => {
        e.stopPropagation();
    }, []);

    if (!record || (!resource && !pathProp && !record.path)) {
        return <></>;
    }

    const path = pathProp || record.path;
    const fileName = fileNameProp || record.name || '';

    let fileType =
        fileTypeProp ||
        (record.content_type
            ? getTypeFromMimeType(record.content_type)
            : undefined) ||
        getTypeFromMimeType(
            getMimeTypeFromExtension(fileName.split('.').pop())
        );

    let contentType = null;
    const mimeType =
        contentTypeProps ||
        record.content_type ||
        getMimeTypeFromExtension(fileName.split('.').pop());

    if (mimeType && mimeType in languages) {
        fileType = 'source';
        contentType = languages[mimeType];
    }

    return (
        <Fragment>
            {iconButton ? (
                <IconButtonWithTooltip
                    label={label}
                    color={color}
                    size={size}
                    onClick={handleDialogOpen}
                    {...rest}
                >
                    {icon}
                </IconButtonWithTooltip>
            ) : (
                <Button
                    label={label}
                    color={color}
                    onClick={handleDialogOpen}
                    {...rest}
                >
                    {icon}
                </Button>
            )}
            <PreviewDialog
                open={open}
                onClose={handleDialogClose}
                onClick={handleClick}
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                aria-labelledby="logs-dialog-title"
                className={CreateInDialogButtonClasses.dialog}
            >
                <div className={CreateInDialogButtonClasses.header}>
                    <DialogTitle
                        id="logs-dialog-title"
                        className={CreateInDialogButtonClasses.title}
                    >
                        {fileName
                            ? fileName
                            : typeof label === 'string'
                            ? translate(label)
                            : label}
                    </DialogTitle>
                    <IconButton
                        className={CreateInDialogButtonClasses.closeButton}
                        aria-label={translate('ra.action.close')}
                        title={translate('ra.action.close')}
                        onClick={handleDialogClose}
                        size="small"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>

                <DialogContent>
                    {isLoading ? (
                        <LoadingIndicator />
                    ) : fileType ? (
                        <PreviewView
                            fileType={fileType}
                            contentType={contentType}
                            path={path}
                            resource={resource}
                            id={record.id}
                            sub={sub}
                        />
                    ) : (
                        <NoContent message="error.preview_not_available" />
                    )}
                </DialogContent>
            </PreviewDialog>
        </Fragment>
    );
};

const PreviewDialog = styled(Dialog, {
    name: 'RaCreateInDialogButton',
    overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${CreateInDialogButtonClasses.title}`]: {
        padding: theme.spacing(0),
    },
    [`& .${CreateInDialogButtonClasses.header}`]: {
        padding: theme.spacing(2, 2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    [`& .${CreateInDialogButtonClasses.closeButton}`]: {
        height: 'fit-content',
    },
}));

const PreviewView = (props: PreviewViewProps) => {
    const { path, resource, id, sub, fileType, contentType = 'text' } = props;
    const notify = useNotify();
    const download = useDownload();

    const [url, setUrl] = useState<any>(undefined);
    const [content, setContent] = useState<any>(undefined);

    const ref = React.createRef<LazyLog>();

    useEffect(() => {
        let params: DownloadParams | ResourceDownloadParams | undefined =
            undefined;
        if (resource && id) {
            params = { resource, id, sub };
        } else if (path) {
            params = { path };
        }
        if (!params) return;

        download(params)
            .then(data => {
                if (data?.url) {
                    setUrl(data.url);
                    if ('source' == fileType) {
                        fetch(data.url)
                            .then(res => res.text())
                            .then(text => {
                                setContent(text);
                            });
                    }
                } else {
                    notify('ra.message.not_found', {
                        type: 'error',
                    });
                }
            })
            .catch(error => {
                const e =
                    typeof error === 'string'
                        ? error
                        : error.message || 'error';
                notify(e);
            });
    }, [download, fileType, id, notify, path, resource, sub]);

    return (
        <Stack>
            <Box sx={{ pt: 2 }}>
                {fileType === 'html' && (
                    <iframe
                        title="preview-ext"
                        src={url}
                        width={'100%'}
                        height={'100%'}
                        style={{ border: 'none' }}
                    ></iframe>
                )}
                {fileType === 'image' && (
                    <ImageList cols={1}>
                        <ImageListItem>
                            <img
                                alt="preview-img"
                                src={url}
                                // width={'100%'}
                                style={{ border: 'none' }}
                            ></img>
                        </ImageListItem>
                    </ImageList>
                )}
                {fileType === 'source' && contentType && (
                    <AceEditor
                        mode={contentType}
                        readOnly={true}
                        theme={'monokai'}
                        wrapEnabled
                        width={'100%'}
                        setOptions={{
                            useWorker: false,
                            showPrintMargin: false,
                        }}
                        value={content}
                    />
                )}
                {url && fileType === 'text' && (
                    <LogViewer sx={{ height: '100%', minHeight: '520px' }}>
                        <LazyLog
                            ref={ref}
                            url={url}
                            caseInsensitive={true}
                            enableLineNumbers={true}
                            enableLinks={false}
                            enableMultilineHighlight={true}
                            enableSearch={true}
                            enableSearchNavigation={true}
                            selectableLines={true}
                            width={'auto'}
                        />
                    </LogViewer>
                )}
                {url && fileType === 'csv' && <CSVViewer url={url} />}
            </Box>
        </Stack>
    );
};

const CSVViewer = (props: CSVViewerProps) => {
    const MAX_ROWS = 100;
    const { url } = props;
    const { readRemoteFile } = usePapaParse();
    const [content, setContent] = useState<any>(undefined);
    const notify = useNotify();

    useEffect(() => {
        readRemoteFile(url, {
            complete: results => {
                if (results.data && results.data.length > 0) {
                    const cols = Object.keys(results.data[0] as any).map(c => ({
                        field: c,
                        flex: 1,
                    }));
                    const res = {
                        rows: results.data.map((row: any, index: number) => ({
                            ...row,
                            id: index,
                        })),
                        columns: cols,
                    };
                    setContent(res);
                }
            },
            error: () => {
                notify('ra.message.not_found', {
                    type: 'error',
                });
            },
            header: true,
            download: true,
            preview: MAX_ROWS,
            skipEmptyLines: true,
        });
    }, [notify, readRemoteFile, url]);

    return (
        <Box
            sx={{
                height: 400,
                width: '100%',
                '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 'bold',
                },
            }}
        >
            {content ? (
                <DataGrid
                    rows={content.rows}
                    columns={content.columns}
                    pageSizeOptions={[MAX_ROWS]}
                    autoHeight
                    disableRowSelectionOnClick
                />
            ) : (
                <NoContent message={'fields.info.empty'} />
            )}
        </Box>
    );
};

const LogViewer = styled(Box, {
    name: 'LogViewer',
    overridesResolver: (_props, styles) => styles.root,
})(() => ({
    [`& .log-line > .log-number`]: {
        marginLeft: 0,
        marginRight: 0,
    },
}));

export type CSVViewerProps<RecordType extends RaRecord = any> = Omit<
    FieldProps<RecordType>,
    'source'
> & {
    url: string;
};

export type PreviewButtonProps<RecordType extends RaRecord = any> = Omit<
    FieldProps<RecordType>,
    'source'
> &
    ButtonProps &
    Omit<PreviewViewProps, 'resource' | 'id'> & {
        icon?: ReactElement;
        iconButton?: boolean;
        fileName?: string;
        fullWidth?: boolean;
        maxWidth?: Breakpoint;
    };

type PreviewViewProps = {
    fileType: string;
    contentType?: string | null;
    path?: string;
    resource?: string;
    id?: string;
    sub?: string;
};
