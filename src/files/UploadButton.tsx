// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Button,
    ButtonProps,
    useTranslate,
    LoadingIndicator,
    Labeled,
    useTheme,
} from 'react-admin';
import CloseIcon from '@mui/icons-material/Close';
import { Fragment, ReactElement, useCallback, useState } from 'react';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-markdown';
import {
    Breakpoint,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    styled,
} from '@mui/material';
import { CreateInDialogButtonClasses } from '@dslab/ra-dialog-crud';
import UploadIcon from '@mui/icons-material/Upload';
import { useUploadController } from './uploadController';
import { Uploader } from '../components/FileInput';
import { Dashboard } from '@uppy/react';

const defaultIcon = <UploadIcon />;

export const UploadButton = (props: UploadButtonProps) => {
    const {
        color = 'info',
        label = 'actions.upload',
        icon = defaultIcon,
        fullWidth = true,
        maxWidth = 'md',
        path,
        onUpload,
        ...rest
    } = props;
    const translate = useTranslate();
    const [theme] = useTheme();

    const uploader = useUploadController({ path });
    const [open, setOpen] = useState(false);

    const handleDialogOpen = e => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose = e => {
        e.stopPropagation();
        setOpen(false);
    };

    const handleClick = useCallback(e => {
        e.stopPropagation();
    }, []);

    return (
        <Fragment>
            <Button
                label={label}
                color={color}
                onClick={handleDialogOpen}
                {...rest}
            >
                {icon}
            </Button>
            <UploadDialog
                open={open}
                onClose={handleDialogClose}
                onClick={handleClick}
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                className={CreateInDialogButtonClasses.dialog}
            >
                <div className={CreateInDialogButtonClasses.header}>
                    <DialogTitle className={CreateInDialogButtonClasses.title}>
                        {translate('actions.upload')} {path}
                    </DialogTitle>
                    <IconButton
                        className={CreateInDialogButtonClasses.closeButton}
                        aria-label={translate('ra.action.close')}
                        title={translate('ra.action.close')}
                        onClick={handleDialogClose}
                        size="small"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>

                <DialogContent>
                    {uploader ? (
                        <Uploader direction={'column'}>
                            <Labeled label="fields.files.title">
                                <Dashboard
                                    uppy={uploader.uppy}
                                    theme={theme === 'dark' ? 'dark' : 'light'}
                                    // hideUploadButton
                                    showProgressDetails
                                    // hideProgressAfterFinish
                                    doneButtonHandler={() => {
                                        uploader.uppy.cancelAll();
                                        setOpen(false);
                                        if (onUpload) {
                                            onUpload(uploader.files);
                                        }
                                    }}
                                    fileManagerSelectionType={'both'}
                                    disableThumbnailGenerator
                                    proudlyDisplayPoweredByUppy={false}
                                    width={'100%'}
                                    height={'240px'}
                                />
                            </Labeled>
                        </Uploader>
                    ) : (
                        <LoadingIndicator />
                    )}
                </DialogContent>
            </UploadDialog>
        </Fragment>
    );
};

const UploadDialog = styled(Dialog, {
    name: 'RaCreateInDialogButton',
    overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${CreateInDialogButtonClasses.title}`]: {
        padding: theme.spacing(0),
    },
    [`& .${CreateInDialogButtonClasses.header}`]: {
        padding: theme.spacing(2, 2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    [`& .${CreateInDialogButtonClasses.closeButton}`]: {
        height: 'fit-content',
    },
}));

export type UploadButtonProps = ButtonProps & {
    icon?: ReactElement;
    path: string;
    onUpload?: (files: any[]) => void;
    fullWidth?: boolean;
    maxWidth?: Breakpoint;
};
