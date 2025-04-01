import { useRootSelector } from '@dslab/ra-root-selector';
import {
    useRecordContext,
    useDataProvider,
    useNotify,
    Button,
    FieldProps,
    useResourceContext,
    ButtonProps,
    RaRecord,
    LoadingIndicator,
    useTranslate,
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
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-markdown';
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
import { NoContent } from '../NoContent';

const defaultIcon = <PreviewIcon />;

export const PreviewButton = (props: PreviewButtonProps) => {
    const {
        color = 'info',
        label = 'fields.preview',
        icon = defaultIcon,
        fullWidth = true,
        maxWidth = 'md',
        sub,
        fileType,
    } = props;

    const translate = useTranslate();
    const [open, setOpen] = useState(false);

    const resource = useResourceContext(props);
    const record = useRecordContext(props);

    const isLoading = !record;

    if (!record) {
        return <></>;
    }

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

    return (
        <Fragment>
            <Button label={label} color={color} onClick={handleDialogOpen}>
                {icon}
            </Button>
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
                        {translate(label)}
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
                    ) : (
                        <PreviewView
                            resource={resource}
                            id={record.id}
                            sub={sub}
                            fileType={fileType}
                        />
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

const PreviewView = (props: PreviewButtonProps) => {
    const { resource, sub, fileType } = props;
    const [url, setUrl] = useState<any>(undefined);
    const [content, setContent] = useState<any>(undefined);

    const { root } = useRootSelector();
    const record = useRecordContext(props);
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const ref = React.createRef<LazyLog>();

    const handlePreview = () => {
        if (url) return;

        dataProvider
            .download(resource, { id: record.id, meta: { root }, sub })
            .then(data => {
                if (data?.url) {
                    setUrl(data.url);
                    if (
                        fileType &&
                        ['yaml', 'json', 'markdown'].indexOf(fileType) !== -1
                    ) {
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
    };

    useEffect(() => {
        handlePreview();
    }, [url]);

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
                {['yaml', 'json', 'markdown'].indexOf(fileType) !== -1 &&
                    content && (
                        <AceEditor
                            mode={fileType}
                            readOnly={true}
                            theme={'monokai'}
                            wrapEnabled
                            width={'100%'}
                            setOptions={{ showPrintMargin: false }}
                            value={content}
                        />
                    )}
                {url && fileType === 'txt' && (
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
        if (!content) {
            readRemoteFile(url, {
                complete: results => {
                    if (results.data && results.data.length > 0) {
                        const cols = Object.keys(results.data[0] as any).map(
                            c => ({ field: c, flex: 1 })
                        );
                        const res = {
                            rows: results.data.map(
                                (row: any, index: number) => ({
                                    ...row,
                                    id: index,
                                })
                            ),
                            columns: cols,
                        };
                        setContent(res);
                    }
                },
                error: err => {
                    notify('ra.message.not_found', {
                        type: 'error',
                    });
                },
                header: true,
                download: true,
                preview: MAX_ROWS,
                skipEmptyLines: true,
            });
        }
    }, [content]);

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
            {content && (
                <DataGrid
                    rows={content.rows}
                    columns={content.columns}
                    pageSizeOptions={[MAX_ROWS]}
                    autoHeight
                    disableRowSelectionOnClick
                />
            )}
            {!content && <NoContent message={'fields.info.empty'} />}
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

export type CSVViewerProps<RecordType extends RaRecord = any> = FieldProps & {
    url: string;
};

export type PreviewButtonProps<RecordType extends RaRecord = any> = FieldProps &
    ButtonProps & {
        icon?: ReactElement;
        sub?: string;
        fullWidth?: boolean;
        maxWidth?: Breakpoint;
        fileType: string;
    };
