// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    MouseEventHandler,
    ReactElement,
    ReactNode,
    useState,
    useMemo,
} from 'react';
import {
    Button,
    ButtonProps,
    FieldProps,
    Labeled,
    RaRecord,
    useTranslate,
} from 'react-admin';
import {
    Breakpoint,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Switch,
} from '@mui/material';
import { DialogContext, useDialogContext } from '@dslab/ra-dialog-crud';

import PreviewIcon from '@mui/icons-material/Preview';
import CloseIcon from '@mui/icons-material/Close';
import { StyledDialog, StyledDialogClasses } from '../theme/StyledDialog';

const defaultIcon = <PreviewIcon fontSize="small" />;

export const PreviewButton = (props: PreviewButtonProps) => {
    const {
        children,
        title,
        icon = defaultIcon,
        color = 'info',
        maxWidth = 'md',
        fullWidth = false,
        fullScreen: fullScreenProp,
        label = 'fields.preview',
        variant,
        sx,
        closeOnClickOutside = true,
        onOpen,
        onClose,
    } = props;

    const [open, setOpen] = useState(false);
    const [fullScreen, setFullScreen] = useState(fullScreenProp || false);

    const closeDialog = () => {
        setOpen(false);
    };

    const handleDialogOpen: MouseEventHandler<HTMLButtonElement> = e => {
        setOpen(true);
        if (onOpen) onOpen();
        e.stopPropagation();
    };

    const handleDialogClose: any = (e, reason) => {
        if (!reason || (closeOnClickOutside && reason == 'backdropClick')) {
            closeDialog();
            if (onClose) onClose();
        }
        e.stopPropagation();
    };

    const context = useMemo(
        () => ({
            isOpen: open,
            handleOpen: handleDialogOpen,
            handleClose: handleDialogClose,
            open: () => setOpen(true),
            close: () => setOpen(false),
        }),
        [handleDialogClose, handleDialogOpen]
    );

    return (
        <>
            <Button
                label={label}
                onClick={handleDialogOpen}
                variant={variant}
                color={color}
                sx={{ maxWidth: 'fit-content' }}
            >
                {icon}
            </Button>

            <StyledDialog
                maxWidth={maxWidth}
                fullWidth={fullWidth}
                fullScreen={fullScreen}
                onClose={handleDialogClose}
                aria-labelledby="preview-dialog-title"
                open={open}
                className={StyledDialogClasses.dialog}
                scroll="body"
                sx={sx}
            >
                <DialogContext.Provider value={context}>
                    <PreviewContent
                        title={title || false}
                        fullScreen={fullScreen}
                        setFullScreen={setFullScreen}
                    >
                        {children}
                    </PreviewContent>
                </DialogContext.Provider>
            </StyledDialog>
        </>
    );
};

export const PreviewContent = (props: {
    title: string | false | ReactElement;
    children: ReactNode;
    actions?: ReactNode;
    fullScreen: boolean;
    setFullScreen?: (fullScreen: boolean) => void;
}) => {
    const { title, children, actions, fullScreen, setFullScreen } = props;
    const { handleClose } = useDialogContext();
    const translate = useTranslate();
    const defaultTitle = translate('fields.preview');
    return (
        <>
            <div className={StyledDialogClasses.header}>
                <DialogTitle
                    id="preview-dialog-title"
                    className={StyledDialogClasses.title}
                >
                    {!title
                        ? defaultTitle
                        : typeof title === 'string'
                        ? translate(title, { _: title })
                        : title}
                </DialogTitle>
                {setFullScreen && (
                    <Labeled label="actions.fullscreen">
                        <Switch
                            checked={fullScreen === true}
                            onChange={() => {
                                setFullScreen(!fullScreen);
                            }}
                        />
                    </Labeled>
                )}
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

            <DialogContent sx={{ p: 0 }}>{children}</DialogContent>
            {actions && <DialogActions>{actions}</DialogActions>}
        </>
    );
};

export type PreviewButtonProps<RecordType extends RaRecord = any> = Omit<
    FieldProps<RecordType>,
    'source'
> &
    ButtonProps & {
        children: ReactNode;
        icon?: ReactElement;
        iconButton?: boolean;
        label?: string;
        variant?: 'text' | 'outlined' | 'contained';
        fileName?: string;
        fullWidth?: boolean;
        fullScreen?: boolean;
        maxWidth?: Breakpoint;
        closeOnClickOutside?: boolean;
        onOpen?: () => void;
        onClose?: () => void;
    };
