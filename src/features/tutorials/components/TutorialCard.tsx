// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { CardActionArea, CardContent, Typography } from '@mui/material';
import { TextField, useRecordContext } from 'react-admin';
import { StyledTemplate } from '../../../common/theme/StyledTemplate';
import { useTutorialsContext } from '../TutorialsContext';

export const TutorialCard = () => {
    const record = useRecordContext();
    const { selectTutorial } = useTutorialsContext();

    if (!record) return null;

    return (
        <StyledTemplate
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
            <CardActionArea onClick={() => selectTutorial(record)}>
                <CardContent sx={{ p: 2, width: '100%' }}>
                    <Typography
                        sx={{
                            color: 'primary.main',
                            fontWeight: 'bold',
                            lineHeight: 1.2,
                            overflowWrap: 'anywhere',
                        }}
                    >
                        {record.name}
                    </Typography>
                    <TextField
                        source="description"
                        sx={{
                            display: 'block',
                            color: 'text.primary',
                            lineHeight: 1.4,
                            fontSize: '0.875rem',
                            overflowWrap: 'anywhere',
                        }}
                    />
                </CardContent>
            </CardActionArea>
        </StyledTemplate>
    );
};
