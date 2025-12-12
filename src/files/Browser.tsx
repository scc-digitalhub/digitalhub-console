// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
// Copyright 2025 the original author or authors
//
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';
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
    Container,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import { PageTitle } from '../components/PageTitle';
import BrowserIcon from '@mui/icons-material/Inventory2';
import ReloadIcon from '@mui/icons-material/Replay';

import { FlatCard } from '../components/FlatCard';
import { prettyBytes } from './utils';
import { FileDetails } from './FileDetails';
import { FileIcon } from './FileIcon';
import { UploadButton } from './UploadButton';
import { BulkDeleteButton } from './BulkDeleteButton';
import { useGetFileInfo } from '../upload_rename_as_files/info/useGetInfo';
import { useGetStores } from '../upload_rename_as_files/stores/useGetStores';

export const Browser = () => {
    const translate = useTranslate();
    const getFileInfo = useGetFileInfo();
    const getStores = useGetStores();

    // const [stores, setStores] = useState<string[] | null>(null);
    const [store, setStore] = useState<string | null>(null);
    const [path, setPath] = useState<string | null>(null);
    const [files, setFiles] = useState<any[] | null>(null);
    const [error, setError] = useState<any | null>(null);

    useEffect(() => {
        if (getStores) {
            getStores().then(json => {
                if (json) {
                    // setStores(json);
                    if (json.length == 1) {
                        //select first
                        setStore(json[0]);
                    }
                }
            });
        }
    }, [getStores]);

    const reload = useCallback(() => {
        if (getFileInfo && path != null) {
            getFileInfo({ path })
                .then(json => {
                    if (json) {
                        setFiles(json);
                        setError(null);
                    }
                })
                .catch(error => {
                    console.log('e', error);
                    setError(error);
                });
        }
    }, [getFileInfo, path]);

    useEffect(() => {
        reload();
    }, [path, reload]);

    useEffect(() => {
        if (store) {
            const root = store.endsWith('/') ? store : store + '/';
            setPath(root);
        }
    }, [store]);

    const breadcrumbs: any[] = [];

    if (store && path) {
        const partials = path
            .substring(store.length)
            .split('/')
            .filter(p => !!p);
        let cp = store + (store.endsWith('/') ? '' : '/');
        breadcrumbs.push({ name: store, path: cp });

        if (partials) {
            partials.forEach(p => {
                cp = cp + p + '/';
                breadcrumbs.push({ name: p, path: cp });
            });
        }
    }

    return (
        <Container maxWidth={false}>
            <PageTitle
                text={translate('pages.files.title')}
                // secondaryText={store || 'select a store to explore files'}
                secondaryText={translate('pages.files.helperText')}
                icon={<BrowserIcon fontSize={'large'} />}
                sx={{ pl: 0, pr: 0 }}
            />
            <Box sx={{ pt: 0, textAlign: 'left' }}>
                <TopToolbar>
                    {path && (
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
                            {breadcrumbs &&
                                breadcrumbs.map((p, idx) => (
                                    <a
                                        key={'file-browser-breadcrumb-' + idx}
                                        style={{
                                            cursor: 'pointer',
                                            fontWeight:
                                                idx &&
                                                idx == breadcrumbs.length - 1
                                                    ? 'bold'
                                                    : 'normal',
                                        }}
                                        onClick={() => setPath(p.path)}
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
                            files={files}
                            navigate={setPath}
                            reload={reload}
                            path={path}
                        />
                    )}
                </FlatCard>
            </Box>
        </Container>
    );
};

const FileList = (props: {
    path?: string | null;
    files?: any[] | null;
    navigate: (path) => void;
    reload: () => void;
}) => {
    const { path, files = [], navigate, reload } = props;
    const listContext = useList({ data: files || [] });
    const [file, setFile] = useState<any | null>(null);

    const handleClick = entry => {
        if (path && entry.path) {
            if (entry.path.endsWith('/')) {
                setFile(null);
                navigate(prev => prev + entry.path);
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

    const rowStyler = (record, idx) => {
        if (record?.path && file && path && file.path == path + record.path) {
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
                                <BulkDeleteButton
                                    path={path}
                                    onDelete={() => reload()}
                                />
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
                            <FileDetails
                                file={file}
                                onDelete={f => {
                                    if (
                                        f?.path &&
                                        file &&
                                        file.path == f.path
                                    ) {
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
        </ResourceContextProvider>
    );
};
