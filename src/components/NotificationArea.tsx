import { Menu, Typography, Badge, MenuItem, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useState, useEffect } from 'react';
import {
    useTranslate,
    IconButtonWithTooltip,
    Error,
    useCreatePath,
} from 'react-admin';
import { Notification } from './Notification';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { useStompContext } from '../contexts/StompContext';

export const NotificationArea = (props: NotificationAreaProps) => {
    const {
        messages,
        markAllAsRead,
        remove: removeMessage,
    } = useStompContext();
    const translate = useTranslate();
    const createPath = useCreatePath();
    const navigate = useNavigate();
    const [read, setRead] = useState<any[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    useEffect(() => {
        setData(messages);
    }, [JSON.stringify(messages)]);

    useEffect(() => {
        if (read && read.length > 0) {
            //callback and clear
            //TODO debounce rate 1s
            markAllAsRead(read);
            setRead([]);
        }
    }, [JSON.stringify(read)]);

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

    const handleShow = message => {
        if (message?.resource && message.record) {
            const path = createPath({
                resource: message.resource,
                id: message.record.id,
                type: 'show',
            });

            //navigate
            navigate(path);

            //close
            handleClose();
        }
    };

    //debounce read callbacks for concurrency
    const markMessageAsRead = message => {
        setRead(prev => [...prev, message]);
    };

    const icon = (
        <Badge
            badgeContent={data?.filter(m => m.isRead === false).length}
            color="error"
        >
            <NotificationsIcon />
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
                {data?.length > 0 ? (
                    data.map((message, index) => (
                        <MenuItem key={'m-' + index}>
                            <ErrorBoundary FallbackComponent={Error}>
                                <Notification
                                    message={message}
                                    open={isOpen}
                                    onRemove={removeMessage}
                                    onShow={handleShow}
                                    markAsRead={markMessageAsRead}
                                />
                            </ErrorBoundary>
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem>
                        <Box p={1}>
                            <Typography sx={{ paddingX: 2 }}>
                                {translate('ra.navigation.no_results')}
                            </Typography>
                        </Box>
                    </MenuItem>
                )}
            </Menu>
        </Box>
    );
};

export type NotificationAreaProps = {};
