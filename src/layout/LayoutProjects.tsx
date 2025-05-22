import { Layout, AppBar } from 'react-admin';
import { Button, Typography } from '@mui/material';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import RootResourceSelectorMenu from '../components/RootSelectorMenu';
import { MyUserMenu } from './MyUserMenu';

const APP_VERSION: string =
    (globalThis as any).REACT_APP_VERSION ||
    (process.env.REACT_APP_VERSION as string);
const docsVersion = APP_VERSION
    ? APP_VERSION.replace(new RegExp(/\.[^/.]+$/), '')
    : undefined;

const InitialAppBar = () => {
    return (
        <AppBar color="primary" elevation={0} userMenu={<MyUserMenu />}>
            <Typography
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
                variant="h6"
                color="inherit"
                flex="1"
            >
                <RootResourceSelectorMenu
                    source="name"
                    showSelected={true}
                    icon={false}
                />
            </Typography>

            {docsVersion && (
                <Button
                    color="inherit"
                    href={
                        'https://scc-digitalhub.github.io/docs/' + docsVersion
                    }
                    target="_blank"
                >
                    <HelpCenterIcon />
                </Button>
            )}
        </AppBar>
    );
};

export const LayoutProjects = (props: any) => {
    return <Layout {...props} appBar={InitialAppBar} sidebar={() => <></>} />;
};
