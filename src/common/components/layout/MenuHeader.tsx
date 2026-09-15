// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useSidebarState, useTranslate } from 'react-admin';
import { Box, Popover, Stack, Typography } from '@mui/material';
import { ReactElement, useRef, useState } from 'react';

export const MenuHeader = (props: {
    primaryText: string;
    helperText?: string;
    icon?: ReactElement;
}) => {
    const translate = useTranslate();
    const [open, setOpen] = useSidebarState();
    const [popoverOpen, setPopoverOpen] = useState(false);
    const anchorRef = useRef(null);

    const handlePopoverOpen = () => {
        if (!popoverOpen) {
            setPopoverOpen(true);
            setTimeout(() => {
                setPopoverOpen(false);
            }, 3000);
        }
    };
    const handlePopoverClose = () => {
        if (popoverOpen) {
            setPopoverOpen(false);
        }
    };
    const showPopover = !!props.helperText;
    const popoverExtendedProps = showPopover
        ? {
              'aria-owns': popoverOpen ? 'mouse-over-popover' : '',
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
        >
            <Box sx={{ px: 2, pb: 1 }}>
                {open && (
                    <Typography
                        variant="inherit"
                        component="span"
                        noWrap
                        sx={{
                            flexGrow: 1,
                            textTransform: 'uppercase',
                            fontSize: '90%',
                            cursor: 'default',
                        }}
                        color="text.secondary"
                        {...popoverExtendedProps}
                    >
                        {translate(props.primaryText)}
                    </Typography>
                )}
            </Box>
            <Popover
                sx={{ pointerEvents: 'none' }}
                open={popoverOpen}
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
                    {translate(props.helperText || '')}
                </Typography>
            </Popover>
        </Stack>
    );
};
