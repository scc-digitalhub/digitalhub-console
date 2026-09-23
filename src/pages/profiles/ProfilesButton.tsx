import { Button, ButtonProps } from 'react-admin';
import { Link } from 'react-router-dom';
import { ProfilesIcon } from './icon';
import { useRootSelector } from '@dslab/ra-root-selector';

export const ProfilesButton = (props: Omit<ButtonProps<typeof Link>, 'to'>) => {
    const {
        label = 'pages.profiles.header',
        variant = 'text',
        color = 'info',
        ...rest
    } = props;
    const { root } = useRootSelector();

    const to = root ? `/-/${root}/profiles` : '/profiles';

    return (
        <Button
            variant={variant}
            color={color}
            label={label}
            component={Link}
            to={to}
            {...rest}
        >
            <ProfilesIcon />
        </Button>
    );
};
