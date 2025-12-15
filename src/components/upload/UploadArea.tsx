// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Badge,
    Box,
    CardHeader,
    Menu,
    MenuItem,
    Typography,
} from '@mui/material';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { ErrorBoundary } from 'react-error-boundary';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {
    Confirm,
    Error,
    IconButtonWithTooltip,
    useCreatePath,
    useTranslate,
} from 'react-admin';
import { UploadProgress } from './UploadProgress';
import { useUploadStatusContext } from '../../upload_rename_as_files/upload/UploadStatusContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from '../../upload_rename_as_files/upload/types';

export const UploadArea = () => {
    const translate = useTranslate();
    const createPath = useCreatePath();
    const navigate = useNavigate();
    const { uploads, removeUploads } = useUploadStatusContext();
    const [openConfirm, setOpenConfirm] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpen = (event): void => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
    };
    const handleClose = (event?): void => {
        setAnchorEl(null);
        if (event) {
            event.stopPropagation();
        }
    };

    const isOpen = Boolean(anchorEl);

    const handleShow = (upload: Upload) => {
        if (upload.resource && upload.resourceId) {
            const path = createPath({
                resource: upload.resource,
                id: upload.resourceId,
                type: 'show',
            });

            //navigate
            navigate(path);

            //close
            handleClose();
        }
    };

    const uploadCount = uploads.length;
    const uploadingCount = uploads.filter(
        u => u.progress.percentage && u.progress.percentage < 100
    ).length;
    const errorCount = uploads.filter(u => u.error).length;

    const deleteAll = () => {
        if (uploadingCount !== 0) {
            //open confirmation dialog
            setOpenConfirm(true);
        } else {
            //remove all upload notifications
            removeUploads();
        }
    };

    const handleConfirm = () => {
        //cancel all uploads and remove notifications
        uploads.forEach(u => u.remove());
        removeUploads();
        setOpenConfirm(false);
    };

    const handleDialogClose = () => {
        setOpenConfirm(false);
    };

    const icon = (
        <Badge badgeContent={uploadCount} color="error">
            <FileUploadIcon />
        </Badge>
    );

    return (
        <Box className="DropDownMenu" component="span">
            <Box>
                <IconButtonWithTooltip
                    label={'messages.upload.header'}
                    onClick={handleOpen}
                    color="inherit"
                >
                    {icon}
                </IconButtonWithTooltip>
            </Box>
            <Menu
                id="dropdown-menu"
                anchorEl={anchorEl}
                keepMounted
                open={isOpen}
                onClose={handleClose}
                sx={theme => ({
                    '& .MuiMenu-list': {
                        backgroundColor: 'white',
                        p: 0,
                        ...theme.applyStyles('dark', {
                            backgroundColor: 'black',
                        }),
                    },
                    '& .MuiMenuItem-root': {
                        p: 0,
                        borderBottom: '1px solid #ddd',
                    },
                })}
            >
                {uploads?.length > 0 ? (
                    <MenuItem sx={{ borderBottom: '2px' }}>
                        <CardHeader
                            sx={{ width: '100%', py: '5px' }}
                            action={
                                <IconButtonWithTooltip
                                    onClick={deleteAll}
                                    label="ra.action.clear_array_input"
                                >
                                    <ClearAllIcon fontSize="small" />
                                </IconButtonWithTooltip>
                            }
                            title={translate('messages.upload.header')}
                            slotProps={{
                                title: {
                                    variant: 'subtitle1',
                                },
                            }}
                            subheader={
                                <>
                                    <Typography variant="subtitle2">
                                        {translate(
                                            'messages.upload.subheader.total',
                                            { val: uploadCount }
                                        )}
                                    </Typography>
                                    {uploadingCount > 0 && (
                                        <Typography variant="subtitle2">
                                            {translate(
                                                'messages.upload.subheader.uploading',
                                                {
                                                    val: uploadingCount,
                                                }
                                            )}
                                        </Typography>
                                    )}
                                    {errorCount > 0 && (
                                        <Typography variant="subtitle2">
                                            {translate(
                                                'messages.upload.subheader.error',
                                                {
                                                    val: errorCount,
                                                }
                                            )}
                                        </Typography>
                                    )}
                                </>
                            }
                        />
                        <Confirm
                            isOpen={openConfirm}
                            title={translate(
                                'messages.upload.cancelUpload.title',
                                { smart_count: 2 }
                            )}
                            content={translate(
                                'messages.upload.cancelUpload.content',
                                { smart_count: 2 }
                            )}
                            onConfirm={handleConfirm}
                            onClose={handleDialogClose}
                        />
                    </MenuItem>
                ) : (
                    <MenuItem>
                        <CardHeader
                            sx={{ width: '100%', py: '5px' }}
                            title={translate('messages.upload.header')}
                            subheader={translate(
                                'messages.upload.subheader_no_results'
                            )}
                            slotProps={{
                                title: {
                                    variant: 'subtitle1',
                                },
                                subheader: {
                                    variant: 'subtitle2',
                                },
                            }}
                        />
                    </MenuItem>
                )}

                {uploads?.length > 0 &&
                    uploads.map((upl, index) => (
                        <MenuItem key={'upl-' + index}>
                            <ErrorBoundary FallbackComponent={Error}>
                                <UploadProgress
                                    upload={upl}
                                    removeUploads={removeUploads}
                                    onShow={handleShow}
                                />
                            </ErrorBoundary>
                        </MenuItem>
                    ))}
            </Menu>
        </Box>
    );
};
