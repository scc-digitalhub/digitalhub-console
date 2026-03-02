// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useState, MouseEvent } from 'react';
import {
    Box,
    Button,
    ClickAwayListener,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Paper,
    Popper,
    useTheme,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

interface FilterDropdownProps {
    category: string;
    values: string[];
    filterValues: Record<string, string[]>;
    handleToggle: (category: string, value: string) => void;
}

export const FilterDropdown = ({
    category,
    values,
    filterValues,
    handleToggle,
}: FilterDropdownProps) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? `filter-popper-${category}` : undefined;

    const activeCount = (filterValues[category] || []).length;

    return (
        <ClickAwayListener onClickAway={handleClose}>
            <Box minWidth={200}>
                <Button
                    aria-describedby={id}
                    variant="outlined"
                    onClick={handleClick}
                    endIcon={
                        <ExpandMoreIcon
                            sx={{
                                transform: open ? 'rotate(180deg)' : 'none',
                                transition: 'transform 0.2s',
                            }}
                        />
                    }
                    sx={{
                        width: '100%',
                        justifyContent: 'space-between',
                        minHeight: 40,
                        textTransform: 'capitalize',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        bgcolor: open ? 'action.hover' : 'transparent',
                    }}
                >
                    {category} {activeCount > 0 && `(${activeCount})`}
                </Button>

                <Popper
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    placement="bottom-start"
                    style={{ zIndex: theme.zIndex.modal }}
                    modifiers={[
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 4],
                            },
                        },
                    ]}
                >
                    <Paper
                        elevation={4}
                        sx={{
                            p: 1.5,
                            minWidth: 180,
                            maxHeight: 300,
                            overflow: 'auto',
                            borderRadius: 2,
                        }}
                    >
                        <FormGroup>
                            {values.map(val => (
                                <FormControlLabel
                                    key={val}
                                    control={
                                        <Checkbox
                                            size="small"
                                            color="primary"
                                            sx={{ py: 0.5 }}
                                            checked={(
                                                filterValues[category] || []
                                            ).includes(val)}
                                            onChange={() =>
                                                handleToggle(category, val)
                                            }
                                        />
                                    }
                                    label={val}
                                />
                            ))}
                        </FormGroup>
                    </Paper>
                </Popper>
            </Box>
        </ClickAwayListener>
    );
};
