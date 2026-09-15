// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Layout,
    AppBar,
    Menu,
    usePermissions,
    Sidebar,
    MenuItemLink,
} from 'react-admin';
import { Button, Divider, Typography, useScrollTrigger } from '@mui/material';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import { MyUserMenu } from './MyUserMenu';
import RootResourceSelectorMenu from './RootSelectorMenu';
import { MenuHeader } from '../common/components/layout/MenuHeader';
import { LogsIcon } from '../features/logs/components/LogsButton';

const APP_VERSION: string =
    (globalThis as any).REACT_APP_VERSION ||
    (process.env.REACT_APP_VERSION as string);
const docsVersion = APP_VERSION
    ? APP_VERSION.replace(new RegExp(/\.[^/.]+$/), '')
    : undefined;

const InitialAppBar = () => {
    return (
        <AppBar color="primary" elevation={0} userMenu={<MyUserMenu />}>
            <Typography
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
                variant="h6"
                color="inherit"
                flex="1"
            >
                <RootResourceSelectorMenu
                    source="name"
                    showSelected={true}
                    icon={false}
                />
            </Typography>

            {docsVersion && (
                <Button
                    color="inherit"
                    href={
                        'https://scc-digitalhub.github.io/docs/' + docsVersion
                    }
                    target="_blank"
                >
                    <HelpCenterIcon />
                </Button>
            )}
        </AppBar>
    );
};

const InitialMenu = () => {
    const { isPending, permissions } = usePermissions();
    const isAdmin = !isPending && permissions?.includes('ROLE_ADMIN');
    return (
        <Menu
            sx={{
                pb: 0,
            }}
        >
            <Menu.DashboardItem />
            <Divider />
            {isAdmin && (
                <MenuHeader
                    primaryText="pages.admin.header"
                    helperText="pages.admin.subheader"
                />
            )}
            {isAdmin && <Menu.ResourceItem name="projects" />}
            {isAdmin && <Menu.ResourceItem name="runs" />}
            {isAdmin && (
                <MenuItemLink
                    leftIcon={<LogsIcon />}
                    to={`/logs`}
                    primaryText={'fields.logs'}
                />
            )}
        </Menu>
    );
};

const InitialSidebar = props => {
    const trigger = useScrollTrigger();
    const { isPending, permissions } = usePermissions();

    return (
        !isPending &&
        permissions?.includes('ROLE_ADMIN') && (
            <Sidebar
                sx={{
                    '& .RaSidebar-fixed': {
                        //consider appbar height (subtracted by default) when calculating sidebar
                        //height to avoid either overflow or white space
                        height: trigger ? '100vh' : undefined,
                        pb: '10px',
                    },
                }}
                {...props}
            />
        )
    );
};

export const LayoutInitialApp = (props: any) => {
    return (
        <Layout
            {...props}
            appBar={InitialAppBar}
            menu={InitialMenu}
            sidebar={InitialSidebar}
        />
    );
};
