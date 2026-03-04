// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    useTranslate,
    useRecordContext,
    ListView,
    TextField,
    FunctionField,
} from 'react-admin';
import {
    Box,
    CardContent,
    CardActionArea,
    Chip,
    Typography,
    useTheme,
} from '@mui/material';
import { GridList } from '../../../common/components/layout/GridList';
import { StyledTemplate } from '../../../common/components/layout/StyledTemplate';

interface HubCardProps {
    onSelectTemplate?: (template: any) => void;
    selected?: boolean;
}

const HubCard = ({ onSelectTemplate, selected = false }: HubCardProps) => {
    const theme = useTheme();
    const record = useRecordContext();

    if (!record) return null;

    return (
        <StyledTemplate
            className={selected ? 'selected' : ''}
            elevation={0}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
            }}
        >
            <CardActionArea
                onClick={() => onSelectTemplate && onSelectTemplate(record)}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                }}
            >
                <CardContent sx={{ p: 2, width: '100%' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            mb: 0.5,
                        }}
                    >
                        <TextField
                            source="metadata.name"
                            sx={{
                                color: 'text.primary',
                                fontSize: '1.25rem',
                                lineHeight: 1.2,
                            }}
                        />
                        <FunctionField
                            render={(rec: any) =>
                                rec?.metadata?.version ? (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        v{rec.metadata.version}
                                    </Typography>
                                ) : null
                            }
                        />
                    </Box>
                    <TextField
                        source="name"
                        sx={{
                            display: 'block',
                            color: 'text.secondary',
                            mb: 1.5,
                            fontSize: '0.875rem',
                        }}
                    />

                    <FunctionField
                        render={(rec: any) => (
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    flexWrap: 'wrap',
                                    mb: 2,
                                }}
                            >
                                {rec?.metadata?.labels?.map(
                                    (label: string, idx: number) => (
                                        <Chip
                                            key={idx}
                                            label={label.split(':')[1] || label}
                                            size="small"
                                            sx={{
                                                bgcolor: 'action.selected',
                                                color: 'text.primary',
                                                border: 'none',
                                                height: 24,
                                                fontSize: '0.75rem',
                                            }}
                                        />
                                    )
                                )}
                            </Box>
                        )}
                    />

                    <TextField
                        source="metadata.description"
                        sx={{
                            display: 'block',
                            color: 'text.primary',
                            lineHeight: 1.4,
                            fontSize: '0.875rem',
                        }}
                    />
                </CardContent>
            </CardActionArea>
        </StyledTemplate>
    );
};

interface HubCardListProps {
    onSelectTemplate?: (template: any) => void;
}

export const HubCardList = ({ onSelectTemplate }: HubCardListProps) => {
    return (
        <ListView actions={false} pagination={false} component={Box}>
            <HubCardListContent onSelectTemplate={onSelectTemplate} />
        </ListView>
    );
};

const HubCardListContent = ({ onSelectTemplate }: HubCardListProps) => {
    const translate = useTranslate();
    return (
        <GridList
            spacing={2}
            component={<Box sx={{ width: '100%' }} />}
            empty={
                <Typography variant="body1" color="text.secondary" mt={4}>
                    {translate('pages.hub.empty', {
                        _: 'No templates match your current filters.',
                    })}
                </Typography>
            }
            linkType={false}
        >
            <HubCard onSelectTemplate={onSelectTemplate} />
        </GridList>
    );
};
