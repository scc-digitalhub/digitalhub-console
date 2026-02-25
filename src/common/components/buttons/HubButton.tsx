import * as React from 'react';
import { Link } from 'react-router-dom';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import {
    Button,
    ButtonProps,
    useResourceContext,
    useCreatePath,
} from 'react-admin';

export interface HubButtonProps extends Omit<ButtonProps, 'to'> {
    icon?: React.ReactElement;
    to?: string;
}

export const HubButton = ({
    icon = <DeviceHubIcon />,
    label = 'actions.hub',
    to,
    color = 'primary',
    ...rest
}: HubButtonProps) => {
    const resource = useResourceContext();
    const createPath = useCreatePath();

    const path =
        to ||
        (resource ? `${createPath({ resource, type: 'list' })}/hub` : '/');

    return (
        <Button
            component={Link}
            to={path}
            label={label}
            color={color}
            {...(rest as any)}
        >
            {icon}
        </Button>
    );
};
