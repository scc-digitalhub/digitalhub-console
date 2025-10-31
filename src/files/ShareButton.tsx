// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Fragment, ReactElement, useCallback, useState } from 'react';
import {
    Button,
    ButtonProps,
    LoadingIndicator,
    RaRecord,
    Identifier,
    useRecordContext,
    useTranslate,
    useDataProvider,
    Toolbar,
    Create,
    SaveButton,
    Form,
    Labeled,
    RecordContextProvider,
    SimpleShowLayout,
    NumberInput,
    DateField,
    IconButtonWithTooltip,
} from 'react-admin';
import {
    Breakpoint,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    styled,
    Grid,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShareIcon from '@mui/icons-material/Share';
import { useRootSelector } from '@dslab/ra-root-selector';
import { IdField } from '../components/IdField';

const defaultIcon = <ShareIcon fontSize="small" />;

export const ShareButton = (props: ShareButtonProps) => {
    const {
        label = 'actions.share',
        icon = defaultIcon,
        fullWidth = true,
        maxWidth = 'md',
        color = 'info',
        size = 'medium',
        iconButton = false,
        record: recordFromProps,
        path: pathProp,
        ...rest
    } = props;
    const translate = useTranslate();
    const [open, setOpen] = useState(false);
    const recordContext = useRecordContext();
    const record = recordFromProps || recordContext;
    const isLoading = !record;

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
            {iconButton ? (
                <IconButtonWithTooltip
                    label={label}
                    color={color}
                    size={size}
                    onClick={handleDialogOpen}
                    {...rest}
                >
                    {icon}
                </IconButtonWithTooltip>
            ) : (
                <Button
                    label={label}
                    onClick={handleDialogOpen}
                    color={color}
                    {...rest}
                >
                    {icon}
                </Button>
            )}
            <ShareDialog
                open={open}
                onClose={handleDialogClose}
                onClick={handleClick}
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                aria-labelledby="share-dialog-title"
                className={ShareDialogButtonClasses.dialog}
            >
                <div className={ShareDialogButtonClasses.header}>
                    <DialogTitle
                        id="share-dialog-title"
                        className={ShareDialogButtonClasses.title}
                    >
                        {translate(
                            label && typeof label === 'string'
                                ? label
                                : 'actions.share'
                        )}{' '}
                        {record && record.name}
                    </DialogTitle>
                    <IconButton
                        className={ShareDialogButtonClasses.closeButton}
                        aria-label={translate('ra.action.close')}
                        title={translate('ra.action.close')}
                        onClick={handleDialogClose}
                        size="small"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>

                <DialogContent className={ShareDialogButtonClasses.content}>
                    <Typography variant="body2" mb={1}>
                        {translate('pages.share.files')}
                    </Typography>
                    {isLoading ? (
                        <LoadingIndicator />
                    ) : (
                        <ShareCreateForm record={record} path={pathProp} />
                    )}
                </DialogContent>
            </ShareDialog>
        </Fragment>
    );
};

const ShareCreateForm = (props: { path?: string; record?: any }) => {
    const { path: pathProp, record: recordFromProps } = props;
    const { root: projectId } = useRootSelector();
    const dataProvider = useDataProvider();
    const recordContext = useRecordContext();
    const record = recordFromProps || recordContext;
    const path = pathProp || record?.path;

    const [info, setInfo] = useState<any | null>(null);

    const onSubmit = data => {
        if (data) {
            dataProvider
                .invoke({
                    path: '/-/' + projectId + '/files/download',
                    params: { path, duration: data.duration },
                    options: { method: 'POST' },
                })
                .then(data => {
                    setInfo(data);
                });
        }
    };

    return (
        <Create record={{ duration: 24 }} component={Toolbar}>
            <Form onSubmit={onSubmit}>
                <Grid container>
                    <Grid size={10}>
                        <NumberInput
                            source="duration"
                            label="fields.duration.title"
                            helperText="fields.duration.description"
                            fullWidth
                        />
                    </Grid>
                    <Grid size={2} pt={1}>
                        <SaveButton
                            alwaysEnable
                            label="actions.share"
                            variant="text"
                            icon={defaultIcon}
                        />
                    </Grid>
                </Grid>
                {info && (
                    <RecordContextProvider value={info}>
                        <SimpleShowLayout sx={{ mb: 1 }}>
                            <Grid container>
                                <Grid size={12}>
                                    <Labeled>
                                        <DateField
                                            showDate
                                            showTime
                                            source="expiration"
                                        />
                                    </Labeled>
                                </Grid>
                                <Grid size={12}>
                                    <Labeled sx={{ maxWidth: '480px' }}>
                                        <IdField
                                            source="url"
                                            noWrap
                                            label="fields.url"
                                        />
                                    </Labeled>
                                </Grid>
                            </Grid>
                        </SimpleShowLayout>
                    </RecordContextProvider>
                )}
            </Form>
        </Create>
    );
};

const PREFIX = 'ShareDialogButton';

export const ShareDialogButtonClasses = {
    button: `${PREFIX}-button`,
    dialog: `${PREFIX}-dialog`,
    header: `${PREFIX}-header`,
    title: `${PREFIX}-title`,
    content: `${PREFIX}-content`,
    closeButton: `${PREFIX}-close-button`,
};

const ShareDialog = styled(Dialog, {
    name: PREFIX,
    overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${ShareDialogButtonClasses.title}`]: {
        padding: theme.spacing(0),
    },
    [`& .${ShareDialogButtonClasses.header}`]: {
        padding: theme.spacing(2, 2, 0, 2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    [`& .${ShareDialogButtonClasses.closeButton}`]: {
        height: 'fit-content',
    },
    [`& .${ShareDialogButtonClasses.content}`]: {
        [`& .MuiFormHelperText-root`]: {
            display: 'none',
        },
        [`& .MuiTableHead-root`]: {
            display: 'none',
        },
    },
}));

export type ShareButtonProps<RecordType extends RaRecord = any> =
    ButtonProps & {
        /**
         * (Optional) ref id, by default uses record.id
         */
        id?: Identifier;
        /**
         * (Optional) Custom icon for the button
         */
        icon?: ReactElement;
        /**
         * (Optional) record object to use in place of the context
         */
        record?: RecordType;
        path?: string;
        /**
         * Display the modal window as full-width, filling the viewport. Defaults to `false`
         */
        fullWidth?: boolean;
        /**
         * Max width for the modal window (breakpoint). Defaults to `md`
         */
        maxWidth?: Breakpoint;
        /**
         * Display the button as an icon button
         */
        iconButton?: boolean;
    };
