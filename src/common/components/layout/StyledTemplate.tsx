// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Card, styled, alpha } from '@mui/material';

export const StyledTemplate = styled(Card, {
    name: 'StyledCard',
    overridesResolver: (_props, styles) => styles.root,
})(({ theme, className }) => ({
    backgroundColor:
        className === 'selected'
            ? alpha(theme.palette?.primary?.main, 0.12)
            : theme.palette.common.white,
    ...theme.applyStyles('dark', {
        backgroundColor:
            className === 'selected'
                ? alpha(theme.palette?.primary?.main, 0.12)
                : theme.palette.common.black,
    }),
    color: className === 'selected' ? theme.palette?.primary?.main : 'inherit',
    ...theme.applyStyles('dark', {
        color:
            className === 'selected' ? theme.palette?.primary?.main : 'inherit',
    }),
    ['&:hover']: {
        backgroundColor:
            className === 'selected'
                ? alpha(theme.palette?.primary?.main, 0.2)
                : theme.palette.grey[100],
        ...theme.applyStyles('dark', {
            backgroundColor:
                className === 'selected'
                    ? alpha(theme.palette?.primary?.main, 0.2)
                    : theme.palette.grey[800],
        }),
    },
}));
