// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Menu,
    MenuItemLink,
    useBasename,
    useGetResourceLabel,
    useSidebarState,
    useTranslate,
} from 'react-admin';
import SettingsIcon from '@mui/icons-material/Settings';
import StorageIcon from '@mui/icons-material/Storage';
import { Box, Divider, Popover, Stack, Typography } from '@mui/material';
import { BrowserIcon } from '../features/files/fileBrowser/components/icon';
import { ServiceIcon } from '../pages/services/icon';
import { LineageIcon } from '../features/lineage/components/icon';
import { ProjectIcon } from '../pages/projects/icon';
import { UploadSafeLink } from './UploadSafeLink';
import { HubIcon } from '../features/hub/components/HubIcon';
import { ReactElement, useRef, useState } from 'react';
import { fontSize } from '@mui/system';

const enableHub: string =
    (globalThis as any).REACT_APP_HUB_CATALOG_URL ||
    (process.env.REACT_APP_HUB_CATALOG_URL as string) ||
    false;

const enableTrino: string =
    (globalThis as any).REACT_APP_TRINO_URL ||
    (process.env.REACT_APP_TRINO_URL as string) ||
    false;

export const MyMenu = () => {
    const basename = useBasename();
    const getResourceLabel = useGetResourceLabel();
    const translate = useTranslate();

    return (
        <Menu
            sx={{
                height: '100%',
                pt: '18px',
            }}
        >
            <Box flex={1}>
                <Menu.DashboardItem />
                {enableHub && (
                    <MenuItemLink
                        leftIcon={<HubIcon />}
                        to={`${basename}/hub`}
                        primaryText={'pages.hub.menu'}
                    />
                )}
                <Divider />
                <MenuHeader
                    primaryText="pages.menu.catalog.header"
                    helperText="pages.menu.catalog.subheader"
                />
                <Menu.ResourceItem name="artifacts" />
                <Menu.ResourceItem name="dataitems" />
                <Menu.ResourceItem name="models" />
                <Menu.ResourceItem name="functions" />
                <Menu.ResourceItem name="workflows" />
                <Divider />
                <MenuHeader
                    primaryText="pages.menu.operations.header"
                    helperText="pages.menu.operations.subheader"
                />
                <Menu.ResourceItem name="runs" />
                <Menu.ResourceItem name="triggers" />
                <MenuItemLink
                    leftIcon={<ServiceIcon />}
                    to={`${basename}/services`}
                    primaryText={'pages.services.title'}
                />
                <Menu.ResourceItem name="containerimages" />
                <Menu.ResourceItem name="secrets" />
                <Divider />
                <MenuHeader
                    primaryText="pages.menu.repository.header"
                    helperText="pages.menu.repository.subheader"
                />
                <MenuItemLink
                    leftIcon={<BrowserIcon />}
                    to={`${basename}/files`}
                    primaryText={'fields.files.title'}
                />
                {enableTrino && (
                    <MenuItemLink
                        leftIcon={<StorageIcon />}
                        to={`${basename}/sql`}
                        primaryText={'SQL Editor'}
                    />
                )}

                <Divider />
                <MenuHeader
                    primaryText="pages.menu.project.header"
                    helperText="pages.menu.project.subheader"
                />
                <MenuItemLink
                    leftIcon={<SettingsIcon />}
                    to={`${basename}/config`}
                    primaryText={'pages.config.title'}
                />
                <MenuItemLink
                    leftIcon={<LineageIcon />}
                    to={`${basename}/lineage`}
                    primaryText={'pages.lineage.title'}
                />

                <MenuItemLink
                    leftIcon={<ProjectIcon />}
                    to={'/projects'}
                    primaryText={<>{getResourceLabel('projects', 2)}</>}
                    selected={false}
                    component={UploadSafeLink}
                />
            </Box>
        </Menu>
    );
};

const MenuHeader = (props: {
    primaryText: string;
    helperText?: string;
    icon?: ReactElement;
}) => {
    const translate = useTranslate();
    const [open, setOpen] = useSidebarState();
    const [popoverOpen, setPopoverOpen] = useState(false);
    const anchorRef = useRef(null);

    const handlePopoverOpen = () => {
        if (!popoverOpen) {
            setPopoverOpen(true);
        }
    };
    const handlePopoverClose = () => {
        if (popoverOpen) {
            setPopoverOpen(false);
        }
    };
    const showPopover = !!props.helperText;
    const popoverExtendedProps = showPopover
        ? {
              'aria-owns': popoverOpen ? 'mouse-over-popover' : '',
              'aria-haspopup': true,
              onMouseEnter: handlePopoverOpen,
              onMouseLeave: handlePopoverClose,
          }
        : {};
    return (
        <Stack
            ref={anchorRef}
            direction={'row'}
            columnGap={0}
            alignItems={'flex-start'}
        >
            <Box sx={{ px: 2, pb: 1 }}>
                {open && (
                    <Typography
                        variant="inherit"
                        component="span"
                        noWrap
                        sx={{
                            flexGrow: 1,
                            textTransform: 'uppercase',
                            fontSize: '90%',
                            cursor: 'default',
                        }}
                        color="text.secondary"
                        {...popoverExtendedProps}
                    >
                        {translate(props.primaryText)}
                    </Typography>
                )}
            </Box>
            <Popover
                sx={{ pointerEvents: 'none' }}
                open={popoverOpen}
                anchorEl={anchorRef.current}
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
                        elevation: 0,
                    },
                }}
            >
                <Typography variant="body2" sx={{ p: 1 }}>
                    {translate(props.helperText || '')}
                </Typography>
            </Popover>
        </Stack>
    );
};
