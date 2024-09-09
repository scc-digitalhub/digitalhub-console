import {
    Menu,
    Button,
    Stack,
    Typography,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Badge,
    styled,
    alpha,
} from '@mui/material';
import { Box } from '@mui/system';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ClearIcon from '@mui/icons-material/Clear';
import { useState, MouseEvent, ReactElement, useEffect, useRef } from 'react';
import {
    useTranslate,
    RaRecord,
    ShowButtonProps,
    useRecordContext,
    useResourceContext,
    ShowButton,
    IconButtonWithTooltip,
    DateField,
    localStorageStore,
} from 'react-admin';
import { RunIcon } from '../resources/runs/icon';
import { useRootSelector } from '@dslab/ra-root-selector';

export const NotificationArea = (props: NotificationAreaProps) => {
    const { messages, setMessages } = props;
    const [open, setOpen] = useState(false);
    console.log('messages', messages);

    const notifications: ReactElement[] = messages.map((message, index) => (
        <Notification
            message={message}
            key={index}
            open={open}
            setMessages={setMessages}
        />
    ));

    const icon = (
        <Badge badgeContent={messages.length} color="error">
            <NotificationsIcon />
        </Badge>
    );

    return (
        <DropDownButton label="" icon={icon} setOpen={setOpen}>
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
                    timer = clearTimeout(timer);
                } else if (entry.isIntersecting && !timer) {
                    console.log('creating timer for', entry.target);
                    timer = setTimeout(() => {
                        console.log('timeout for', entry.target);
                        //edit messages
                        // setMessages(prev => {
                        //     return prev.filter(
                        //         value =>
                        //             value.notificationId !=
                        //             message.notificationId
                        //     );
                        // });
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

    const { root } = useRootSelector();
    const store = localStorageStore('dh');

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

    const notificationClass =
        state === 'COMPLETED'
            ? NotificationClasses.completed
            : state === 'ERROR'
            ? NotificationClasses.error
            : NotificationClasses.default;

    return (
        <NotificationCard
            elevation={0}
            ref={ref}
            square
            className={notificationClass}
        >
            <CardHeader
                avatar={<RunIcon fontSize="small" />}
                title={
                    'Run ' + message.spec.function.split('/')[3].split(':')[0]
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
                    Run status changed to {state}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <ShowButton
                    resource="runs"
                    record={message}
                    variant="text"
                    color="info"
                />
            </CardActions>
        </NotificationCard>
    );
};

const NotificationClasses = {
    default: 'default',
    error: 'error',
    completed: 'success',
};

const NotificationCard = styled(Card, {
    name: 'NotificationCard',
    overridesResolver: (_props, styles) => styles.root,
})(({ theme, className }) => ({
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor:
        className == NotificationClasses.completed
            ? alpha(theme.palette.success.light, 0.3)
            : className == NotificationClasses.error
            ? alpha(theme.palette.error.light, 0.3)
            : theme.palette.common.white,
    ...theme.applyStyles('dark', {
        backgroundColor:
            className == NotificationClasses.completed
                ? alpha(theme.palette.success.dark, 0.5)
                : className == NotificationClasses.error
                ? alpha(theme.palette.error.dark, 0.5)
                : theme.palette.common.black,
    }),
    ['& .MuiCardContent-root, & .MuiCardHeader-root']: {
        paddingBottom: 0,
        paddingTop: 8,
    },
    ['&:hover']: {
        backgroundColor:
            className == NotificationClasses.completed
                ? alpha(theme.palette.success.light, 0.5)
                : className == NotificationClasses.error
                ? alpha(theme.palette.error.light, 0.5)
                : theme.palette.grey[100],
        ...theme.applyStyles('dark', {
            backgroundColor:
                className == NotificationClasses.completed
                    ? alpha(theme.palette.success.dark, 0.7)
                    : className == NotificationClasses.error
                    ? alpha(theme.palette.error.dark, 0.7)
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
