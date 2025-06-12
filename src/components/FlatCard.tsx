// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Paper, PaperProps } from '@mui/material';

export const FlatCard = (props: PaperProps) => {
    const { children, sx: sxProps = {}, ...rest } = props;
    const sx = { ...sxProps, paddingX: '8px' };
    return (
        <Paper variant="elevation" elevation={0} sx={sx} {...rest}>
            {children}
        </Paper>
    );
};
