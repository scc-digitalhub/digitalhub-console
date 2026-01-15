// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Menu,
    MenuItemLink,
    useBasename,
    useGetResourceLabel,
} from 'react-admin';
import { ProjectIcon } from '../resources/projects/icon';
import SettingsIcon from '@mui/icons-material/Settings';

import { Box, Divider } from '@mui/material';
import { LineageIcon } from '../features/lineage/components/icon';
import { ServiceIcon } from '../pages/services/icon';
import { BrowserIcon } from '../features/files/fileBrowser/icon';

export const MyMenu = () => {
    const basename = useBasename();
    const getResourceLabel = useGetResourceLabel();

    return (
        <Menu
            sx={{
                height: '100%',
                pt: '18px',
            }}
        >
            <Box flex={1}>
                <Menu.DashboardItem />
                <Menu.ResourceItem name="artifacts" />
                <Menu.ResourceItem name="dataitems" />
                <Menu.ResourceItem name="models" />
                <Menu.ResourceItem name="functions" />
                <Menu.ResourceItem name="workflows" />
                <Menu.ResourceItem name="runs" />
                <Menu.ResourceItem name="triggers" />
                <Menu.ResourceItem name="secrets" />
                <MenuItemLink
                    leftIcon={<BrowserIcon />}
                    to={`${basename}/files`}
                    primaryText={'fields.files.title'}
                />{' '}
                <MenuItemLink
                    leftIcon={<ServiceIcon />}
                    to={`${basename}/services`}
                    primaryText={'pages.services.title'}
                />
                <Divider />
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
                />
            </Box>
        </Menu>
    );
};
