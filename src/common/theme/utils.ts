// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

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
