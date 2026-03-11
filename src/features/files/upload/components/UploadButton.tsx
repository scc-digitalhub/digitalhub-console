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
    Stack,
    styled,
} from '@mui/material';
import { CreateInDialogButtonClasses } from '@dslab/ra-dialog-crud';
import UploadIcon from '@mui/icons-material/Upload';
import { Dashboard } from '@uppy/react';
import { useGetUploader } from '../useGetUploader';
import { UploadDashboard } from './UploadDashboard';

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

    const onUploadComplete = useCallback(
        result => {
            if (onUpload) {
                onUpload(result.successful);
            }
            return undefined;
        },
        [onUpload]
    );

    const uploader = useGetUploader({ id: path, path, onUploadComplete });
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

    const handleUpload = e => {
        e.stopPropagation();
        if (uploader.files.length > 0) {
            uploader.upload();
        }
        setOpen(false);
    };

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
                        <Stack sx={{ alignItems: 'center' }}>
                            <UploadDashboard direction={'column'}>
                                <Labeled label="fields.files.title">
                                    <Dashboard
                                        uppy={uploader.uppy}
                                        theme={
                                            theme === 'dark' ? 'dark' : 'light'
                                        }
                                        hideUploadButton
                                        fileManagerSelectionType={'both'}
                                        disableThumbnailGenerator
                                        proudlyDisplayPoweredByUppy={false}
                                        width={'100%'}
                                        height={'240px'}
                                    />
                                </Labeled>
                            </UploadDashboard>
                            {uploader.uppy.getFiles().length > 0 && (
                                <Button
                                    label={translate('actions.upload_x_files', {
                                        files: uploader.uppy.getFiles().length,
                                        smart_count:
                                            uploader.uppy.getFiles().length,
                                    })}
                                    onClick={handleUpload}
                                    color="success"
                                    variant="contained"
                                />
                            )}
                        </Stack>
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
