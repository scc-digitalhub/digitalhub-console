// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { FlatCard } from '../components/layout/FlatCard';

/**
 * Shared sx/prop presets for react-admin filter inputs displayed in list toolbars.
 */
export const FILTER_INPUT_PROPS = {
    alwaysOn: true,
    sx: {
        '& .RaSelectInput-input': { margin: '0px' },
        '& .MuiChip-root': { height: '20px' },
    },
};

/**
 * Shared sx/prop presets for resources show views, without version list aside.
 */
export const SHOW_VIEW_PROPS = {
    component: FlatCard,
    sx: {
        width: '100%',
    },
};

/**
 * Shared sx/prop presets for resources show views, with version list aside.
 */
export const SHOW_VIEW_VERSION_PROPS = {
    ...SHOW_VIEW_PROPS,
    sx: {
        ...SHOW_VIEW_PROPS.sx,
        '& .RaShow-main': {
            display: 'grid',
            gridTemplateColumns: { lg: '1fr 350px' },
            gridTemplateRows: {
                xs: 'repeat(1, 1fr)',
                lg: '',
            },
            gap: 2,
        },
    },
};
