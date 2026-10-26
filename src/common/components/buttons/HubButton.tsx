// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    ButtonProps,
    useBasename,
} from 'react-admin';
import { HubIcon } from '../../../features/hub/components/HubIcon';

export interface HubButtonProps extends Omit<ButtonProps, 'to'> {
    icon?: React.ReactElement;
    to?: string;
    resource?: string;
}

export const HubButton = ({
    icon = <HubIcon />,
    label = 'actions.hub',
    to,
    color = 'primary',
    resource,
    ...rest
}: HubButtonProps) => {
    const basename = useBasename();

    const path = to || `${basename}/hub?resource=${resource}`;

    return (
        <Button
            component={Link}
            to={path}
            label={label}
            color={color}
            {...(rest as any)}
        >
            {icon}
        </Button>
    );
};
