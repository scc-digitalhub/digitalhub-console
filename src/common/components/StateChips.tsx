// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    ChipField,
    Identifier,
    RaRecord,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import get from 'lodash/get';
import { Chip, Stack, styled, Typography } from '@mui/material';
import { isValidElement, ReactNode } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorIcon from '@mui/icons-material/Error';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import StopIcon from '@mui/icons-material/Stop';
import HardwareIcon from '@mui/icons-material/Hardware';
import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import React from 'react';

export const StateChips = (props: {
    resource?: string;
    record?: RaRecord<Identifier>;
    source: string;
    label?: string;
    sortable?: boolean;
    size?: 'medium' | 'small';
    fontSize?: 'medium' | 'small' | 'inherit';
    variant?: 'filled' | 'compact' | 'outlined';
    icon?: ReactNode | boolean;
}) => {
    const {
        source,
        size = 'medium',
        variant = 'filled',
        fontSize: fontSizeProp = 'medium',
        icon: iconProps,
        ...rest
    } = props;
    const translate = useTranslate();
    const record = useRecordContext(rest);
    const value = get(record, source)?.toString().toUpperCase();
    if (!record || !value) {
        return <></>;
    }

    const fontSize =
        fontSizeProp === 'inherit'
            ? undefined
            : fontSizeProp === 'medium'
            ? '110%'
            : fontSizeProp === 'small'
            ? '100%'
            : 'inherit';

    const r = {
        value: translate('states.' + value.toLowerCase()).toUpperCase(),
    };

    const icon =
        iconProps === false
            ? undefined
            : isValidElement(iconProps)
            ? iconProps
            : StateIcons[value]
            ? React.createElement(StateIcons[value], {
                  size: fontSizeProp === 'medium' ? 16 : 12,
                  color:
                      variant == 'outlined'
                          ? StateColors[value]
                          : 'text.primary',
              })
            : undefined;

    switch (variant) {
        case 'outlined':
            return (
                <Typography
                    variant="body2"
                    color={StateColors[value]}
                    fontWeight="medium"
                    fontSize={fontSize}
                    sx={{ display: 'inline-flex', alignItems: 'center' }}
                >
                    {value}{' '}
                    {icon && (
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                marginLeft: '4px',
                            }}
                        >
                            {icon}
                        </span>
                    )}
                </Typography>
            );
        case 'compact':
            return (
                <Stack direction="row" gap={0.5}>
                    <RoundChip color={StateColors[value]} size={size} />
                    <Typography
                        variant="body2"
                        color={StateColors[value]}
                        fontWeight="medium"
                        fontSize={fontSize}
                    >
                        {value} {icon && <span>{icon}</span>}
                    </Typography>
                </Stack>
            );
        default:
            return (
                <StyledChip
                    label={translate(
                        'states.' + value.toLowerCase()
                    ).toUpperCase()}
                    color={StateColors[value]}
                    size={size}
                    icon={icon || undefined}
                />
            );
    }
};

const RoundChip = styled(Chip, {
    name: 'RoundChip',
    overridesResolver: (props, styles) => styles.root,
})({
    borderRadius: '50%',
    aspectRatio: '1 / 1',
    minWidth: 0,
    padding: 0,
    maxWidth: '70%',
    maxHeight: '70%',
    '& .MuiChip-label': { display: 'none' },
});

const StyledChip = styled(Chip, {
    name: 'StyledChip',
    overridesResolver: (props, styles) => styles.root,
})({
    [`&.StyledChip-root`]: { cursor: 'inherit' },
});

export enum StateColors {
    BUILT = 'warning',
    COMPLETED = 'success',
    CREATED = 'default',
    DELETED = 'secondary',
    DELETING = 'warning',
    ERROR = 'error',
    PENDING = 'warning',
    READY = 'success',
    RUNNING = 'info',
    STOP = 'warning',
    STOPPED = 'warning',
    UPLOADING = 'info',
}

export const StateIcons = {
    RUNNING: CircularProgress,
    COMPLETED: DoneAllIcon,
    ERROR: ErrorIcon,
    STOPPED: StopIcon,
    BUILT: HardwareIcon,
    READY: AssistantPhotoIcon,
    PENDING: PendingActionsIcon,
};
