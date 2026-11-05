// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
// Copyright 2025 the original author or authors
//
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Button,
    Datagrid,
    DateField,
    FunctionField,
    ListContextProvider,
    ResourceContextProvider,
    Toolbar,
    TopToolbar,
    useList,
    useTranslate,
} from 'react-admin';
import {
    Alert,
    Box,
    Breadcrumbs,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import ReloadIcon from '@mui/icons-material/Replay';

import { prettyBytes } from '../utils';
import { FileIcon } from './FileIcon';
import { UploadButton } from '../../upload/components/UploadButton';
import { BulkDeleteButton } from '../../delete/components/BulkDeleteButton';
import { useGetFileInfo } from '../../info/useGetInfo';
import { FlatCard } from '../../../../common/components/layout/FlatCard';
import { FilePreview } from '../../filePreview/components/FilePreview';

const withTrailingSlash = (p: string) => (p.endsWith('/') ? p : p + '/');

/**
 * File browser locked to `root`: navigation never goes above it.
 */
export const FileBrowser = (props: {
    root: string;
    initialPath?: string;
    readOnly?: boolean;
}) => {
    const { readOnly = false } = props;
    const root = withTrailingSlash(props.root);
    const translate = useTranslate();
    const getFileInfo = useGetFileInfo();

    const [path, setPath] = useState<string>(() =>
        props.initialPath && props.initialPath.startsWith(root)
            ? withTrailingSlash(props.initialPath)
            : root
    );
    const [files, setFiles] = useState<any[] | null>(null);
    const [error, setError] = useState<any | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const navigate = (next: string) => {
        if (next.startsWith(root)) {
            setPath(next);
        }
    };

    const fetchFiles = useCallback(
        (nextToken?: string) => {
            getFileInfo({ path, token: nextToken ?? undefined })
                .then(json => {
                    if (json) {
                        const newFiles = json.data
                            ? json.data.map(f => ({ ...f, id: f.path }))
                            : [];
                        setFiles(prev =>
                            nextToken
                                ? [...(prev || []), ...newFiles]
                                : newFiles
                        );
                        setToken(json.pageInfo?.nextToken ?? null);
                        setError(null);
                    }
                })
                .catch(error => {
                    setError(error);
                    setToken(null);
                });
        },
        [getFileInfo, path]
    );

    const reload = () => fetchFiles();

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const breadcrumbs: { name: string; path: string }[] = [
        { name: root, path: root },
    ];
    let cp = root;
    path.substring(root.length)
        .split('/')
        .filter(p => !!p)
        .forEach(p => {
            cp = cp + p + '/';
            breadcrumbs.push({ name: p, path: cp });
        });

    return (
        <Box sx={{ pt: 0, textAlign: 'left' }}>
            <TopToolbar>
                {!readOnly && (
                    <UploadButton
                        path={path}
                        onUpload={files => {
                            if (files) {
                                reload();
                            }
                        }}
                    />
                )}
                <Button
                    label="ra.action.refresh"
                    onClick={() => reload()}
                    size="small"
                >
                    <ReloadIcon />
                </Button>
            </TopToolbar>
            <FlatCard sx={{ pt: 1 }}>
                <Toolbar sx={{ minHeight: '48px !important' }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        {breadcrumbs.map((p, idx) => (
                            <a
                                key={'file-browser-breadcrumb-' + idx}
                                style={{
                                    cursor: 'pointer',
                                    fontWeight:
                                        idx && idx == breadcrumbs.length - 1
                                            ? 'bold'
                                            : 'normal',
                                }}
                                onClick={() => navigate(p.path)}
                            >
                                {p.name}
                            </a>
                        ))}
                    </Breadcrumbs>
                </Toolbar>
                {error ? (
                    <Alert severity="error">
                        <Typography variant="body2" mb={2}>
                            {typeof error == 'string'
                                ? error
                                : error.message ||
                                  translate(
                                      'ra.notification.data_provider_error'
                                  )}
                        </Typography>
                    </Alert>
                ) : (
                    <FileList
                        // reset selection when changing folder
                        key={path}
                        files={files}
                        navigate={navigate}
                        reload={reload}
                        path={path}
                        token={token}
                        fetchPage={fetchFiles}
                        readOnly={readOnly}
                    />
                )}
            </FlatCard>
        </Box>
    );
};

const InfiniteScrollTrigger = (props: {
    token: string | null;
    fetchPage: (token: string) => void;
}) => {
    const { token, fetchPage } = props;
    const observerElem = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = observerElem.current;
        if (!element) return;
        const observer = new IntersectionObserver(
            entries => {
                const [target] = entries;
                if (target.isIntersecting && token) {
                    fetchPage(token);
                }
            },
            { threshold: 0 }
        );
        observer.observe(element);
        return () => observer.unobserve(element);
    }, [token, fetchPage]);

    return <div ref={observerElem} style={{ height: 1 }} />;
};

const FileList = (props: {
    path: string;
    files?: any[] | null;
    navigate: (path: string) => void;
    reload: () => void;
    token?: string | null;
    fetchPage?: (token: string) => void;
    readOnly?: boolean;
}) => {
    const {
        path,
        files = [],
        navigate,
        reload,
        token = null,
        fetchPage,
        readOnly = false,
    } = props;
    const listContext = useList({ data: files || [] });
    const [file, setFile] = useState<any | null>(null);

    const handleClick = entry => {
        if (entry.path) {
            if (entry.path.endsWith('/')) {
                navigate(path + entry.path);
            } else {
                const np = path + entry.path;
                setFile(prev =>
                    prev == null || prev.path != np
                        ? { ...entry, path: np }
                        : null
                );
            }
        }
    };

    const rowStyler = record => {
        if (record?.path && file && file.path == path + record.path) {
            return { backgroundColor: 'rgba(0, 0, 0, 0.04)' };
        }

        return {};
    };

    const rowClick = (id, resource, record) => {
        handleClick(record);
        return 'expand';
    };

    return (
        <ResourceContextProvider value="files">
            <ListContextProvider value={listContext}>
                <Grid container spacing={0}>
                    <Grid size={'grow'}>
                        <Datagrid
                            bulkActionButtons={
                                readOnly ? (
                                    false
                                ) : (
                                    <BulkDeleteButton
                                        path={path}
                                        onDelete={() => reload()}
                                    />
                                )
                            }
                            rowClick={rowClick}
                            optimized
                            rowSx={rowStyler}
                        >
                            <FunctionField
                                source="name"
                                sortable={false}
                                render={r => (
                                    <Stack direction={'row'} gap={1}>
                                        <FileIcon fontSize="small" />
                                        {r.name}
                                    </Stack>
                                )}
                            />
                            <FunctionField
                                source="size"
                                sortable={false}
                                render={r =>
                                    r.size ? prettyBytes(r.size, 2) : ''
                                }
                            />
                            <DateField
                                showTime
                                source="last_modified"
                                textAlign="right"
                            />
                        </Datagrid>
                    </Grid>
                    {file && (
                        <Grid size={3}>
                            <FilePreview
                                file={file}
                                readOnly={readOnly}
                                onDelete={f => {
                                    if (f?.path && file.path == f.path) {
                                        //deselect
                                        setFile(null);
                                    }
                                    reload();
                                }}
                            />
                        </Grid>
                    )}
                </Grid>
            </ListContextProvider>
            {token && fetchPage && (
                <InfiniteScrollTrigger token={token} fetchPage={fetchPage} />
            )}
        </ResourceContextProvider>
    );
};
