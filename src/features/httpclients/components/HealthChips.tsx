// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Alert, Chip, Stack } from '@mui/material';

interface HealthChipsProps {
    ready: boolean;
    live: boolean;
    message?: string;
}

export const HealthChips = ({ ready, live, message }: HealthChipsProps) => {
    return (
        <>
            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                <Chip
                    key="ready"
                    label="READY"
                    color={ready ? 'success' : 'error'}
                />
                <Chip
                    key="live"
                    label="LIVE"
                    color={live ? 'success' : 'error'}
                />
            </Stack>

            {message && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {message}
                </Alert>
            )}
        </>
    );
};
