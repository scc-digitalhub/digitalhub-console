// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Grid, Typography, Button } from '@mui/material';
import { useCreatePath, useTranslate } from 'react-admin';
import { StateColors } from '../../../common/components/StateChips';
import { CounterBadge } from '../../../common/components/CounterBadge';
import { Link } from 'react-router-dom';

export const RunsGrid = (props: {
    runs: {
        completed: number | undefined;
        running: number | undefined;
        error: number | undefined;
    };
}) => {
    const { runs } = props;
    const createPath = useCreatePath();

    const entries = Object.entries(runs);
    const translate = useTranslate();

    return (
        <Grid container justifyContent="center" height="5em">
            {entries.map(([k, v]) => {
                const filter = { state: k.toUpperCase() };
                const link =
                    createPath({ type: 'list', resource: 'runs' }) +
                    '?filter=' +
                    encodeURIComponent(JSON.stringify(filter));
                return (
                    <Grid
                        size="grow"
                        key={k}
                        textAlign={'center'}
                        minWidth={'5em'}
                    >
                        <Button
                            component={Link}
                            to={link}
                            sx={{
                                display: 'block',
                                textAlign: 'center',
                                textTransform: 'none',
                            }}
                            color="secondary"
                        >
                            <CounterBadge
                                value={v}
                                color={`${
                                    StateColors[k.toUpperCase()]
                                }.contrastText`}
                                backgroundColor={`${
                                    StateColors[k.toUpperCase()]
                                }.main`}
                            />
                            <Typography
                                variant="body2"
                                sx={{
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                }}
                                pt={0.5}
                            >
                                {translate(`pages.dashboard.states.${k}`)}
                            </Typography>
                        </Button>
                    </Grid>
                );
            })}
        </Grid>
    );
};
