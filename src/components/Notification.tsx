import {
    Typography,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    styled,
    alpha,
} from '@mui/material';
import { Box } from '@mui/system';
import ClearIcon from '@mui/icons-material/Clear';
import { useState, useEffect, useRef } from 'react';
import {
    ShowButton,
    IconButtonWithTooltip,
    DateField,
    localStorageStore,
    useTranslate,
    Translate,
} from 'react-admin';
import { RunIcon } from '../resources/runs/icon';
import { useRootSelector } from '@dslab/ra-root-selector';

function parseMessage(
    message: any,
    translate: Translate
): {
    icon?: any;
    title?: string;
    content?: any;
    resource?: string;
    showButton?: boolean;
} {
    if (message.notificationType == 'run') {
        return {
            icon: <RunIcon fontSize="small" />,
            title:
                translate('resources.runs.name', { smart_count: 1 }) +
                ' #' +
                message.spec.function.split('/')[3].split(':')[0],
            content: translate('messages.notifications.runMessage', {
                state: message.status.state,
            }),
            resource: 'runs',
            showButton: message.status.state != 'DELETED',
        };
    }
    //TODO add other types of notifications
    return {};
}

export const Notification = (props: NotificationProps) => {
    const { message, open, setMessages, timeout = 10000 } = props;
    const translate = useTranslate();
    const { icon, title, content, resource, showButton } = parseMessage(
        message,
        translate
    );
    const ref = useRef(null);
    const { root } = useRootSelector();
    const store = localStorageStore('dh');

    useEffect(() => {
        if (open && !message.isRead) {
            /**
             * Set an observer to check if the notification is visible (at least 90%).
             * Threshold=0.9 means the entry is intersecting when intersectionRatio>=0.9.
             * When intersecting, set a timer to delete the notification after given time.
             * If the notification stops intersecting (i.e. intersectionRatio<0.9), clear timer.
             */
            let currentElement, timer;
            const observerOptions = { threshold: [0.9] };

            const observer = new IntersectionObserver(([entry]) => {
                if (timer && !entry.isIntersecting) {
                    console.log('clearing timer for', entry.target);
                    timer = clearTimeout(timer);
                } else if (entry.isIntersecting && !timer) {
                    console.log('creating timer for', entry.target);
                    timer = setTimeout(() => {
                        console.log('timeout for', entry.target);
                        //mark as read
                        setMessages(prev => {
                            const readMsg = { ...message, isRead: true };
                            const index = prev.findIndex(
                                m => m.notificationId == message.notificationId
                            );
                            let msgs = [...prev];
                            msgs[index] = readMsg;
                            store.setItem(
                                'dh.notifications.messages.' + root,
                                msgs
                            );
                            return msgs;
                        });
                    }, timeout);
                }
            }, observerOptions);

            if (ref?.current) {
                currentElement = ref.current;
                observer.observe(ref.current);
            }

            return () => {
                console.log('clearing timer and stop observing');
                clearTimeout(timer);
                observer.unobserve(currentElement);
            };
        }
    }, [open]);

    const removeNotification = () => {
        //TODO fix when localstorage persistence is improved
        setMessages(prev => {
            const val = prev.filter(
                value => value.notificationId != message.notificationId
            );
            store.setItem('dh.notifications.messages.' + root, val);
            return val;
        });
    };

    const notificationClass = !message.isRead ? NotificationClasses.unread : '';

    return (
        <NotificationCard
            elevation={0}
            ref={ref}
            square
            className={notificationClass}
        >
            <CardHeader
                avatar={icon}
                title={
                    message.isRead ? (
                        title
                    ) : (
                        <Box component="span" sx={{ fontWeight: 'bold' }}>
                            {title}
                        </Box>
                    )
                }
                subheader={
                    <DateField
                        record={message}
                        source="metadata.updated"
                        showTime
                    />
                }
                action={
                    <IconButtonWithTooltip
                        label={'ra.action.delete'}
                        onClick={removeNotification}
                    >
                        <ClearIcon fontSize="small" />
                    </IconButtonWithTooltip>
                }
            />
            <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {content}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                {showButton && (
                    <ShowButton
                        resource={resource}
                        record={message}
                        variant="text"
                        color="info"
                    />
                )}
            </CardActions>
        </NotificationCard>
    );
};

const NotificationClasses = {
    unread: 'unread',
};

const NotificationCard = styled(Card, {
    name: 'NotificationCard',
    overridesResolver: (_props, styles) => styles.root,
})(({ theme, className }) => ({
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor:
        className == NotificationClasses.unread
            ? alpha(theme.palette?.primary?.main, 0.12)
            : theme.palette.common.white,
    ...theme.applyStyles('dark', {
        backgroundColor:
            className == NotificationClasses.unread
                ? alpha(theme.palette?.primary?.main, 0.12)
                : theme.palette.common.black,
    }),
    color:
        className == NotificationClasses.unread
            ? theme.palette?.primary?.main
            : 'inherit',
    ...theme.applyStyles('dark', {
        color:
            className == NotificationClasses.unread
                ? theme.palette?.primary?.main
                : 'inherit',
    }),
    ['& .MuiCardContent-root, & .MuiCardHeader-root']: {
        paddingBottom: 0,
        paddingTop: 8,
    },
    ['&:hover']: {
        backgroundColor:
            className == NotificationClasses.unread
                ? alpha(theme.palette?.primary?.main, 0.2)
                : theme.palette.grey[100],
        ...theme.applyStyles('dark', {
            backgroundColor:
                className == NotificationClasses.unread
                    ? alpha(theme.palette?.primary?.main, 0.2)
                    : theme.palette.grey[800],
        }),
    },
}));

type NotificationProps = {
    message: any;
    open: boolean;
    setMessages: React.Dispatch<React.SetStateAction<any[]>>;
    timeout?: number;
};
