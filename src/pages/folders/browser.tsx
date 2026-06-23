// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Alert,
    Box,
    Breadcrumbs,
    Card,
    CardActionArea,
    Container,
    Grid,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import {
    Button,
    ColumnsButton,
    Datagrid,
    DataTable,
    DateField,
    FunctionField,
    Labeled,
    ListContextProvider,
    LoadingIndicator,
    RecordContextProvider,
    required,
    ResourceContextProvider,
    ShowButton,
    SimpleForm,
    SimpleList,
    TextField,
    TextInput,
    Toolbar,
    TopToolbar,
    useDataProvider,
    useGetOne,
    useList,
    useResourceDefinitions,
    useStore,
    useTranslate,
} from 'react-admin';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { PageTitle } from '../../common/components/layout/PageTitle';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    FileIcon,
    FileIconProps,
} from '../../features/files/fileBrowser/components/FileIcon';
import { BrowserIcon } from '../../features/files/fileBrowser/components/icon';
import { prettyBytes } from '../../features/files/fileBrowser/utils';
import ReloadIcon from '@mui/icons-material/Replay';
import { useRootSelector } from '@dslab/ra-root-selector';
import { CreateInDialogButton, DialogContext } from '@dslab/ra-dialog-crud';
import { isAlphaNumeric } from '../../common/utils/helpers';
import { IdField } from '../../common/components/fields/IdField';
import { StateChips } from '../../common/components/StateChips';
import { MetadataField } from '../../features/metadata/components/MetadataField';
import {
    StyledDialog,
    StyledDialogClasses,
} from '../../common/theme/StyledDialog';
import { PreviewContent } from '../../common/components/PreviewButton';
import {
    RowsViewIcon,
    TableViewIcon,
    ViewSelector,
} from '../../common/components/buttons/ViewsSelector';
import { ChipsField } from '../../common/components/fields/ChipsField';
import GridViewIcon from '@mui/icons-material/ViewModule';
import { GridList } from '../../common/components/layout/GridList';
import { Empty } from '../../common/components/layout/Empty';

export const FolderBrowser = () => {
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const { root: projectId } = useRootSelector();
    const root = {
        name: projectId || '/',
        id: null,
        kind: 'folder',
        folderId: null,
    };

    const [folder, setFolder] = useState<any | undefined>(undefined);
    const [path, setPath] = useState<any[] | null>([root]);
    const [entries, setEntries] = useState<any[] | null>(null);
    const [error, setError] = useState<any | null>(null);
    const [token, setToken] = useState<any | null>(null);
    const storeKey = `${root}.folders.browser`;

    const [selectedView, setSelectedView] = useStore(
        `${storeKey}.view`,
        'dataTable'
    );

    const views = [
        {
            name: 'dataTable',
            label: 'messages.navigation.table',
            icon: <TableViewIcon />,
        },
        {
            name: 'grid',
            label: 'messages.navigation.grid',
            icon: <GridViewIcon />,
        },
        {
            name: 'details',
            label: 'messages.navigation.details',
            icon: <RowsViewIcon />,
        },
    ];
    const fetchEntries = useCallback(
        (folderId?: string, nextToken?: any) => {
            if (dataProvider) {
                const url = folderId
                    ? `/-/${projectId}/folders/${folderId}/entries`
                    : `/-/${projectId}/folders/entries`;
                dataProvider
                    .invoke({
                        path: url,
                        options: { method: 'GET' },
                        params: nextToken ? { token: nextToken } : {},
                    })
                    .then(json => {
                        if (json) {
                            const newEntries = json.content || [];
                            setEntries(prev =>
                                nextToken
                                    ? [...(prev || []), ...newEntries]
                                    : newEntries
                            );
                            setToken(
                                json.pageInfo?.nextToken
                                    ? json.pageInfo.nextToken
                                    : null
                            );
                        }
                    })
                    .catch(error => {
                        console.log('e', error);
                        setError(error);
                        setToken(null);
                    });
            }
        },
        [dataProvider]
    );

    useEffect(() => {
        if (fetchEntries) {
            fetchEntries(folder?.id || undefined);
        }
    }, [fetchEntries, folder]);

    const reload = useCallback(() => {
        if (fetchEntries) {
            fetchEntries(folder?.id || undefined);
        }
    }, [fetchEntries, folder]);

    const openFolder = (f: any | undefined) => {
        if (folder?.id === f?.id) {
            //nothing to do
            return;
        }

        if (!f || f.kind !== 'folder') {
            return;
        }

        setPath(prev => {
            if (folder?.id) {
                //in subfolder, check if we are going back or forward
                const idx = prev?.findIndex(p => p.id == f?.id);
                if (!idx) {
                    return [root];
                }
                console.log('idx', idx, prev, f);
                if (idx >= 0) {
                    //going back, slice to that index
                    return prev?.slice(0, idx + 1);
                } else {
                    //going forward, push new folder
                    return [...(prev || []), f];
                }
            } else {
                //push root if we are leaving it
                return [root, f];
            }
        });
        setFolder(f);
    };

    return (
        <Container maxWidth={false}>
            <PageTitle
                text={translate('pages.files.title')}
                secondaryText={translate('pages.files.helperText')}
                icon={<BrowserIcon fontSize={'large'} />}
                sx={{ pl: 0, pr: 0 }}
            />
            <Box sx={{ pt: 0, textAlign: 'left' }}>
                <TopToolbar>
                    <CreateFolderButton
                        parentId={folder?.id}
                        onSuccess={reload}
                    />
                    <Button
                        label="ra.action.refresh"
                        onClick={() => reload()}
                        size="small"
                    >
                        <ReloadIcon />
                    </Button>
                    {selectedView === 'dataTable' && (
                        <ColumnsButton
                            storeKey={`${storeKey}.dataTable`}
                            color="secondary"
                        />
                    )}
                    {views && setSelectedView && (
                        <ViewSelector
                            views={views}
                            selectedView={selectedView}
                            setSelectedView={setSelectedView}
                        />
                    )}
                </TopToolbar>
                <FlatCard sx={{ pt: 1 }}>
                    <Toolbar sx={{ minHeight: '48px !important' }}>
                        <Breadcrumbs aria-label="breadcrumb">
                            {path &&
                                path.map((p, idx) => (
                                    <a
                                        key={'file-browser-breadcrumb-' + idx}
                                        style={{
                                            cursor: 'pointer',
                                            fontWeight:
                                                idx && idx == path.length - 1
                                                    ? 'bold'
                                                    : 'normal',
                                        }}
                                        onClick={() => openFolder(p)}
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
                        <EntriesList
                            entries={entries}
                            selectedView={selectedView}
                            storeKey={storeKey}
                            open={openFolder}
                            reload={reload}
                            path={
                                path
                                    ? path.map(p => p.name).join('/')
                                    : undefined
                            }
                            token={token}
                            fetchEntries={(last: string) =>
                                fetchEntries(folder?.id, last)
                            }
                        />
                    )}
                </FlatCard>
            </Box>
        </Container>
    );
};

const CreateFolderButton = (props: {
    parentId?: string;
    onSuccess?: () => void;
}) => {
    const { parentId, onSuccess } = props;
    const { root } = useRootSelector();
    const transform = data => ({
        ...data,
        kind: `folder`,
        project: root,
        spec: { parentId },
    });
    return (
        <ResourceContextProvider value="folders">
            <CreateInDialogButton
                fullWidth
                transform={transform}
                maxWidth={'md'}
                variant="contained"
                closeOnClickOutside={false}
                mutationOptions={{
                    onSuccess: data => {
                        if (onSuccess) onSuccess();
                    },
                }}
            >
                <SimpleForm>
                    <TextInput
                        source="name"
                        validate={[required(), isAlphaNumeric()]}
                    />
                </SimpleForm>
            </CreateInDialogButton>
        </ResourceContextProvider>
    );
};
const EntryIcon = (props: { type: string } & FileIconProps) => {
    const { type, fontSize: fontSizeProp = 'small', ...rest } = props;
    const resourceDefinitions = useResourceDefinitions();

    const resource = type ? type.toLowerCase() + 's' : 'artifacts';
    const fontSize = fontSizeProp == 'x-large' ? 'inherit' : fontSizeProp;
    const sx = {
        fontSize: fontSizeProp === 'x-large' ? '4rem' : undefined,
    };

    if (
        resourceDefinitions &&
        resourceDefinitions[resource] &&
        resourceDefinitions[resource].icon
    ) {
        const Icon = resourceDefinitions[resource].icon;
        return (
            <Box sx={sx}>
                <Icon fontSize={fontSize} {...rest} />
            </Box>
        );
    }

    return (
        <Box sx={sx}>
            <FileIcon fontSize={fontSize} {...rest} />
        </Box>
    );
};

const InfiniteScrollTrigger = (props: {
    token: string | null;
    fetchPage: (token: string) => void;
}) => {
    const { token: token, fetchPage } = props;
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

const EntriesList = (props: {
    path?: string | null;
    entries?: any[] | null;
    selectedView?: string;
    storeKey?: string;
    open: (folder: any) => void;
    reload: () => void;
    token?: string | null;
    fetchEntries?: (last: string) => void;
}) => {
    const {
        path,
        entries: files = [],
        selectedView = 'dataTable',
        storeKey,
        open: navigate,
        reload,
        token = null,
        fetchEntries: fetchPage,
    } = props;
    const [preview, setPreview] = useState<any | null>(null);

    const listContext = useList({ data: files || [] });

    const handleClick = entry => {
        if (entry?.kind === 'folder') {
            navigate(entry);
        } else {
            setPreview(entry);
        }
    };

    const rowClick = (id, resource, record) => {
        handleClick(record);
        // return 'expand';
        return false;
    };

    const dialogContext = useMemo(
        () => ({
            isOpen: preview !== null,
            handleOpen: () => {},
            handleClose: () => setPreview(null),
            open: () => null,
            close: () => setPreview(null),
        }),
        [setPreview]
    );

    const view = useMemo(
        () => (
            <>
                {selectedView == 'dataTable' && (
                    <TableView
                        storeKey={`${storeKey}.dataTable`}
                        rowClick={rowClick}
                    />
                )}
                {selectedView == 'details' && (
                    <DetailsView
                        storeKey={`${storeKey}.details`}
                        rowClick={rowClick}
                    />
                )}
                {selectedView == 'grid' && (
                    <GridView
                        storeKey={`${storeKey}.grid`}
                        rowClick={rowClick}
                    />
                )}
            </>
        ),
        [selectedView, storeKey, rowClick]
    );

    return (
        <ResourceContextProvider value="files">
            <ListContextProvider value={listContext}>
                <Grid container spacing={0}>
                    <Grid size={'grow'}>
                        {files && files.length > 0 ? view : <Empty />}
                    </Grid>
                </Grid>
            </ListContextProvider>
            {token && fetchPage && (
                <InfiniteScrollTrigger token={token} fetchPage={fetchPage} />
            )}
            <StyledDialog
                maxWidth={'md'}
                fullWidth={false}
                onClose={() => setPreview(null)}
                aria-labelledby="preview-dialog-title"
                open={preview !== null}
                className={StyledDialogClasses.dialog}
                scroll="body"
            >
                <DialogContext.Provider value={dialogContext}>
                    {preview && <EntryShow entry={preview} path={path} />}
                </DialogContext.Provider>
            </StyledDialog>
        </ResourceContextProvider>
    );
};

const TableView = (props: {
    storeKey?: string;
    rowClick: (id: any, resource: any, record: any) => string | false;
}) => {
    const { storeKey, rowClick } = props;
    return (
        <DataTable
            storeKey={storeKey}
            bulkActionButtons={false}
            rowClick={rowClick}
            hiddenColumns={['id', 'size']}
        >
            <DataTable.Col source="name" label="fields.name.title">
                <FunctionField
                    source="name"
                    sortable={false}
                    render={r => (
                        <Stack direction={'row'} gap={1}>
                            <EntryIcon type={r.type} />
                            {r.name}
                        </Stack>
                    )}
                />
            </DataTable.Col>
            <DataTable.Col source="type" label="fields.type.title" />
            <DataTable.Col source="size" label="fields.files.size">
                <FunctionField
                    source="size"
                    sortable={false}
                    render={r => (r.size ? prettyBytes(r.size, 2) : '')}
                />
            </DataTable.Col>
            <DataTable.Col source="user" label="fields.user.title" />
            <DataTable.Col source="updated" label="fields.updated.title">
                <DateField showTime source="updated" textAlign="right" />
            </DataTable.Col>
        </DataTable>
    );
};
const DetailsView = (props: {
    storeKey?: string;
    rowClick: (id: any, resource: any, record: any) => string | false;
}) => {
    const { storeKey, rowClick } = props;
    const translate = useTranslate();
    const theme = useTheme();

    return (
        <>
            <SimpleList
                primaryText={record => (
                    <Stack direction={'row'} gap={2} alignItems={'center'}>
                        <EntryIcon
                            type={record.type}
                            fontSize="large"
                            color="secondary"
                        />

                        <Stack direction={'column'} gap={0.3}>
                            <Typography variant="body1" color="textDisabled">
                                {record?.kind}
                            </Typography>
                            <Typography
                                variant="body1"
                                color="secondary"
                                sx={{ fontWeight: 'medium', fontSize: '110%' }}
                            >
                                {record.name}
                            </Typography>
                            <ChipsField
                                size={'small'}
                                source="metadata.labels"
                                sortable={false}
                            />
                        </Stack>
                    </Stack>
                )}
                secondaryText={record => (
                    <Stack direction={'row'} gap={1}></Stack>
                )}
                rowClick={rowClick}
                rowSx={() => ({
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '.MuiAvatar-root': {
                        background:
                            theme.palette.mode === 'dark'
                                ? theme.palette.grey[700]
                                : theme.palette.grey[300],
                    },
                })}
            />
        </>
    );
};
const SmallGrid = <Grid size={2} />;

const GridView = (props: {
    storeKey?: string;
    rowClick: (id: any, resource: any, record: any) => string | false;
}) => {
    const { storeKey, rowClick } = props;
    const translate = useTranslate();
    const theme = useTheme();

    return (
        <GridList component={SmallGrid} linkType={false}>
            <Card elevation={0} sx={{ p: 0, m: 1, textAlign: 'center' }}>
                <FunctionField
                    source="name"
                    render={record => (
                        <CardActionArea
                            onClick={() => rowClick(record.id, null, record)}
                        >
                            <Stack
                                p={1}
                                direction={'column'}
                                spacing={0.1}
                                alignItems={'center'}
                            >
                                <EntryIcon
                                    type={record.type}
                                    fontSize="x-large"
                                    color="primary"
                                />

                                <Typography
                                    variant="body1"
                                    color="secondary"
                                    sx={{
                                        fontWeight: 'medium',
                                        fontSize: '110%',
                                    }}
                                >
                                    {record.name}
                                </Typography>
                            </Stack>
                        </CardActionArea>
                    )}
                />
            </Card>
        </GridList>
    );
};

const EntryShow = (props: { entry: any; path?: string | null }) => {
    const { entry } = props;
    const translate = useTranslate();
    const { root } = useRootSelector();
    const resource = entry?.type ? entry.type.toLowerCase() + 's' : '';
    const { data, isPending, error } = useGetOne(resource, {
        id: entry.id,
        meta: { root },
    });

    if (!data || isPending) {
        return <LoadingIndicator />;
    }

    if (error) {
        return (
            <Alert severity="error">
                <Typography variant="body2" mb={2}>
                    {typeof error == 'string'
                        ? error
                        : error.message ||
                          translate('ra.notification.data_provider_error')}
                </Typography>
            </Alert>
        );
    }

    return (
        <ResourceContextProvider value={resource}>
            <RecordContextProvider value={{ ...data, path: props.path }}>
                <PreviewContent
                    title={data?.name || false}
                    fullScreen={false}
                    actions={
                        <TopToolbar sx={{ justifyContent: 'flex-end' }}>
                            <ShowButton />
                        </TopToolbar>
                    }
                >
                    <Box p={2}>
                        {/* Icon and Info Row */}
                        <Grid container spacing={2} mb={3}>
                            {/* Icon Column */}
                            <Grid
                                item
                                xs="auto"
                                display="flex"
                                alignItems="center"
                            >
                                <EntryIcon
                                    type={entry.type}
                                    fontSize="x-large"
                                    color="primary"
                                />
                            </Grid>

                            {/* Info Column */}
                            <Grid item xs>
                                <Stack spacing={1}>
                                    <Labeled>
                                        <TextField source="kind" />
                                    </Labeled>
                                    <Labeled>
                                        <IdField source="id" />
                                    </Labeled>
                                    <StateChips
                                        source="status.state"
                                        label="fields.status.state"
                                    />
                                </Stack>
                            </Grid>
                        </Grid>

                        {/* Metadata Row - Full Width */}
                        {/* <Stack
                            spacing={1}
                            sx={{ borderTop: '1px solid #e0e0e0', pt: 2 }}
                        >
                            <Labeled>
                                <IdField source="key" />
                            </Labeled>
                            <Labeled>
                                <IdField source="path" />
                            </Labeled>
                            <MetadataField />
                        </Stack> */}
                    </Box>
                </PreviewContent>
            </RecordContextProvider>
        </ResourceContextProvider>
    );
};
