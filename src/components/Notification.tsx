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
import { useEffect, useMemo, useRef } from 'react';
import {
    ShowButton,
    IconButtonWithTooltip,
    DateField,
    useTranslate,
} from 'react-admin';
import { RunIcon } from '../resources/runs/icon';
import { useRootSelector } from '@dslab/ra-root-selector';

export const Notification = (props: NotificationProps) => {
    const {
        message,
        onShow,
        onRemove,
        markAsRead,
        open,
        timeout = 10000,
    } = props;
    const translate = useTranslate();
    const ref = useRef(null);
    const timer = useRef<any | null>(null);
    const { root } = useRootSelector();

    const parseMessage = (message: any) => {
        if (message.resource == 'runs') {
            const record = message.record;

            return {
                icon: <RunIcon fontSize="small" />,
                title:
                    translate('resources.runs.name', { smart_count: 1 }) +
                    ' #' +
                    record.spec.function.split('/')[3].split(':')[0],
                content: translate('messages.notifications.runMessage', {
                    state: record.status.state,
                }),
                resource: 'runs',
                showButton: record.status.state != 'DELETED',
            };
        }
        //TODO add other types of notifications
        return {};
    };

    const { icon, title, content, resource, showButton } =
        parseMessage(message);

    const observer = useMemo(
        () =>
            new IntersectionObserver(
                ([entry]) => {
                    if (timer.current && !entry.isIntersecting) {
                        clearTimeout(timer.current);
                        timer.current = null;
                    } else if (entry.isIntersecting && !timer.current) {
                        timer.current = setTimeout(() => {
                            if (markAsRead) {
                                //mark as read
                                markAsRead(message);
                            }
                        }, timeout);
                    }
                },
                { threshold: [0.9] }
            ),
        [timeout]
    );

    useEffect(() => {
        if (open && !message.isRead && markAsRead) {
            /**
             * Set an observer to check if the notification is visible (at least 90%).
             * Threshold=0.9 means the entry is intersecting when intersectionRatio>=0.9.
             * When intersecting, set a timer to delete the notification after given time.
             * If the notification stops intersecting (i.e. intersectionRatio<0.9), clear timer.
             */

            if (ref.current) {
                observer.observe(ref.current);
            }

            return () => {
                if (timer.current) {
                    clearTimeout(timer.current);
                    timer.current = null;
                }

                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            };
        }
    }, [open]);

    const removeNotification = () => {
        if (onRemove) {
            onRemove(message);
        }
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
                    <DateField record={message} source="timestamp" showTime />
                }
                action={
                    onRemove ? (
                        <IconButtonWithTooltip
                            label={'ra.action.delete'}
                            onClick={removeNotification}
                        >
                            <ClearIcon fontSize="small" />
                        </IconButtonWithTooltip>
                    ) : null
                }
            />
            <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {content}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                {showButton && onShow && (
                    <ShowButton
                        resource={resource}
                        record={message.record}
                        variant="text"
                        color="info"
                        onClick={e => onShow(message)}
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
    ['& .MuiCardHeader-action']: {
        paddingLeft: 8,
        marginRight: -12,
    },
    ['& .MuiCardActions-root']: {
        paddingLeft: 16,
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
    timeout?: number;
    onRemove?: (message) => void;
    onShow?: (message) => void;
    markAsRead?: (message) => void;
};
