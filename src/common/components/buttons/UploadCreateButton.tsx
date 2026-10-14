// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { MouseEventHandler, ReactNode, useState } from 'react';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import { Button } from 'react-admin';
import {
    StyledDialog,
    StyledDialogClasses,
} from '../../../common/theme/StyledDialog';

export const UploadCreateButton = (props: {
    children: (dialogProps: DialogProps) => ReactNode;
}) => {
    const [open, setOpen] = useState(false);
    const closeDialog = () => setOpen(false);
    const handleDialogOpen: MouseEventHandler<HTMLButtonElement> = event => {
        setOpen(true);
        event.stopPropagation();
    };
    const handleDialogClose: any = (event, reason) => {
        if (!reason || reason !== 'backdropClick') closeDialog();
        event.stopPropagation();
    };

    return (
        <>
            <Button label="actions.upload" onClick={handleDialogOpen}>
                <NoteAddOutlinedIcon />
            </Button>
            <StyledDialog
                maxWidth="lg"
                fullWidth
                onClose={handleDialogClose}
                aria-labelledby="create-dialog-title"
                open={open}
                className={StyledDialogClasses.dialog}
            >
                {props.children({
                    closeDialog,
                    handleClose: handleDialogClose,
                })}
            </StyledDialog>
        </>
    );
};

export type DialogProps = {
    closeDialog: () => void;
    handleClose: (event: any, reason?: string) => void;
};
