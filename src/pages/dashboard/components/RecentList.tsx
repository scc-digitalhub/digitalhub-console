// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Box,
    ListItem,
    ListItemButton,
    ListItemText,
    List as MuiList,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import { useCreatePath } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { convertToDate } from '../helper';
import { ResourceIcon } from './ResourceIcon';

export const RecentList = (props: {
    resource: string;
    records: any[];
    num?: number;
}) => {
    const { resource, records, num = 3 } = props;
    const createPath = useCreatePath();
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <MuiList sx={{ pt: 0, mt: 2 }}>
            {records?.slice(0, num).map(record => (
                <ListItem disablePadding key={record.id}>
                    <ListItemButton
                        onClick={() =>
                            navigate(
                                createPath({
                                    type: 'show',
                                    resource: resource,
                                    id: record.id,
                                })
                            )
                        }
                        sx={{
                            '&:hover': {
                                backgroundColor:
                                    theme.palette.background.default,
                            },
                            paddingY: 1.5,
                        }}
                        disableGutters
                    >
                        <ListItemText
                            disableTypography
                            primary={
                                <Stack direction="row" gap={1}>
                                    <ResourceIcon
                                        resource={resource}
                                        kind={record.kind}
                                    />
                                    <Typography
                                        variant="body1"
                                        color={'primary'}
                                    >
                                        {record.metadata.name || record.name}
                                    </Typography>
                                </Stack>
                            }
                            secondary={
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <Typography variant="body2" color={'gray'}>
                                        {record.metadata?.updated
                                            ? convertToDate(
                                                  record.metadata.updated
                                              ).toLocaleString()
                                            : ''}
                                    </Typography>

                                    <Typography variant="body2" color={'gray'}>
                                        {record.kind}
                                    </Typography>
                                </Box>
                            }
                            sx={{ my: 0 }}
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </MuiList>
    );
};
