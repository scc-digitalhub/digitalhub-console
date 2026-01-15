// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, alpha, useTheme } from '@mui/material';
import { Series, valueFormatter } from '../utils';
import { CounterBadge } from '../../../common/components/CounterBadge';

export const SingleValue = (props: { values: Series }) => {
    const { values } = props;
    const theme = useTheme();
    const bgColor = alpha(theme.palette?.primary?.main, 0.08);

    return (
        <>
            {values && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <CounterBadge
                        value={valueFormatter(values.data)}
                        color="secondary.main"
                        backgroundColor={bgColor}
                        size="large"
                    />
                </Box>
            )}
        </>
    );
};
