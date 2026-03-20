// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box } from '@mui/material';
import { HubFilterBar } from '../HubFilterBar';

interface HubListToolbarProps {
    showTypeFilter?: boolean;
}

// Box che contiene la barra di ricerca e i filtri
export const HubListToolbar = ({ showTypeFilter = false }: HubListToolbarProps) => (
    <Box sx={{ width: '100%', mb: 2 }}>
        <HubFilterBar showTypeFilter={showTypeFilter} />
    </Box>
);