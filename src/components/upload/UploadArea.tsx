import { Badge, Box, CardHeader, Menu, MenuItem } from '@mui/material';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Confirm, IconButtonWithTooltip, useTranslate } from 'react-admin';
import { UploadProgress } from './UploadProgress';
import { useUploadStatusContext } from '../../contexts/UploadStatusContext';
import { useState } from 'react';

export const UploadArea = () => {
    const translate = useTranslate();
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

    const uploadCount = uploads
        ? uploads.reduce(
              (count, el) =>
                  el.progress.percentage && el.progress.percentage < 100
                      ? count + 1
                      : count,
              0
          )
        : 0;

    const deleteAll = () => {
        if (
            uploads.some(
                u => u.progress.percentage && u.progress.percentage < 100
            )
        ) {
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
        <Badge
            badgeContent={
                uploads?.filter(
                    u => u.progress.percentage && u.progress.percentage < 100
                ).length
            }
            color="error"
        >
            <FileUploadIcon />
        </Badge>
    );

    return (
        <Box className="DropDownMenu" component="span">
            <Box>
                <IconButtonWithTooltip
                    label={'ra.action.open'}
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
                            titleTypographyProps={{ variant: 'subtitle1' }}
                            subheader={translate('messages.upload.subheader', {
                                uploading: uploadCount,
                            })}
                            subheaderTypographyProps={{ variant: 'subtitle2' }}
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
                            titleTypographyProps={{ variant: 'subtitle1' }}
                            subheader={translate('ra.navigation.no_results')}
                            subheaderTypographyProps={{ variant: 'subtitle2' }}
                        />
                    </MenuItem>
                )}

                {uploads?.length > 0 &&
                    uploads.map((upl, index) => (
                        <MenuItem key={'upl-' + index}>
                            {/* <ErrorBoundary FallbackComponent={Error}> */}
                            <UploadProgress
                                upload={upl}
                                removeUploads={removeUploads}
                            />
                            {/* </ErrorBoundary> */}
                        </MenuItem>
                    ))}
            </Menu>
        </Box>
    );
};
