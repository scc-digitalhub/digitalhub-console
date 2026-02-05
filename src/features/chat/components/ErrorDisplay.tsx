// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Typography, useTheme } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useTranslate } from 'react-admin';
import { RetryButton } from '../../../common/components/buttons/RetryButton';

interface ErrorDisplayProps {
    error: Error | string;
    onRetry?: () => void;
}

export const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const theme = useTheme();
    const translate = useTranslate();
    const isDark = theme.palette.mode === 'dark';

    return (
        <div
            className="bg-white dark:bg-[#1E1E20] border border-red-200 dark:border-red-900 shadow-sm rounded-2xl rounded-tl-sm px-5 py-4 mr-auto max-w-[80%]"
            style={{
                color: isDark ? '#E5E5E7' : '#1f2937',
            }}
        >
            <Box display="flex" flexDirection="column" gap={1.5}>
                <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    color="error.main"
                >
                    <ErrorOutlineIcon fontSize="small" />
                    <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: 'inherit' }}
                    >
                        {translate('messages.chat.generation_error')}
                    </Typography>
                </Box>

                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        opacity: 0.8,
                        fontSize: '0.85rem',
                        lineHeight: 1.5,
                        pl: 0.5,
                    }}
                >
                    {errorMessage}
                </Typography>

                {onRetry && (
                    <Box sx={{ display: 'flex', mt: 0.5 }}>
                        <RetryButton onClick={onRetry} />
                    </Box>
                )}
            </Box>
        </div>
    );
};
