// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, CircularProgress, useTheme } from '@mui/material';

export const Spinner = () => {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress
                color="inherit"
                size={theme.spacing(6)}
                thickness={3}
            />
        </Box>
    );
};
