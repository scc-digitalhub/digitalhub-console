// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import Typography from '@mui/material/Typography';
import { useTranslate } from 'react-admin';

export const NoContent = (props: { message: string }) => {
    const { message } = props;
    const translate = useTranslate();

    return (
        <Typography
            variant="body1"
            sx={{ textAlign: 'center', paddingY: 4, color: 'gray' }}
        >
            {translate(message)}
        </Typography>
    );
};
