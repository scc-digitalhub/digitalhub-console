import { Menu, Button, Stack, Typography, Badge, Divider } from '@mui/material';
import { Box } from '@mui/system';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useState, MouseEvent, ReactElement, Fragment } from 'react';
import {
    useTranslate,
    RaRecord,
    ShowButtonProps,
    useRecordContext,
    useResourceContext,
} from 'react-admin';
import { Notification } from './Notification';

export const NotificationArea = (props: NotificationAreaProps) => {
    const { messages, setMessages } = props;
    const [open, setOpen] = useState(false);
    const translate = useTranslate();
    console.log('messages', messages);

    const notifications: ReactElement[] = messages.map((message, index) => (
        <Fragment key={index}>
            <Divider flexItem />
            <Notification
                message={message}
                open={open}
                setMessages={setMessages}
            />
        </Fragment>
    ));

    const icon = (
        <Badge
            badgeContent={messages.filter(m => m.isRead === false).length}
            color="error"
        >
            <NotificationsIcon />
        </Badge>
    );

    return (
        <DropDownButton label="" icon={icon} setOpen={setOpen}>
            {notifications.length != 0 ? (
                <>
                    <Typography
                        variant="button"
                        gutterBottom
                        align="center"
                        width={'100%'}
                        color={'grey'}
                    >
                        {messages.length +
                            ' ' +
                            translate('messages.notifications.header')}
                    </Typography>
                    {notifications}
                </>
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
                sx={theme => ({
                    '& .MuiList-root': {
                        backgroundColor: 'white',
                        ...theme.applyStyles('dark', {
                            backgroundColor: 'black',
                        }),
                    },
                })}
            >
                <Stack
                    direction={'column'}
                    sx={{
                        minWidth: '80px',
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
