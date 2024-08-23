import * as React from 'react';
import { useEffect, useState } from 'react';

import { animated, useSpring } from '@react-spring/web';

import clsx from 'clsx';

import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Grid, Typography, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import Collapse from '@mui/material/Collapse';

import {
    TopToolbar,
    useDataProvider,
    useLocaleState,
    useNotify,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';

import { Spinner } from './Spinner';
import { DataGrid, enUS, gridClasses, itIT } from '@mui/x-data-grid';
import { useDataGridController } from '../controllers/useDataGridController';

import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';
import {
    unstable_useTreeItem2 as useTreeItem2,
    UseTreeItem2Parameters,
} from '@mui/x-tree-view/useTreeItem2';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';

import {
    TreeItem2Content,
    TreeItem2Label,
    TreeItem2Root,
} from '@mui/x-tree-view/TreeItem2';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';

import FolderRounded from '@mui/icons-material/FolderRounded';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArticleIcon from '@mui/icons-material/Article';
import PublicIcon from '@mui/icons-material/Public';
import TableChart from '@mui/icons-material/TableChart';
import { DownloadButton } from './DownloadButton';
import { PreviewButton } from './PreviewButton';

const MAX_TREE_DEPTH = 50;

export const extractFileType = (data: any) => {
    const ext = data.name.indexOf('.') > 0 ? data.name.split('.').pop() : '';
    const ct = data.content_type || '';
    if (ct === 'text/html' || ['html', 'htm'].indexOf(ext) !== -1) {
        return 'html';
    }
    if (
        ct.startsWith('image/') ||
        ['png', 'jpg', 'jpeg', 'gif', 'bmp'].indexOf(ext) !== -1
    ) {
        return 'image';
    }
    // if (ct === 'application/pdf' || ['pdf'].indexOf(ext) !== -1) {
    //     return 'pdf';
    // }
    if (ct === 'text/csv' || ['csv'].indexOf(ext) !== -1) {
        return 'csv';
    }
    if (ct === 'text/plain' || ['txt'].indexOf(ext) !== -1) {
        return 'txt';
    }
    if (
        ct === 'text/json' ||
        ct === 'application/json' ||
        ['json'].indexOf(ext) !== -1
    ) {
        return 'json';
    }
    if (['yml', 'yaml'].indexOf(ext) !== -1) {
        return 'yaml';
    }
    return '';
};

/**
 * Recursively appends a child object to its parent object.
 * This function is used to construct a tree structure of files and directories.
 *
 * @param {Object} parent - The parent object to append the child to.
 * @param {Object} child - The child object to append to the parent.
 * @param {string} root - The root directory path.
 */
const appendChild = (parent: any, child: any, root: string) => {
    // Extract the relative path of the child file or directory from the root path
    let path = child.path.substring(root.length);
    if (path.startsWith('/')) path = path.substring(1);

    // Split the relative path into an array of directory names
    let pathArray = path.split('/');

    if (pathArray.length > MAX_TREE_DEPTH) return;

    // Start with the parent object
    let currentParent = parent;

    // Keep track of the current parent path
    let pre = root;

    // Iterate through the array of directory names
    for (let i = 0; i < pathArray.length - 1; i++) {
        // Get the current directory name
        let d = pathArray[i];

        // Update the current parent path
        pre += '/' + d;

        // Find the child object with the current parent path in the current parent's children array
        let c = currentParent.children.find((c: any) => c.id === pre);

        // If the child object doesn't exist, create a new one and add it to the current parent's children array
        if (!c) {
            c = { id: pre, label: d, children: [], fileType: 'folder' };
            currentParent.children.push(c);
        }

        // Update the current parent object to the found or newly created child object
        currentParent = c;
    }

    // Add the child object as a child of the current parent object
    currentParent.children.push({
        id: child.path,
        label: child.name,
        data: child,
        fileType: extractFileType(child),
    });
};

/**
 * Converts a list of files into a tree structure
 * @param data - The list of files with their paths and names
 * @returns The root element of the tree structure
 */
const convertFiles = (data: any[]): any[] => {
    if (!data || data.length === 0) return [];

    if (data.length === 1) {
        // If there is only one file, return it as the root element
        return [
            {
                id: data[0].path,
                label: data[0].name,
                fileType: extractFileType(data[0]),
                data: data[0],
            },
        ];
    }

    // Find the common root of all the files
    let root = '';
    let pre = '';
    for (let i = 0; i < data[0].path.split('/').length; i++) {
        const elem = data[0].path.split('/')[i];
        pre += elem;
        let stop = false;
        for (let j = 0; j < data.length; j++) {
            if (!data[j].path.startsWith(pre)) {
                stop = true;
                break;
            }
        }
        pre += '/';
        if (stop) {
            break;
        }
        root = pre;
    }
    if (root.endsWith('/')) root = root.substring(0, root.length - 1);
    let rootFolder =
        root.indexOf('/') > 0
            ? root.substring(root.lastIndexOf('/') + 1)
            : root;

    // Create the root element and add all the files as its children
    let rootElem: any = { id: root, label: rootFolder, children: [] };
    for (let i = 0; i < data.length; i++) {
        appendChild(rootElem, data[i], root);
    }
    return [rootElem];
};

export const FileInfo = () => {
    const record = useRecordContext();
    const dataProvider = useDataProvider();
    const { root } = useRootSelector();
    const resource = useResourceContext();
    const notify = useNotify();
    const translate = useTranslate();
    const [data, setData] = useState<any[]>();
    const [activeFile, setActiveFile] = useState<any>();
    let isLoading = false;

    const handleItemClick = (item: any) => {
        const a: any = activeFile;
        if (a && a?.path === item.id) {
            setActiveFile(undefined);
        } else if (item.children && item.children.length > 0) {
            if (!item.data) {
                item.data = {
                    path: item.id,
                    name: item.label,
                    elements: item.children.length,
                };
            }
            setActiveFile(item);
        } else {
            setActiveFile(item);
        }
    };

    useEffect(() => {
        isLoading = true;
        if (record && dataProvider) {
            if (record.status?.files?.length > 0) {
                if (isLoading) {
                    setData(convertFiles(record.status.files));
                }
            } else {
                dataProvider
                    .fileInfo(resource, { id: record.id, meta: { root } })
                    .then(data => {
                        if (isLoading) {
                            if (data?.info) {
                                setData(convertFiles(data.info));
                            } else {
                                notify('ra.message.not_found', {
                                    type: 'error',
                                });
                            }
                        }
                    })
                    .catch(error => {
                        const e =
                            typeof error === 'string'
                                ? error
                                : error.message || 'error';
                        notify(e);
                    });
            }

            return () => {
                isLoading = false;
            };
        }
    }, [dataProvider, notify, record, resource, root]);

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Typography variant="h6" gutterBottom>
                {translate('fields.status.files')}
            </Typography>

            {isLoading ? (
                <Spinner />
            ) : data ? (
                <Grid container spacing={2} sx={{ width: '100%' }}>
                    <Grid item xs>
                        <FileTree info={data} onItemClick={handleItemClick} />
                    </Grid>
                    {activeFile && (
                        <Grid item xs>
                            <FileInfoTable info={activeFile} />
                        </Grid>
                    )}
                </Grid>
            ) : (
                <EmptyResult />
            )}
        </Box>
    );
};

const EmptyResult = () => {
    const translate = useTranslate();

    return (
        <Typography
            variant="body1"
            color={'gray'}
            sx={{ textAlign: 'center', pt: 5 }}
        >
            {translate('fields.info.empty')}
        </Typography>
    );
};

const StyledTreeItemRoot = styled(TreeItem2Root)(({ theme }) => ({
    color:
        theme.palette.mode === 'light'
            ? theme.palette.grey[800]
            : theme.palette.grey[400],
    position: 'relative',
    [`& .${treeItemClasses.groupTransition}`]: {
        marginLeft: theme.spacing(3.5),
    },
    [`& .MuiCollapse-root`]: {
        paddingLeft: '1rem !important',
    },
})) as unknown as typeof TreeItem2Root;

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
    flexDirection: 'row-reverse',
    borderRadius: theme.spacing(0.7),
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
    padding: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
    fontWeight: 500,
    [`&.Mui-expanded `]: {
        '&:not(.Mui-focused, .Mui-selected, .Mui-selected.Mui-focused) .labelIcon':
            {
                color:
                    theme.palette.mode === 'light'
                        ? theme.palette.primary.main
                        : theme.palette.primary.dark,
            },
        '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            left: '16px',
            top: '44px',
            height: 'calc(100% - 48px)',
            width: '1.5px',
            backgroundColor:
                theme.palette.mode === 'light'
                    ? theme.palette.grey[300]
                    : theme.palette.grey[700],
        },
    },
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color:
            theme.palette.mode === 'light'
                ? theme.palette.primary.main
                : 'white',
    },
    [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
        backgroundColor:
            theme.palette.mode === 'light'
                ? theme.palette.primary.main
                : theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
    },
}));

const AnimatedCollapse = animated(Collapse);

function TransitionComponent(props: TransitionProps) {
    const style = useSpring({
        to: {
            opacity: props.in ? 1 : 0,
            transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
        },
    });

    return <AnimatedCollapse style={style} {...props} />;
}

interface CustomLabelProps {
    children: React.ReactNode;
    icon?: React.ElementType;
    expandable?: boolean;
}

function CustomLabel({
    icon: Icon,
    expandable,
    children,
    ...other
}: CustomLabelProps) {
    return (
        <TreeItem2Label
            {...other}
            sx={{
                display: 'flex',
                alignItems: 'center',
            }}
        >
            {Icon && (
                <Box
                    component={Icon}
                    className="labelIcon"
                    color="inherit"
                    sx={{ mr: 1, fontSize: '1.2rem' }}
                />
            )}

            <Typography variant="body2">{children}</Typography>
        </TreeItem2Label>
    );
}

const isExpandable = (reactChildren: React.ReactNode) => {
    if (Array.isArray(reactChildren)) {
        return reactChildren.length > 0 && reactChildren.some(isExpandable);
    }
    return Boolean(reactChildren);
};

const getIconFromFileType = (fileType: string) => {
    switch (fileType) {
        case 'image':
            return ImageIcon;
        case 'pdf':
            return PictureAsPdfIcon;
        case 'folder':
            return FolderRounded;
        case 'html':
            return PublicIcon;
        case 'csv':
            return TableChart;
        default:
            return ArticleIcon;
    }
};

interface CustomTreeItemProps
    extends Omit<UseTreeItem2Parameters, 'rootRef'>,
        Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
    props: CustomTreeItemProps,
    ref: React.Ref<HTMLLIElement>
) {
    const { id, itemId, label, disabled, children, ...other } = props;

    const {
        getRootProps,
        getContentProps,
        getLabelProps,
        getGroupTransitionProps,
        status,
        publicAPI,
    } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

    const item = publicAPI.getItem(itemId);
    const expandable = isExpandable(children);
    let icon;
    if (expandable) {
        icon = FolderRounded;
    } else {
        icon = getIconFromFileType(item.fileType);
    }

    return (
        <TreeItem2Provider itemId={itemId}>
            <StyledTreeItemRoot {...getRootProps(other)}>
                <CustomTreeItemContent
                    {...getContentProps({
                        className: clsx('content', {
                            'Mui-expanded': status.expanded,
                            'Mui-selected': status.selected,
                            'Mui-focused': status.focused,
                            'Mui-disabled': status.disabled,
                        }),
                    })}
                >
                    <CustomLabel
                        {...getLabelProps({
                            icon,
                            expandable: expandable && status.expanded,
                        })}
                    />
                </CustomTreeItemContent>
                {children && (
                    <TransitionComponent {...getGroupTransitionProps()} />
                )}
            </StyledTreeItemRoot>
        </TreeItem2Provider>
    );
});
const FileTree = (props: any) => {
    const { info = [], onItemClick } = props;
    const apiRef = useTreeViewApiRef();

    const handleItemClick = (event: React.SyntheticEvent, itemId: string) => {
        const item = apiRef.current!.getItem(itemId);
        onItemClick(item);
    };

    return (
        <RichTreeView
            items={info}
            sx={{ height: 'fit-content', flexGrow: 1, overflowY: 'auto' }}
            apiRef={apiRef}
            defaultExpandedItems={info?.length > 0 ? [info[0].id] : []}
            onItemClick={handleItemClick}
            slots={{ item: CustomTreeItem }}
        />
    );
};

const FileInfoTable = (props: any) => {
    const { info } = props;
    const [locale] = useLocaleState();
    const localeText =
        locale && locale === 'it'
            ? itIT.components.MuiDataGrid.defaultProps.localeText
            : enUS.components.MuiDataGrid.defaultProps.localeText;
    const { data, isLoading } = useDataGridController({
        fields: info.data,
    });
    console.log('info', info);

    const valueFormatter = (value?: any) => {
        if (!value.value) {
            return '';
        }
        if (!isNaN(value.value)) {
            return value.value;
        }
        const toDate = new Date(value.value);
        if (!isNaN(toDate.getTime())) {
            return toDate.toLocaleString();
        }

        if (typeof value.value === 'object') {
            return JSON.stringify(value.value);
        }
        return value.value;
    };

    const columnsWithFormatter = data?.columns.map(col => {
        if (col.field === 'value') {
            col['valueFormatter'] = valueFormatter;
        }
        return col;
    });

    return (
        <>
            {!(info.children && info.children.length > 0) && (
                <TopToolbar>
                    {info.fileType && (
                        <PreviewButton
                            source="spec.path"
                            sub={info.data.path}
                            fileType={info.fileType}
                        />
                    )}
                    {<DownloadButton source="spec.path" sub={info.data.path} />}
                </TopToolbar>
            )}
            <DataGrid
                columns={columnsWithFormatter || []}
                rows={data?.rows || []}
                getRowHeight={() => 'auto'}
                autoHeight
                hideFooter={data?.rows && data.rows.length > 100 ? false : true}
                localeText={localeText}
                sx={theme => ({
                    '& .MuiDataGrid-columnHeader': {
                        backgroundColor: alpha(
                            theme.palette?.primary?.main,
                            0.12
                        ),
                    },
                    '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
                        '&:not(:last-child)': {
                            borderRight: '1px solid rgba(224, 224, 224, 1)',
                        },
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 'bold',
                    },
                    [`& .${gridClasses.cell}`]: {
                        py: 2,
                    },
                })}
            />
        </>
    );
};
