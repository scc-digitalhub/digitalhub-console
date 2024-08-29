import { Menu, Button, Stack, Alert, Typography } from '@mui/material';
import { Box } from '@mui/system';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useState, MouseEvent, ReactElement, useEffect, useRef } from 'react';
import {
    useTranslate,
    RaRecord,
    ShowButtonProps,
    useRecordContext,
    useResourceContext,
    Link,
    useCreatePath,
} from 'react-admin';
import { StateColors } from './StateChips';

export const NotificationArea = (props: NotificationAreaProps) => {
    const { messages, setMessages } = props;
    const [open, setOpen] = useState(false);
    console.log('messages', messages);

    const notifications: ReactElement[] = messages.map((message, index) => (
        <Notification message={message} key={index} open={open} setMessages={setMessages} />
    ));

    return (
        <DropDownButton label="" icon={<NotificationsIcon />} setOpen={setOpen}>
            {notifications.length != 0 ? (
                notifications
            ) : (
                <Typography sx={{ paddingX: 2 }}>No new messages</Typography> //TODO translate
            )}
        </DropDownButton>
    );
};

type NotificationAreaProps = {
    messages: any[];
    setMessages: React.Dispatch<React.SetStateAction<any[]>>;
};

export const Notification = (props: NotificationProps) => {
    const { message, open, setMessages, timeout = 10000 } = props;
    const state: String = message.status.state;
    const createPath = useCreatePath();
    const ref = useRef(null);

    useEffect(() => {
        if (open) {
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
                    clearTimeout(timer);
                } else if (entry.isIntersecting && !timer) {
                    console.log('creating timer for', entry.target);
                    timer = setTimeout(() => {
                        console.log('timeout for', entry.target);
                        //edit messages
                        setMessages(prev => {
                            return prev.filter(value => value.notificationId != message.notificationId )
                        })
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

    const alertContent =
        state === 'DELETED' ? (
            `Run ${message.id} status changed to ${state}`
        ) : (
            <Link
                to={createPath({
                    resource: 'runs',
                    id: message.id,
                    type: 'show',
                })}
            >
                Run status changed to {state}
            </Link>
        );

    return (
        <Alert severity={StateColors[state.toUpperCase()]} ref={ref}>
            {alertContent}
        </Alert>
    );
};

type NotificationProps = {
    message: any;
    open: boolean;
    setMessages: React.Dispatch<React.SetStateAction<any[]>>;
    timeout?: number;
};

export const DropDownButton = (props: DrodownButtonProps) => {
    const {
        icon,
        label = 'action.actions',
        record: recordProp,
        resource: resourceProp,
        children,
        setOpen,
        ...rest
    } = props;
    const resource = useResourceContext(props);
    const record = useRecordContext(props);
    const translate = useTranslate();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleOpen = (event: MouseEvent<HTMLElement>): void => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setOpen(true);
    };
    const handleClose = (event: MouseEvent<HTMLElement>): void => {
        event.stopPropagation();
        setAnchorEl(null);
        setOpen(false);
    };

    return (
        <Box className="DropDownMenu" component="span">
            <Box>
                <Button
                    color="inherit"
                    variant="text"
                    aria-controls="simple-menu"
                    aria-label=""
                    aria-haspopup="true"
                    onClick={handleOpen}
                    startIcon={icon}
                    // endIcon={<ExpandMoreIcon fontSize="small" />}
                >
                    {translate(label)}
                </Button>
            </Box>
            <Menu
                id="dropdown-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <Stack
                    direction={'column'}
                    sx={{
                        minWidth: '80px',
                        // marginLeft: '10px',
                        alignItems: 'flex-start',
                    }}
                >
                    {children}
                </Stack>
            </Menu>
        </Box>
    );
};

export type DrodownButtonProps<RecordType extends RaRecord = any> =
    ShowButtonProps & {
        children: ReactElement | ReactElement[];
        setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    };
