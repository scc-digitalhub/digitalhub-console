// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Inbox from '@mui/icons-material/Inbox';
import {
    useTranslate,
    useResourceDefinition,
    useResourceContext,
    useGetResourceLabel,
} from 'ra-core';
import { CreateButton } from 'react-admin';
import { isValidElement } from 'react';

export const Empty = (props: EmptyProps) => {
    const { className, children, showIcon = true } = props;
    const { hasCreate } = useResourceDefinition(props);
    const resource = useResourceContext(props);
    const translate = useTranslate();

    const getResourceLabel = useGetResourceLabel();
    const resourceName = translate(`resources.${resource}.forcedCaseName`, {
        smart_count: 0,
        _: getResourceLabel(resource || '', 0),
    });

    const emptyMessage = translate('ra.page.empty', { name: resourceName });
    const inviteMessage = translate('ra.page.invite');

    return (
        <Root className={className}>
            <div className={EmptyClasses.message}>
                {showIcon && <Inbox className={EmptyClasses.icon} />}
                <Typography variant="h4" paragraph>
                    {translate(`resources.${resource}.empty`, {
                        _: emptyMessage,
                    })}
                </Typography>
                {(hasCreate || children) && (
                    <Typography variant="body1">
                        {translate(`resources.${resource}.invite`, {
                            _: inviteMessage,
                        })}
                    </Typography>
                )}
            </div>
            {(hasCreate || children) && (
                <div className={EmptyClasses.toolbar}>
                    {children && isValidElement(children) ? (
                        children
                    ) : (
                        <CreateButton variant="contained" />
                    )}
                </div>
            )}
        </Root>
    );
};

export interface EmptyProps {
    resource?: string;
    hasCreate?: boolean;
    className?: string;
    children?: React.ReactElement;
    showIcon?: boolean;
}

const PREFIX = 'RaEmpty';

export const EmptyClasses = {
    message: `${PREFIX}-message`,
    icon: `${PREFIX}-icon`,
    toolbar: `${PREFIX}-toolbar`,
};

const Root = styled('span', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    flex: 1,
    [`& .${EmptyClasses.message}`]: {
        textAlign: 'center',
        opacity: theme.palette.mode === 'light' ? 0.5 : 0.8,
        margin: '0 1em',
        color:
            theme.palette.mode === 'light'
                ? 'inherit'
                : theme.palette.text.primary,
    },

    [`& .${EmptyClasses.icon}`]: {
        width: '9em',
        height: '9em',
    },

    [`& .${EmptyClasses.toolbar}`]: {
        textAlign: 'center',
        marginTop: '2em',
    },
}));
