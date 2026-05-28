// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { styled } from '@mui/material/styles';
import { FlatCard } from '../components/layout/FlatCard';

/**
 * The max-width and min-width CSS properties play a critical role in determining
 * the width of the data grids contained within the schema and preview tabs.
 */
export const StyledFlatCard = styled(FlatCard, {
    name: 'StyledFlatCard',
    overridesResolver: (_props, styles) => styles.root,
})(() => ({
    maxWidth: '70vw',
    minWidth: '100%',
}));
