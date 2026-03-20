// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Chip, Typography } from '@mui/material';
import { TextField } from 'react-admin';
import { RecordContextProvider } from 'react-admin';

const LabelChips = ({ labels }: { labels: string[] }) => (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
        {labels.map(label => (
            <Chip
                key={label}
                label={label.split(':')[1]}
                size="small"
                sx={{
                    bgcolor: 'action.selected',
                    color: 'text.primary',
                    border: 'none',
                    height: 24,
                    fontSize: '0.75rem',
                }}
            />
        ))}
    </Box>
);

export const HubCardSummary = ({ template }: { template: any }) => {
    if (!template) return null;

    const displayName = template.metadata?.name || template.name;
    const labels = template.metadata?.labels || [];
    const version = template.metadata?.version;

    return (
        <RecordContextProvider value={template}>
            <Box sx={{ width: '100%', minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                    <Typography
                        sx={{
                            color: 'primary.main',
                            fontWeight: 'bold',
                            lineHeight: 1.2,
                            overflowWrap: 'anywhere',
                        }}
                    >
                        {displayName}
                    </Typography>
                    {version && (
                        <Typography variant="caption" color="text.secondary">
                            v{version}
                        </Typography>
                    )}
                </Box>
                <TextField
                    source="name"
                    sx={{
                        display: 'block',
                        color: 'text.secondary',
                        mb: 1,
                        fontSize: '0.875rem',
                        overflowWrap: 'anywhere',
                    }}
                />
                {labels.length > 0 && <LabelChips labels={labels} />}
                <TextField
                    source="metadata.description"
                    sx={{
                        display: 'block',
                        color: 'text.primary',
                        lineHeight: 1.4,
                        fontSize: '0.875rem',
                        overflowWrap: 'anywhere',
                    }}
                />
            </Box>
        </RecordContextProvider>
    );
};