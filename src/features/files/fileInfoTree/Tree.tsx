// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import clsx from 'clsx';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {
    useTreeItem,
    UseTreeItemParameters,
} from '@mui/x-tree-view/useTreeItem';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import ArticleIcon from '@mui/icons-material/Article';
import FolderRounded from '@mui/icons-material/FolderRounded';
import ImageIcon from '@mui/icons-material/Image';
import { animated, useSpring } from '@react-spring/web';
import { alpha, styled } from '@mui/material/styles';
import {
    treeItemClasses,
    TreeItemContent,
    TreeItemLabel,
    TreeItemRoot,
} from '@mui/x-tree-view/TreeItem';
import Collapse from '@mui/material/Collapse';
import { TransitionProps } from '@mui/material/transitions';
import { Box, Typography } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PublicIcon from '@mui/icons-material/Public';
import TableChart from '@mui/icons-material/TableChart';

export const Tree = (props: any) => {
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

const isExpandable = (reactChildren: React.ReactNode) => {
    if (Array.isArray(reactChildren)) {
        return reactChildren.length > 0 && reactChildren.some(isExpandable);
    }
    return Boolean(reactChildren);
};

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
    } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

    const item = publicAPI.getItem(itemId);
    const expandable = isExpandable(children);
    let icon;
    if (expandable) {
        icon = FolderRounded;
    } else {
        icon = getIconFromFileType(item.fileType);
    }

    return (
        <TreeItemProvider id={id} itemId={itemId}>
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
        </TreeItemProvider>
    );
});

interface CustomTreeItemProps
    extends Omit<UseTreeItemParameters, 'rootRef'>,
        Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {}

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

const StyledTreeItemRoot = styled(TreeItemRoot)(({ theme }) => ({
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
})) as unknown as typeof TreeItemRoot;

const CustomTreeItemContent = styled(TreeItemContent)(({ theme }) => ({
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

const CustomLabel = (props: {
    children: React.ReactNode;
    icon?: React.ElementType;
    expandable?: boolean;
}) => {
    const { icon: Icon, children, ...other } = props;

    return (
        <TreeItemLabel
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
        </TreeItemLabel>
    );
};
