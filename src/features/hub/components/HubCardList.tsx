// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler

// SPDX-License-Identifier: Apache-2.0

import {
    useRecordContext,
    ListView,
    TextField,
    RecordContextProvider,
    FunctionField,
    SimpleShowLayout,
} from 'react-admin';
import {
    Box,
    CardContent,
    CardActionArea,
    Chip,
    Typography,
} from '@mui/material';
import { GridList } from '../../../common/components/layout/GridList';
import { StyledTemplate } from '../../../common/components/layout/StyledTemplate';

interface HubCardProps {
    onSelectTemplate?: (template: any) => void;
    selectedTemplate?: any | null;
}

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

export const HubTemplateSummary = ({
    template,
    variant = 'card',
}: {
    template: any;
    variant?: 'card' | 'header';
}) => {
    if (!template) return null;

    const displayName = template.metadata?.name || template.name;
    const labels = template.metadata?.labels || [];
    const version = template.metadata?.version;

    if (variant === 'header') {
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

                <Box
                    sx={{
                        bgcolor: 'action.hover',
                        borderRadius: 2,
                        p: 1,
                        width: '100%',
                    }}
                >
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
                        <FunctionField
                            label="Name"
                            render={() => displayName}
                        />
                        <TextField
                            source="metadata.description"
                            label="Description"
                            emptyText="-"
                        />
                        <TextField
                            source="metadata.version"
                            label="Version"
                            emptyText="-"
                        />
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
    }

    return (
        <RecordContextProvider value={template}>
            <Box sx={{ width: '100%', minWidth: 0 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1,
                        mb: 0.5,
                    }}
                >
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
                        mb: 1.5,
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

const HubCard = ({ onSelectTemplate, selectedTemplate }: HubCardProps) => {
    const record = useRecordContext();
    if (!record) return null;

    const isSelected =
        selectedTemplate?.name === record.name &&
        selectedTemplate?.metadata?.version === record.metadata?.version;

    return (
        <StyledTemplate
            className={isSelected ? 'selected' : ''}
            elevation={0}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <CardActionArea
                onClick={() => onSelectTemplate?.(record)}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                }}
            >
                <CardContent sx={{ p: 2, width: '100%' }}>
                    <HubTemplateSummary template={record} />
                </CardContent>
            </CardActionArea>
        </StyledTemplate>
    );
};

export const HubCardList = (props: HubCardProps) => (
    <ListView actions={false} pagination={false} component={Box}>
        <GridList
            spacing={2}
            component={<Box sx={{ width: '100%' }} />}
            linkType={false}
        >
            <HubCard {...props} />
        </GridList>
    </ListView>
);
