// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Menu, Button, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { useState, MouseEvent, ReactElement, FocusEvent } from 'react';
import { useTranslate, RaRecord, ShowButtonProps } from 'react-admin';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const DropDownButton = (props: DrodownButtonProps) => {
    const {
        icon,
        label = 'actions.actions',
        children,
        color = 'primary',
        variant = 'contained',
    } = props;
    const translate = useTranslate();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleOpen = (event: MouseEvent<HTMLElement>): void => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (event: MouseEvent<HTMLElement>): void => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    return (
        <Box className="DropDownMenu" component="span">
            <Box>
                <Button
                    color={color}
                    variant={variant}
                    aria-controls="simple-menu"
                    aria-label=""
                    aria-haspopup="true"
                    onClick={handleOpen}
                    startIcon={icon}
                    endIcon={<ExpandMoreIcon fontSize="small" />}
                >
                    {translate(label)}
                </Button>
            </Box>
            <Menu
                id="dropdown-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                onBlur={handleBlur}
            >
                <Stack
                    direction={'column'}
                    sx={{
                        minWidth: '80px',
                        marginLeft: '10px',
                        alignItems: 'flex-start',
                    }}
                >
                    {children}
                </Stack>
            </Menu>
        </Box>
    );
};

export type DrodownButtonProps<RecordType extends RaRecord = any> =
    ShowButtonProps<RecordType> & {
        children: ReactElement | ReactElement[];
    };
