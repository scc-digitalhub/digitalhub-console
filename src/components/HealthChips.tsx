// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Chip, Stack } from '@mui/material';

interface HealthChipsProps {
    ready: boolean;
    live: boolean;
}

export const HealthChips = ({ ready, live }: HealthChipsProps) => {
    return (
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Chip
                key="ready"
                label="READY"
                color={ready ? 'success' : 'error'}
            />
            <Chip key="live" label="LIVE" color={live ? 'success' : 'error'} />
        </Stack>
    );
};
