// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { Stack } from '@mui/system';
import { Typography } from '@mui/material';

export const MetricNotSupported = () => {
    return (
        <Stack
            direction="column"
            spacing={0.5}
            sx={{
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Metric not supported
            </Typography>
            <SentimentVeryDissatisfiedIcon />
        </Stack>
    );
};
