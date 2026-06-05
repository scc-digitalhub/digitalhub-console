// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Layout, useTranslate } from 'react-admin';
import { MyAppBar } from './MyAppBar';
import { MyMenu } from './MyMenu';
import { MySidebar } from './MySidebar';
import { AppBar, Box, Paper, Stack, Typography } from '@mui/material';
import { InstanceMetrics } from '../features/k8smetrics/InstanceMetrics';

export const MyLayout = (props: any) => {
    const translate = useTranslate();
    return (
        <Stack direction="column" spacing={1} alignItems="start">
            <Layout
                {...props}
                appBar={MyAppBar}
                menu={MyMenu}
                sidebar={MySidebar}
                pb={10}
            />
            <AppBar
                color="default"
                position="static"
                // sx={{borderTop: '1px solid #ccc'}}
                // position="fixed"
                // sx={{ top: 'auto', bottom: 0 }}
                elevation={0}
                sx={{ px: 1, py: 0.2, width: '100%' }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                        width: '100%',
                        color: 'white',
                    }}
                >
                    {/* <Typography
                        variant="body1"
                        fontSize={'medium'}
                        color={'secondary'}
                    >
                        {translate('fields.k8s.resources.description')}
                    </Typography> */}
                    <InstanceMetrics
                        metrics={['cpu', 'memory', 'disk', 'pods']}
                    />
                </Box>
            </AppBar>
        </Stack>
    );
};
