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
    useResourceContext,
    useTranslate,
} from 'react-admin';
import {
    Breakpoint,
    DialogContent,
    DialogTitle,
    IconButton,
} from '@mui/material';
import SegmentIcon from '@mui/icons-material/Segment';
import CloseIcon from '@mui/icons-material/Close';
import { LogsView } from './LogsView';
import {
    StyledDialog,
    StyledDialogClasses,
} from '../../../common/theme/StyledDialog';

const defaultIcon = <SegmentIcon />;

export const LogsButton = (props: LogsButtonProps) => {
    const {
        id: idFromProps,
        label = 'fields.logs',
        icon = defaultIcon,
        fullWidth = true,
        maxWidth = 'md',
        color = 'info',
        record: recordFromProps,
        resource: resourceFromProps,
        ...rest
    } = props;
    const translate = useTranslate();
    const [open, setOpen] = useState(false);

    const resourceContext = useResourceContext();
    const recordContext = useRecordContext();

    const resource = resourceFromProps || resourceContext;
    const record = recordFromProps || recordContext;

    const id = idFromProps || record?.id;

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
            <Button
                label={label}
                onClick={handleDialogOpen}
                color={color}
                {...rest}
            >
                {icon}
            </Button>
            <StyledDialog
                open={open}
                onClose={handleDialogClose}
                onClick={handleClick}
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                aria-labelledby="logs-dialog-title"
                className={StyledDialogClasses.dialog}
            >
                <div className={StyledDialogClasses.header}>
                    <DialogTitle
                        id="logs-dialog-title"
                        className={StyledDialogClasses.title}
                    >
                        {typeof label === 'string' ? translate(label) : label}
                    </DialogTitle>
                    <IconButton
                        className={StyledDialogClasses.closeButton}
                        aria-label={translate('ra.action.close')}
                        title={translate('ra.action.close')}
                        onClick={handleDialogClose}
                        size="small"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>

                <DialogContent>
                    {isLoading ? (
                        <LoadingIndicator />
                    ) : (
                        <LogsView id={id} resource={resource} />
                    )}
                </DialogContent>
            </StyledDialog>
        </Fragment>
    );
};

export type LogsButtonProps<RecordType extends RaRecord = any> = ButtonProps & {
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
    /**
     * (Optional) resource identifier to use in place of the context
     */
    resource?: string;
    /**
     * Display the modal window as full-width, filling the viewport. Defaults to `false`
     */
    fullWidth?: boolean;
    /**
     * Max width for the modal window (breakpoint). Defaults to `md`
     */
    maxWidth?: Breakpoint;
};
