// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { IconContext } from 'react-icons';
import { SiDocker, SiPython } from 'react-icons/si';
import { MdApi } from 'react-icons/md';
import DataObjectIcon from '@mui/icons-material/DataObject';

const DefaultIcon = DataObjectIcon;

const icons = {
    'python*': SiPython,
    'container*': SiDocker,
    '*serve*': MdApi,
};

type MuiIconColor =
    | 'disabled'
    | 'action'
    | 'inherit'
    | 'error'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning';

type MuiIconFontSize = 'small' | 'medium' | 'large';

const fontSizeMap: Record<MuiIconFontSize, string> = {
    small: '1.25rem',
    medium: '1.5rem',
    large: '2.1875rem',
};
export type FunctionIconProps = {
    kind?: string;
    color?: MuiIconColor;
    fontSize?: MuiIconFontSize;
    defaultIcon?: React.ElementType;
};
export const FunctionIcon = (props: FunctionIconProps) => {
    const { kind, color, fontSize } = props;
    const theme = useTheme();

    const resolvedColor = useMemo(() => {
        switch (color) {
            case 'primary':
                return theme.palette.primary.main;
            case 'secondary':
                return theme.palette.secondary.main;
            case 'error':
                return theme.palette.error.main;
            case 'warning':
                return theme.palette.warning.main;
            case 'info':
                return theme.palette.info.main;
            case 'success':
                return theme.palette.success.main;
            case 'action':
                return theme.palette.action.active;
            case 'disabled':
                return theme.palette.action.disabled;
            case 'inherit':
            default:
                return 'currentColor';
        }
    }, [color, theme]);

    const iconContext = useMemo(
        () => ({
            color: resolvedColor,
            size: fontSize ? fontSizeMap[fontSize] : fontSizeMap.medium,
        }),
        [resolvedColor, fontSize]
    );

    const ResolvedIcon = useMemo(() => {
        if (!kind) return null;
        if (kind in icons) return icons[kind as keyof typeof icons];
        for (const [pattern, icon] of Object.entries(icons)) {
            if (pattern.startsWith('*') && pattern.endsWith('*')) {
                const substring = pattern.slice(1, -1);
                if (kind.includes(substring)) return icon;
            } else if (pattern.startsWith('*')) {
                const substring = pattern.slice(1);
                if (kind.endsWith(substring)) return icon;
            } else if (pattern.endsWith('*')) {
                const substring = pattern.slice(0, -1);
                if (kind.startsWith(substring)) return icon;
            }
        }
        return null;
    }, [kind]);

    if (!ResolvedIcon) {
        return React.createElement(props.defaultIcon || DefaultIcon, {
            color,
            fontSize,
        });
    }

    return (
        <IconContext.Provider value={iconContext}>
            {React.createElement(ResolvedIcon)}
        </IconContext.Provider>
    );
};
