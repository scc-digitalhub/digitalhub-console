// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Alert, Chip, Stack } from '@mui/material';
import { useTranslate } from 'react-admin';

interface HealthChipsProps {
    ready: boolean;
    live: boolean;
    message?: string;
}

export const HealthChips = ({ ready, live, message }: HealthChipsProps) => {
    const translate = useTranslate();
    return (
        <>
            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                <Chip
                    key="ready"
                    label={translate('states.ready').toUpperCase()}
                    color={ready ? 'success' : 'error'}
                />
                <Chip
                    key="live"
                    label={translate('states.live').toUpperCase()}
                    color={live ? 'success' : 'error'}
                />
            </Stack>

            {message && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {translate(message)}
                </Alert>
            )}
        </>
    );
};
