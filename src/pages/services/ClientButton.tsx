// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import {
    useRecordContext,
    Button,
    FieldProps,
    ButtonProps,
    RaRecord,
    LoadingIndicator,
    useTranslate,
} from 'react-admin';
import SignpostIcon from '@mui/icons-material/Signpost';
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
    Typography,
} from '@mui/material';
import { CreateInDialogButtonClasses } from '@dslab/ra-dialog-crud';
import { HttpClient } from './client';

const defaultIcon = <SignpostIcon />;

export const ClientButton = (props: ClientButtonProps) => {
    const {
        color = 'secondary',
        label = 'pages.http-client.title',
        icon = defaultIcon,
        fullWidth = true,
        maxWidth = 'lg',
        ...rest
    } = props;

    const translate = useTranslate();
    const [open, setOpen] = useState(false);

    const record = useRecordContext(props);
    const { root: projectId } = useRootSelector();
    const urls: string[] = [];
    if (record?.status?.service?.url) {
        urls.push(record.status.service.url);
    }
    if (record?.status?.service?.urls) {
        urls.push(...record.status.service.urls);
    }

    const isLoading = !record;
    const isDisabled =
        rest.disabled ||
        record?.status?.state !== 'RUNNING' ||
        urls.length === 0;

    const handleDialogOpen = e => {
        if (isDisabled) return;

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

    if (!record || !urls) {
        return <></>;
    }

    return (
        <Fragment>
            <Button
                label={label}
                color={color}
                onClick={handleDialogOpen}
                disabled={isDisabled}
            >
                {icon}
            </Button>
            <ClientDialog
                open={open}
                onClose={handleDialogClose}
                onClick={handleClick}
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                aria-labelledby="client-dialog-title"
                className={CreateInDialogButtonClasses.dialog}
            >
                <div className={CreateInDialogButtonClasses.header}>
                    <DialogTitle
                        id="client-dialog-title"
                        className={CreateInDialogButtonClasses.title}
                    >
                        {label && typeof label === 'string'
                            ? translate(label)
                            : ''}{' '}
                        #{record?.name}
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
                    <Typography variant="body2" mb={1}>
                        {translate('pages.http-client.helperText')}
                    </Typography>

                    {isLoading ? (
                        <LoadingIndicator />
                    ) : (
                        <HttpClient
                            urls={urls}
                            proxy={
                                '/-/' +
                                projectId +
                                '/runs/' +
                                record.id +
                                '/proxy'
                            }
                        />
                    )}
                </DialogContent>
            </ClientDialog>
        </Fragment>
    );
};

const ClientDialog = styled(Dialog, {
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

export type ClientButtonProps<RecordType extends RaRecord = any> = Omit<
    FieldProps<RecordType>,
    'source'
> &
    ButtonProps & {
        icon?: ReactElement;
        fullWidth?: boolean;
        maxWidth?: Breakpoint;
    };
