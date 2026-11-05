// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box } from '@mui/material';
import { ReactNode } from 'react';

export const DialogWrapper = (props: { children: ReactNode }) => (
    <Box
        component="span"
        sx={{ display: 'contents' }}
        // Dialog portal clicks still bubble through the React tree to the row.
        onClick={event => event.stopPropagation()}
    >
        {props.children}
    </Box>
);
