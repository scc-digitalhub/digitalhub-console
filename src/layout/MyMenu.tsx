import { Menu, MenuItemLink, useBasename, useTranslate } from 'react-admin';
import { ProjectIcon } from '../resources/projects/icon';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Divider } from '@mui/material';

export const MyMenu = () => {
    const basename = useBasename();
    const translate = useTranslate();

    return (
        <Menu
            sx={{
                height: '100%',
                pt: '18px',
            }}
        >
            <Box flex={1}>
                <Menu.DashboardItem />
                <Menu.ResourceItem name="artifacts" />
                <Menu.ResourceItem name="dataitems" />
                <Menu.ResourceItem name="models" />
                <Menu.ResourceItem name="functions" />
                <Menu.ResourceItem name="workflows" />
                <Menu.ResourceItem name="runs" />
                <Menu.ResourceItem name="secrets" />
                <Divider />
                <MenuItemLink
                    leftIcon={<SettingsIcon />}
                    to={`${basename}/config`}
                    primaryText={'menu.configuration'}
                />
            </Box>
        </Menu>
    );
};
