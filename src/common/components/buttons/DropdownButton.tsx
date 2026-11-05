// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Menu, Button, Stack, ButtonOwnProps } from '@mui/material';
import { Box } from '@mui/system';
import { useState, MouseEvent, ReactElement } from 'react';
import { useTranslate, RaRecord, ShowButtonProps } from 'react-admin';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DialogWrapper } from '../DialogWrapper';

export const DropDownButton = (props: DrodownButtonProps) => {
    const {
        icon,
        label = 'actions.actions',
        children,
        color = 'primary',
        variant = 'contained',
        size = 'small',
        sx,
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
    const handleSelection = (event: MouseEvent<HTMLElement>): void => {
        // Capture selections even when children stop propagation, but ignore portals.
        if (
            event.target instanceof Node &&
            event.currentTarget.contains(event.target)
        ) {
            setAnchorEl(null);
        }
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
                    size={size}
                    startIcon={icon}
                    endIcon={<ExpandMoreIcon fontSize="small" />}
                    sx={sx}
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
            >
                <DialogWrapper>
                    <Stack
                        direction={'column'}
                        onClickCapture={handleSelection}
                        sx={{
                            minWidth: '80px',
                            marginX: '10px',
                            alignItems: 'stretch',
                            '& .MuiButton-root': {
                                justifyContent: 'flex-start',
                                textAlign: 'left',
                            },
                        }}
                    >
                        {children}
                    </Stack>
                </DialogWrapper>
            </Menu>
        </Box>
    );
};

export type DrodownButtonProps<RecordType extends RaRecord = any> =
    ShowButtonProps<RecordType> & {
        children: ReactElement | ReactElement[];
    } & Pick<ButtonOwnProps, 'sx'>;
