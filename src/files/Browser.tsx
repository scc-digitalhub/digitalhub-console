/**
 * Copyright 2025 the original author or authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useRootSelector } from '@dslab/ra-root-selector';

import { useEffect, useState } from 'react';
import {
    Button,
    Datagrid,
    DateField,
    FunctionField,
    ListContextProvider,
    ResourceContextProvider,
    Toolbar,
    TopToolbar,
    useDataProvider,
    useList,
    useTranslate,
} from 'react-admin';
import { useProjectPermissions } from '../provider/authProvider';
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

import FolderRounded from '@mui/icons-material/FolderRounded';
import GenericFileIcon from '@mui/icons-material/InsertDriveFile';

import { FlatCard } from '../components/FlatCard';
import {
    getMimeTypeFromExtension,
    getTypeFromMimeType,
    prettyBytes,
} from './utils';
import { FileDetails } from './FileDetails';
import { FileIcon } from './FileIcon';
import { UploadButton } from './UploadButton';
import { BulkDeleteButton } from './BulkDeleteButton';

export const Browser = () => {
    const dataProvider = useDataProvider();
    const { root: projectId } = useRootSelector();
    const translate = useTranslate();
    const { isAdmin } = useProjectPermissions();

    const [stores, setStores] = useState<string[] | null>(null);
    const [store, setStore] = useState<string | null>(null);
    const [path, setPath] = useState<string | null>(null);
    const [files, setFiles] = useState<any[] | null>(null);
    const [error, setError] = useState<any | null>(null);

    useEffect(() => {
        if (dataProvider && projectId) {
            dataProvider
                .invoke({
                    path: '/-/' + projectId + '/files/stores',
                    options: { method: 'GET' },
                })
                .then(json => {
                    if (json) {
                        setStores(json);
                        if (json.length == 1) {
                            //select first
                            setStore(json[0]);
                        }
                    }
                });
        }
    }, [dataProvider, projectId, setStores]);

    useEffect(() => {
        if (dataProvider && projectId && store && path != null) {
            dataProvider
                .invoke({
                    path: '/-/' + projectId + '/files/info',
                    params: { path },
                    options: { method: 'GET' },
                })
                .then(json => {
                    if (json) {
                        setFiles(
                            json.map(j => ({ ...j, id: j.path || j.name }))
                        );
                        if (error) {
                            setError(null);
                        }
                    }
                })
                .catch(error => {
                    console.log('e', error);
                    setError(error);
                });
        }
    }, [dataProvider, projectId, store, path]);

    useEffect(() => {
        if (dataProvider && projectId && store) {
            const root = store && store.endsWith('/') ? store : store + '/';
            setPath(root);
        }
    }, [dataProvider, projectId, store]);

    const selectStore = key => {
        setStore(key);
    };

    const reload = () => {
        if (dataProvider && projectId && store != null && path != null) {
            dataProvider
                .invoke({
                    path: '/-/' + projectId + '/files/info',
                    params: { id: store, path },
                    options: { method: 'GET' },
                })
                .then(json => {
                    if (json) {
                        setFiles(json);
                        if (error) {
                            setError(null);
                        }
                    }
                })
                .catch(error => {
                    console.log('e', error);
                    setError(error);
                });
        }
    };

    const parent = () => {
        if (path && path != store) {
            const cur = path.substring(0, path.length - 1);
            const parent = cur.substring(0, cur.lastIndexOf('/') + 1);

            if (parent != path) {
                setPath(parent);
            }
        }
    };

    const breadcrumbs: any[] = [];

    if (store && path) {
        const partials =
            path &&
            store &&
            path
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
                <>
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
                            onClick={e => reload()}
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
                                            style={{
                                                // textDecoration: 'underline',
                                                cursor: 'pointer',
                                                fontWeight:
                                                    idx &&
                                                    idx ==
                                                        breadcrumbs.length - 1
                                                        ? 'bold'
                                                        : 'normal',
                                            }}
                                            onClick={e => setPath(p.path)}
                                        >
                                            {p.name}
                                        </a>
                                    ))}
                            </Breadcrumbs>
                        </Toolbar>
                        {/* <>
                        {stores &&
                            stores.map(k => (
                                <p onClick={e => selectStore(k)}>{k}</p>
                            ))}
                    </> */}
                        {/* <>
                        {path && path != store && (
                            <a onClick={e => parent()}>...</a>
                        )}
                    </> */}
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
                </>
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
                {/* <ListView actions={false} aside={<FileDetails file={file} />}> */}
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
                                        {/* <a onClick={e => handleClick(r)}>
                                            {r.name}
                                        </a> */}
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

                {/* </ListView> */}
            </ListContextProvider>
        </ResourceContextProvider>
    );
};
