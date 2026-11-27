// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslate } from 'react-admin';
import { StoreSearchItem } from './types';
import { StoreResourceSummary } from './StoreResourceSummary';

export type SelectedResourceCardProps = {
    item: StoreSearchItem;
    resourceKey: string;
    readOnly?: boolean;
    onClear: () => void;
};

export const SelectedResourceCard = ({
    item,
    resourceKey,
    readOnly,
    onClear,
}: SelectedResourceCardProps) => {
    const translate = useTranslate();
    const clearLabel = translate('ra.action.clear_input_value', {
        _: 'Clear',
    });

    return (
        <Box
            sx={{
                mt: 1,
                p: 1.5,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                }}
            >
                <Typography variant="caption" color="text.secondary">
                    {translate('fields.path.selected_resource', {
                        _: 'Selected resource',
                    })}
                </Typography>
                {!readOnly && (
                    <Tooltip title={clearLabel}>
                        <IconButton
                            size="small"
                            onClick={onClear}
                            aria-label={clearLabel}
                            sx={{ p: 0.25 }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            <StoreResourceSummary item={item} resourceKey={resourceKey} />
        </Box>
    );
};
