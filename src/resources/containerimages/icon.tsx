// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { IconContext } from 'react-icons';

import { LuContainer } from 'react-icons/lu';

const DefaultIcon = LuContainer;

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
export const ContainerImageIcon = (props: FunctionIconProps) => {
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

    return (
        <IconContext.Provider value={iconContext}>
            {React.createElement(props.defaultIcon || DefaultIcon)}
        </IconContext.Provider>
    );
};
