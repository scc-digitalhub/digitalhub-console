// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ReactElement } from 'react';

const StyledButtonGroup = styled(Stack, {
    name: 'RaRowButtonGroup',
    overridesResolver: (props, styles) => styles.root,
})({
    '&.MuiStack-root': {
        justifyContent: 'end',
    },
});

export const RowButtonGroup = (props: {
    children: ReactElement | ReactElement[];
}) => {
    const { children } = props;
    return (
        <StyledButtonGroup direction="row" spacing={1}>
            {children}
        </StyledButtonGroup>
    );
};
