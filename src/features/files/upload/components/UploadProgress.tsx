// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    alpha,
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    LinearProgress,
    styled,
    Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {
    Confirm,
    DateField,
    IconButtonWithTooltip,
    ShowButton,
    useGetOne,
    useGetResourceLabel,
    useResourceDefinition,
    useTranslate,
} from 'react-admin';
import { createElement, useState } from 'react';
import { Upload } from '../types';
import { scaleBytes } from '../../../../common/utils/helper';
import { RetryButton } from '../../../../common/components/buttons/RetryButton';

export const UploadProgress = (props: UploadProgressProps) => {
    const { upload, removeUploads, onShow } = props;
    const translate = useTranslate();
    const [open, setOpen] = useState(false);
    const getResourceLabel = useGetResourceLabel();
    const definition = useResourceDefinition({ resource: upload.resource });
    const { data: record } = useGetOne(upload.resource, {
        id: upload.resourceId,
    });

    if (!definition) {
        return <></>;
    }

    const title = translate('pages.pageTitle.show.title', {
        resource: getResourceLabel(upload.resource, 1),
        name: record?.name || upload.resourceId,
    });

    const icon = definition.icon ? (
        createElement(definition.icon, { fontSize: 'small' })
    ) : (
        <FileUploadIcon fontSize="small" />
    );

    const uploading =
        upload.progress.percentage && upload.progress.percentage < 100
            ? true
            : false;

    const deleteUpload = () => {
        if (uploading) {
            //open confirmation dialog
            setOpen(true);
        } else {
            //remove upload notification
            removeUploads(upload);
        }
    };

    const handleConfirm = () => {
        //cancel upload and remove notification
        upload.remove();
        removeUploads(upload);
        setOpen(false);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const progressClass = upload.error
        ? ProgressClasses.error
        : uploading
        ? ProgressClasses.uploading
        : ProgressClasses.complete;

    return (
        <UploadProgressCard elevation={0} square className={progressClass}>
            <CardHeader
                avatar={icon}
                title={title}
                subheader={
                    <DateField
                        record={upload.progress}
                        source="uploadStarted"
                        showTime
                    />
                }
                action={
                    <IconButtonWithTooltip
                        label={'ra.action.delete'}
                        onClick={deleteUpload}
                    >
                        <ClearIcon fontSize="small" />
                    </IconButtonWithTooltip>
                }
            />
            <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {upload.filename}
                </Typography>
                {!upload.error &&
                    upload.progress.bytesUploaded &&
                    upload.progress.bytesTotal && (
                        <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                        >
                            {scaleBytes(upload.progress.bytesUploaded)} -{' '}
                            {scaleBytes(upload.progress.bytesTotal)}
                        </Typography>
                    )}
                {upload.error && (
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                    >
                        Failed - {upload.error.message}
                    </Typography>
                )}
                {!upload.error && uploading && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                                variant="determinate"
                                value={upload.progress.percentage}
                                color={
                                    uploading
                                        ? 'info'
                                        : upload.error
                                        ? 'error'
                                        : 'success'
                                }
                            />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                            <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary' }}
                            >{`${upload.progress.percentage}%`}</Typography>
                        </Box>
                    </Box>
                )}
            </CardContent>
            <CardActions disableSpacing>
                {onShow && (
                    <ShowButton
                        resource={upload.resource}
                        record={record}
                        variant="text"
                        color="info"
                        onClick={() => onShow(upload)}
                    />
                )}
                {upload.error && upload.retry && (
                    <RetryButton onClick={() => upload.retry?.()} />
                )}
            </CardActions>
            <Confirm
                isOpen={open}
                title={translate('messages.upload.cancelUpload.title', {
                    smart_count: 1,
                })}
                content={translate('messages.upload.cancelUpload.content', {
                    smart_count: 1,
                })}
                onConfirm={handleConfirm}
                onClose={handleDialogClose}
            />
        </UploadProgressCard>
    );
};

const ProgressClasses = {
    complete: 'complete',
    uploading: 'uploading',
    error: 'error',
};

const UploadProgressCard = styled(Card, {
    name: 'UploadProgressCard',
    overridesResolver: (_props, styles) => styles.root,
})(({ theme, className }) => ({
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor:
        className == ProgressClasses.error
            ? alpha(theme.palette?.error?.main, 0.2)
            : className == ProgressClasses.uploading
            ? alpha(theme.palette?.info?.main, 0.2)
            : alpha(theme.palette?.success?.main, 0.2),
    ...theme.applyStyles('dark', {
        backgroundColor:
            className == ProgressClasses.error
                ? alpha(theme.palette?.error?.main, 0.5)
                : className == ProgressClasses.uploading
                ? alpha(theme.palette?.info?.main, 0.5)
                : alpha(theme.palette?.success?.main, 0.5),
    }),
    color: 'inherit',
    ...theme.applyStyles('dark', {
        color: 'inherit',
    }),
    ['& .MuiCardContent-root, & .MuiCardHeader-root']: {
        paddingBottom: 0,
        paddingTop: 8,
    },
    ['& .MuiCardHeader-action']: {
        paddingLeft: 8,
        marginRight: -12,
    },
    ['& .MuiCardActions-root']: {
        paddingLeft: 16,
    },
}));

type UploadProgressProps = {
    upload: Upload;
    removeUploads: (toBeRemoved?: Upload) => void;
    onShow?: (upload) => void;
};
