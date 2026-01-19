// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Box,
    ListItem,
    List as MuiList,
    Typography,
    useTheme,
    ListItemButton,
    ListItemText,
    Badge,
} from '@mui/material';
import { StateColors } from '../../../../common/components/StateChips';
import { convertToDate } from '../helper';
import { useCreatePath } from 'react-admin';
import { useNavigate } from 'react-router-dom';

export const RecentRunsList = (props: { elements: any[] }) => {
    const { elements } = props;
    const createPath = useCreatePath();
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <MuiList sx={{ pt: 0, mt: 2 }}>
            {elements.slice(0, 3).map(el => {
                const task = el?.spec?.task || '';
                const url = new URL(task);

                const taskKind = url.protocol
                    ? url.protocol.substring(0, url.protocol.length - 1)
                    : '';

                const functionData = url.pathname.split('/')[3];
                const functionName = functionData.split(':')[0];
                const functionId = functionData.split(':')[1];
                const link = `${createPath({
                    type: 'show',
                    resource: 'functions',
                    id: functionId,
                })}/${taskKind}`;

                return (
                    <ListItem disablePadding key={el.id}>
                        <ListItemButton
                            onClick={() => navigate(link)}
                            sx={{
                                '&:hover': {
                                    backgroundColor:
                                        theme.palette.background.default,
                                },
                                paddingY: 1.5,
                                justifyContent: 'space-between',
                            }}
                            disableGutters
                        >
                            <ListItemText
                                disableTypography
                                primary={
                                    <Badge
                                        variant="dot"
                                        color={
                                            StateColors[el?.status?.state || '']
                                        }
                                        sx={{ pr: 1 }}
                                    >
                                        <Typography
                                            variant="body1"
                                            color={'primary'}
                                        >
                                            {functionName}
                                        </Typography>
                                    </Badge>
                                }
                                secondary={
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                    >
                                        <Typography
                                            variant="body2"
                                            color={'gray'}
                                        >
                                            {el.metadata?.updated
                                                ? convertToDate(
                                                      el.metadata.updated
                                                  ).toLocaleString()
                                                : ''}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color={'gray'}
                                        >
                                            {taskKind}
                                        </Typography>
                                    </Box>
                                }
                                sx={{ my: 0 }}
                            />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </MuiList>
    );
};
