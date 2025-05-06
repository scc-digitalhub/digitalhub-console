import { Menu, Badge, MenuItem, Box, CardHeader } from '@mui/material';
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
import ClearAllIcon from '@mui/icons-material/ClearAll';

export const NotificationArea = () => {
    const {
        messages,
        markAllAsRead,
        remove: removeMessage,
        removeAll: removeAllMessages,
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

    const unreadCount = data
        ? data.reduce((count, el) => (el.isRead ? count : count + 1), 0)
        : 0;

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
                    <MenuItem sx={{ borderBottom: '2px' }}>
                        <CardHeader
                            sx={{ width: '100%', py: '5px' }}
                            action={
                                <IconButtonWithTooltip
                                    onClick={() => removeAllMessages(data)}
                                    label="ra.action.clear_array_input"
                                >
                                    <ClearAllIcon fontSize="small" />
                                </IconButtonWithTooltip>
                            }
                            title={translate('messages.notifications.header')}
                            titleTypographyProps={{ variant: 'subtitle1' }}
                            subheader={translate(
                                'messages.notifications.subheader',
                                { unread: unreadCount }
                            )}
                            subheaderTypographyProps={{ variant: 'subtitle2' }}
                        />
                    </MenuItem>
                ) : (
                    <MenuItem>
                        <CardHeader
                            sx={{ width: '100%', py: '5px' }}
                            title={translate('messages.notifications.header')}
                            titleTypographyProps={{ variant: 'subtitle1' }}
                            subheader={translate('ra.navigation.no_results')}
                            subheaderTypographyProps={{ variant: 'subtitle2' }}
                        />
                    </MenuItem>
                )}

                {data?.length > 0 &&
                    data.map((message, index) => (
                        <MenuItem key={'m-' + index}>
                            <ErrorBoundary FallbackComponent={Error}>
                                <Notification
                                    message={message}
                                    open={isOpen}
                                    onRemove={removeMessage}
                                    onShow={handleShow}
                                    markAsRead={markMessageAsRead}
                                    timeout={5000}
                                />
                            </ErrorBoundary>
                        </MenuItem>
                    ))}
            </Menu>
        </Box>
    );
};
