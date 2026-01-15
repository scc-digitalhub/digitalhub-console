// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslate } from 'react-admin';

export const FormLabel = (props: { label: string }) => {
    const { label } = props;
    const translate = useTranslate();

    return (
        <Box sx={{ mt: '9px', mb: '7px', width: '100%' }}>
            <Typography variant="h5" gutterBottom>
                {translate(label, { _: label })}
            </Typography>
            <Divider />
        </Box>
    );
};
