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
                // borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            }}
        >
            <Box flex={1}>
                <Menu.DashboardItem />
                <Menu.ResourceItem name="artifacts" />
                <Menu.ResourceItem name="dataitems" />
                <Menu.ResourceItem name="functions" />
                <Menu.ResourceItem name="secrets" />
                {/* </Box>

            <Box height={'20vh'}> */}
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
