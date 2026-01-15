// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Popover, Stack, Typography } from '@mui/material';
import get from 'lodash/get';
import { MouseEvent, useRef, useState } from 'react';

import {
    TextFieldProps,
    useRecordContext,
    sanitizeFieldRestProps,
    useNotify,
    IconButtonWithTooltip,
    useTranslate,
} from 'react-admin';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { grey } from '@mui/material/colors';

export const IdField = <
    RecordType extends Record<string, any> = Record<string, any>
>(
    props: Omit<TextFieldProps<RecordType>, 'source' | 'variant'> & {
        source: string;
        copy?: boolean;
        popover?: boolean;
        truncate?: number;
        format?: (value: any) => any;
        variant?: 'body' | 'monospaced';
    }
) => {
    const {
        className,
        source,
        copy = true,
        popover: popoverProps,
        truncate,
        format = v => v,
        label,
        variant = 'body',
        sx,
        ...rest
    } = props;
    const record = useRecordContext(props);
    const notify = useNotify();
    const translate = useTranslate();
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const value = get(record, source);
    if (!value) return null;

    const displayValue = format(value) || '';
    const displayLabel =
        label && typeof label === 'string'
            ? translate(label)
            : source && typeof source === 'string'
            ? translate(source)
            : translate('content');

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (value) {
            navigator.clipboard.writeText(value);
            notify('messages.content_copied_x', {
                messageArgs: { x: displayLabel + ': ' + value },
            });
        }
    };

    const handlePopoverOpen = () => {
        if (!open) {
            setOpen(true);
        }
    };
    const handlePopoverClose = () => {
        if (open) {
            setOpen(false);
        }
    };

    const showPopover =
        (popoverProps === true ||
            (truncate &&
                typeof displayValue === 'string' &&
                displayValue.length > truncate)) &&
        popoverProps !== false;
    const popoverExtendedProps = showPopover
        ? {
              'aria-owns': open ? 'mouse-over-popover' : null,
              'aria-haspopup': true,
              onMouseEnter: handlePopoverOpen,
              onMouseLeave: handlePopoverClose,
          }
        : {};

    return (
        <Stack
            ref={anchorRef}
            direction={'row'}
            columnGap={0}
            alignItems={'flex-start'}
            sx={sx}
        >
            <Typography
                component="span"
                variant="body2"
                className={className}
                onClick={e => {
                    if (copy) {
                        handleClick(e);
                    }
                }}
                {...sanitizeFieldRestProps(rest)}
                {...popoverExtendedProps}
                sx={{
                    '&:hover': {
                        backgroundColor: grey[200],
                    },
                    fontFamily:
                        variant === 'monospaced' ? 'Monospace' : 'inherit',
                }}
            >
                {truncate &&
                typeof displayValue === 'string' &&
                displayValue.length > truncate
                    ? displayValue.substring(0, truncate) + '...'
                    : displayValue}
            </Typography>
            <Popover
                sx={{ pointerEvents: 'none' }}
                open={open}
                anchorEl={anchorRef.current}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
                slotProps={{
                    paper: {
                        variant: 'outlined',
                        square: true,
                        elevation: 0,
                    },
                }}
            >
                <Typography variant="body2" sx={{ p: 1 }}>
                    {displayValue}
                </Typography>
            </Popover>
            {copy && (
                <IconButtonWithTooltip
                    label="actions.click_to_copy"
                    onClick={handleClick}
                    sx={{ py: 0 }}
                >
                    <ContentCopyIcon fontSize="small" />
                </IconButtonWithTooltip>
            )}
        </Stack>
    );
};
