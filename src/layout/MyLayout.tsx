import { useLocation } from 'react-router-dom';
import { useMediaQuery, Theme } from '@mui/material';
import { Layout } from 'react-admin';
import { MyAppBar } from './MyAppBar';
import { MyMenu } from './MyMenu';
import { MySidebar } from './MySidebar';
import { SxProps } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

export const MyLayout = (props: any) => {
    const url = useLocation();
    let style: SxProps = {};
    const sharedStyle: SxProps = {
        backgroundColor: 'rgb(250, 250, 250)',
        px: 0,
    };
    const theme = useTheme();
    const isLarge = useMediaQuery(theme.breakpoints.down('lg'));
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    if (url.pathname === '/') {
        style = {
            ...style,
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left:
                !isLarge && !isSmall
                    ? '30%'
                    : isLarge && !isSmall
                    ? '20%'
                    : '5%',
            right:
                !isLarge && !isSmall
                    ? '30%'
                    : isLarge && !isSmall
                    ? '20%'
                    : '5%',
            top: '35%',
            ...sharedStyle,
        };
    } else {
        style = { ...sharedStyle };
    }

    return (
        <Layout
            {...props}
            appBar={MyAppBar}
            menu={MyMenu}
            sidebar={MySidebar}
            sx={{
                '& .RaLayout-content': style,
            }}
        />
    );
};
