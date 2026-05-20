// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

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
import { useStompContext, useStompClientContext } from '../StompContext';
import ClearAllIcon from '@mui/icons-material/ClearAll';

export const NotificationArea = () => {
    const client = useStompClientContext();
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
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        if (read.length > 0) {
            //callback and clear
            markAllAsRead(read);
            setRead([]);
        }
    }, [read]);

    if (!client) {
        return null;
    }

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

    const unreadCount = messages
        ? messages.reduce((count, el) => (el.isRead ? count : count + 1), 0)
        : 0;

    const icon = (
        <Badge
            badgeContent={messages?.filter(m => m.isRead === false).length}
            color="error"
        >
            <NotificationsIcon />
        </Badge>
    );

    return (
        <Box className="DropDownMenu" component="span">
            <Box>
                <IconButtonWithTooltip
                    label={'messages.notifications.header'}
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
                {messages?.length > 0 ? (
                    <MenuItem sx={{ borderBottom: '2px' }}>
                        <CardHeader
                            sx={{ width: '100%', py: '5px' }}
                            action={
                                <IconButtonWithTooltip
                                    onClick={() => removeAllMessages(messages)}
                                    label="ra.action.clear_array_input"
                                >
                                    <ClearAllIcon fontSize="small" />
                                </IconButtonWithTooltip>
                            }
                            title={translate('messages.notifications.header')}
                            subheader={translate(
                                'messages.notifications.subheader',
                                { unread: unreadCount }
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
                ) : (
                    <MenuItem>
                        <CardHeader
                            sx={{ width: '100%', py: '5px' }}
                            title={translate('messages.notifications.header')}
                            subheader={translate(
                                'messages.notifications.subheader_no_results'
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

                {messages?.length > 0 &&
                    messages.map((message, index) => (
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
