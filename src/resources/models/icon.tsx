// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { IconContext } from 'react-icons';
import { SiHuggingface, SiMlflow } from 'react-icons/si';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import { useRecordContext } from 'react-admin';

const icons = {
    huggingface: SiHuggingface,
    mlflow: SiMlflow,
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

export const ModelIcon = (props: {
    kind?: string;
    color?: MuiIconColor;
    fontSize?: MuiIconFontSize;
}) => {
    const { kind: kindProps, color, fontSize } = props;
    const record = useRecordContext();
    const theme = useTheme();

    const kind = kindProps || record?.kind;

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

    if (!kind || !(kind in icons)) {
        return <ModelTrainingIcon color={color} fontSize={fontSize} />;
    }

    return (
        <IconContext.Provider value={iconContext}>
            {kind === 'huggingface' && <SiHuggingface color="#f6c400" />}
            {kind === 'mlflow' && <SiMlflow />}
        </IconContext.Provider>
    );
};
