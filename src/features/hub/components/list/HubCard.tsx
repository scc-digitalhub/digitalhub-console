// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRecordContext, useListContext, useTranslate } from 'react-admin';
import { CardContent, CardActionArea, Chip } from '@mui/material';
import { StyledTemplate } from '../../../../common/components/layout/StyledTemplate';
import { HubCardSummary } from './HubCardSummary';

interface HubCardProps {
    showType?: boolean;
}

export const HubCard = ({ showType }: HubCardProps) => {
    const record = useRecordContext();
    const { selectedTemplate, setSelectedTemplate } = useListContext() as any;

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
                borderColor: isSelected ? 'primary.main' : 'divider',
                transition: 'border-color 0.2s',
            }}
        >
            <CardActionArea
                onClick={() => setSelectedTemplate(record)}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                }}
            >
                <CardContent sx={{ p: 2, width: '100%' }}>
                    {showType && record.resourceName && (
                        <Chip
                            label={record.resourceName}
                            size="small"
                            color={'primary'}
                            variant="outlined"
                            sx={{ mb: 1, fontSize: '0.7rem' }}
                        />
                    )}
                    <HubCardSummary template={record} />
                </CardContent>
            </CardActionArea>
        </StyledTemplate>
    );
};
