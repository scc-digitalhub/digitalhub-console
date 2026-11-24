// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Chip, Typography } from '@mui/material';
import { StoreSearchItem } from '../../features/search/useStorePathSearch';

export type StoreResourceSummaryProps = {
    item: StoreSearchItem;
    resourceKey: string;
};

export const StoreResourceSummary = ({
    item,
    resourceKey,
}: StoreResourceSummaryProps) => {
    return (
        <>
            <Typography variant="body2" fontWeight={600}>
                {item.name ?? item.id}
            </Typography>

            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    display: 'block',
                    fontFamily: 'monospace',
                    overflowWrap: 'anywhere',
                }}
            >
                {resourceKey}
            </Typography>

            {(item.type || item.kind) && (
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                    {item.type && (
                        <Chip
                            size="small"
                            label={item.type}
                            variant="outlined"
                        />
                    )}
                    {item.kind && (
                        <Chip
                            size="small"
                            label={item.kind}
                            variant="outlined"
                        />
                    )}
                </Box>
            )}
        </>
    );
};