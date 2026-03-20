// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Chip, Typography } from '@mui/material';
import { FunctionField, SimpleShowLayout, TextField } from 'react-admin';

const LabelChips = ({ labels }: { labels: string[] }) => (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
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

export const HubDetailHeader = ({ template }: { template: any }) => {
    if (!template) return null;

    const displayName = template.metadata?.name || template.name;
    const labels = template.metadata?.labels || [];

    return (
        <Box sx={{ width: '100%', minWidth: 0 }}>
            <Typography
                variant="h4"
                sx={{
                    mb: 3,
                    color: 'primary.main',
                    fontWeight: 'bold',
                    overflowWrap: 'anywhere',
                    fontSize: '1.5rem',
                }}
            >
                {displayName}
            </Typography>
            <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 1, width: '100%' }}>
                <SimpleShowLayout
                    record={template}
                    sx={{
                        p: 0,
                        '& .RaLabeled-label': {
                            color: 'text.primary',
                            fontWeight: 'bold',
                            fontSize: '1.25rem',
                            mb: 0.5,
                        },
                        '& .RaLabeled-value': {
                            color: 'text.secondary',
                            overflowWrap: 'anywhere',
                        },
                        '& .RaSimpleShowLayout-row': { mb: 2, mt: 0 },
                    }}
                >
                    <FunctionField label="Name" render={() => displayName} />
                    <TextField source="metadata.description" label="Description" emptyText="-" />
                    <TextField source="metadata.version" label="Version" emptyText="-" />
                    {labels.length > 0 && (
                        <FunctionField
                            label="Labels"
                            render={() => <LabelChips labels={labels} />}
                        />
                    )}
                </SimpleShowLayout>
            </Box>
        </Box>
    );
};