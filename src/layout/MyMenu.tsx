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
import { Box, Divider } from '@mui/material';
import { BrowserIcon } from '../features/files/fileBrowser/components/icon';
import { ServiceIcon } from '../features/httpclients/components/icon';
import { LineageIcon } from '../features/lineage/components/icon';
import { ProjectIcon } from '../pages/projects/icon';
import { useFileContext } from '../features/files/FileContext';
import { forwardRef } from 'react';
import { LinkProps, useHref, useLinkClickHandler } from 'react-router-dom';

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
                    component={LinkRef}
                />
            </Box>
        </Menu>
    );
};

/**
 * Adaptation of react-router Link
 */
const LinkRef = forwardRef<HTMLAnchorElement, LinkProps>(function LinkWithRef(
    props,
    forwardedRef
) {
    const {
        onClick,
        discover = 'render',
        prefetch = 'none',
        relative,
        reloadDocument,
        replace,
        state,
        target,
        to,
        preventScrollReset,
        viewTransition,
        ...rest
    } = props;

    const {
        uploadStatusController: { uploading },
    } = useFileContext();

    const isAbsolute =
        typeof to === 'string' && /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(to);

    const href = useHref(to, { relative });

    const internalOnClick = useLinkClickHandler(to, {
        replace,
        state,
        target,
        preventScrollReset,
        relative,
        viewTransition,
    });

    const handleClick = event => {
        if (onClick) onClick(event);
        if (!event.defaultPrevented) {
            //if uploading, beforeunload event is already handled
            if (!uploading) {
                internalOnClick(event);
            }
        }
    };

    return (
        <a
            {...rest}
            href={href}
            onClick={reloadDocument ? onClick : handleClick}
            ref={forwardedRef}
            target={target}
            data-discover={
                !isAbsolute && discover === 'render' ? 'true' : undefined
            }
        />
    );
});
