// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { MouseEventHandler, ReactNode, useState } from 'react';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import {
    Button,
    useGetResourceLabel,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import {
    StyledDialog,
    StyledDialogClasses,
} from '../../../common/theme/StyledDialog';
import { DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
                <UploadDialog
                    closeDialog={closeDialog}
                    handleClose={handleDialogClose}
                >
                    {props.children}
                </UploadDialog>
            </StyledDialog>
        </>
    );
};

const UploadDialog = (props: {
    closeDialog: () => void;
    handleClose: (event: any, reason?: string) => void;
    children: (dialogProps: DialogProps) => ReactNode;
}) => {
    const { closeDialog, handleClose } = props;
    const resource = useResourceContext();
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();

    return (
        <>
            <div className={StyledDialogClasses.header}>
                <DialogTitle
                    id="create-dialog-title"
                    className={StyledDialogClasses.title}
                >
                    {translate('ra.page.create', {
                        name: getResourceLabel(resource || '', 1),
                    })}
                </DialogTitle>
                <IconButton
                    className={StyledDialogClasses.closeButton}
                    aria-label={translate('ra.action.close')}
                    title={translate('ra.action.close')}
                    onClick={handleClose}
                    size="small"
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </div>
            <DialogContent
                sx={{ p: 0 }}
                className={StyledDialogClasses.content}
            >
                {props.children({
                    closeDialog,
                })}
            </DialogContent>
        </>
    );
};

export type DialogProps = {
    closeDialog?: () => void;
};
