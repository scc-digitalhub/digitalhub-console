// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import Typography, { TypographyProps } from '@mui/material/Typography';
import { useTranslate } from 'react-admin';

export const EmptyMessage = (props: TypographyProps & { message: string }) => {
    const { message, ...rest } = props;
    const translate = useTranslate();

    return (
        <Typography
            variant="body1"
            color="gray"
            sx={{ textAlign: 'center', paddingY: 4 }}
            {...rest}
        >
            {translate(message)}
        </Typography>
    );
};
