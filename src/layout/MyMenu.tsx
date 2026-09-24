// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Menu,
    MenuItemLink,
    useBasename,
    useGetResourceLabel,
} from 'react-admin';
import SettingsIcon from '@mui/icons-material/Settings';
import StorageIcon from '@mui/icons-material/Storage';
import { Divider } from '@mui/material';
import { BrowserIcon } from '../features/files/fileBrowser/components/icon';
import { ServiceIcon } from '../pages/services/icon';
import { LineageIcon } from '../features/lineage/components/icon';
import { ProjectIcon } from '../pages/projects/icon';
import { UploadSafeLink } from './UploadSafeLink';
import { HubIcon } from '../features/hub/components/HubIcon';
import { TutorialsIcon } from '../features/tutorials/components/icon';
import { MenuHeader } from '../common/components/layout/MenuHeader';
import { ExtensionsMenuItems } from '../features/extensions/components/ExtensionMenuButtons';

const enableHub: string =
    (globalThis as any).REACT_APP_HUB_CATALOG_URL ||
    (process.env.REACT_APP_HUB_CATALOG_URL as string) ||
    false;

const enableTrino: string =
    (globalThis as any).REACT_APP_TRINO_URL ||
    (process.env.REACT_APP_TRINO_URL as string) ||
    false;

const enableTutorials: string =
    (globalThis as any).REACT_APP_TUTORIALS_URL ||
    (process.env.REACT_APP_TUTORIALS_URL as string) ||
    false;

export const MyMenu = () => {
    const basename = useBasename();
    const getResourceLabel = useGetResourceLabel();

    return (
        <Menu
            sx={{
                pb: 0,
            }}
        >
            <Menu.DashboardItem />
            {enableHub && (
                <MenuItemLink
                    leftIcon={<HubIcon />}
                    to={`${basename}/hub`}
                    primaryText={'pages.hub.menu'}
                />
            )}
            {enableTutorials && (
                <MenuItemLink
                    leftIcon={<TutorialsIcon />}
                    to={`${basename}/tutorials`}
                    primaryText={'pages.tutorials.menu'}
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
            <ExtensionsMenuItems resource="projects" view="show" />

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
                to={'/'}
                primaryText={<>{getResourceLabel('projects', 2)}</>}
                selected={false}
                component={UploadSafeLink}
            />
        </Menu>
    );
};
