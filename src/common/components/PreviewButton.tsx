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
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    styled,
    Switch,
} from '@mui/material';
import { DialogContext, useDialogContext } from '@dslab/ra-dialog-crud';

import PreviewIcon from '@mui/icons-material/Preview';
import CloseIcon from '@mui/icons-material/Close';

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
    } = props;

    const [open, setOpen] = useState(false);
    const [fullScreen, setFullScreen] = useState(fullScreenProp || false);

    const closeDialog = () => {
        setOpen(false);
    };

    const handleDialogOpen: MouseEventHandler<HTMLButtonElement> = e => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose: any = (e, reason) => {
        if (!reason || (closeOnClickOutside && reason == 'backdropClick')) {
            closeDialog();
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
                className={PreviewButtonClasses.button}
                variant={variant}
                color={color}
                sx={{ maxWidth: 'fit-content' }}
            >
                {icon}
            </Button>

            <PreviewDialog
                maxWidth={maxWidth}
                fullWidth={fullWidth}
                fullScreen={fullScreen}
                onClose={handleDialogClose}
                aria-labelledby="preview-dialog-title"
                open={open}
                className={PreviewButtonClasses.dialog}
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
            </PreviewDialog>
        </>
    );
};

const PreviewContent = (props: {
    title: string | false | ReactElement;
    children: ReactNode;
    fullScreen: boolean;
    setFullScreen: (fullScreen: boolean) => void;
}) => {
    const { title, children, fullScreen, setFullScreen } = props;
    const { handleClose } = useDialogContext();
    const translate = useTranslate();
    const defaultTitle = translate('fields.preview');
    return (
        <>
            <div className={PreviewButtonClasses.header}>
                <DialogTitle
                    id="preview-dialog-title"
                    className={PreviewButtonClasses.title}
                >
                    {!title
                        ? defaultTitle
                        : typeof title === 'string'
                        ? translate(title, { _: title })
                        : title}
                </DialogTitle>
                <Labeled label="actions.fullscreen">
                    <Switch
                        checked={fullScreen === true}
                        onChange={() => {
                            setFullScreen(!fullScreen);
                        }}
                    />
                </Labeled>
                <IconButton
                    className={PreviewButtonClasses.closeButton}
                    aria-label={translate('ra.action.close')}
                    title={translate('ra.action.close')}
                    onClick={handleClose}
                    size="small"
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </div>

            <DialogContent sx={{ p: 0 }}>{children}</DialogContent>
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
    };

const PREFIX = 'RaPreviewButton';

export const PreviewButtonClasses = {
    button: `${PREFIX}-button`,
    dialog: `${PREFIX}-dialog`,
    header: `${PREFIX}-header`,
    title: `${PREFIX}-title`,
    closeButton: `${PREFIX}-close-button`,
};

const PreviewDialog = styled(Dialog, {
    name: PREFIX,
    overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${PreviewButtonClasses.title}`]: {
        padding: theme.spacing(0),
    },
    [`& .${PreviewButtonClasses.header}`]: {
        padding: theme.spacing(2, 2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    [`& .${PreviewButtonClasses.closeButton}`]: {
        height: 'fit-content',
    },
}));
