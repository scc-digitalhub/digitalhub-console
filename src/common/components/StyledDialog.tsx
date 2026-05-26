// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Dialog } from "@mui/material";
import { styled } from "@mui/material/styles";

const PREFIX = 'StyledDialog';

export const StyledDialogClasses = {
    content: `${PREFIX}-content`,
    closeButton: `${PREFIX}-close-button`,
    dialog: `${PREFIX}-dialog`,
    header: `${PREFIX}-header`,
    title: `${PREFIX}-title`,
};

export const StyledDialog = styled(Dialog, {
    name: PREFIX,
    overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${StyledDialogClasses.title}`]: {
        padding: theme.spacing(0),
    },
    [`& .${StyledDialogClasses.header}`]: {
        padding: theme.spacing(2, 2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    [`& .${StyledDialogClasses.closeButton}`]: {
        height: 'fit-content',
    },
}));

export const ShareDialog = styled(StyledDialog, {
    name: 'ShareDialog',
    overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${StyledDialogClasses.header}`]: {
        padding: theme.spacing(2, 2, 0, 2),
    },
    [`& .${StyledDialogClasses.content}`]: {
        [`& .MuiFormHelperText-root`]: {
            display: 'none',
        },
        [`& .MuiTableHead-root`]: {
            display: 'none',
        },
    },
}));
