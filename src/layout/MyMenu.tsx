import { Menu } from 'react-admin';

export const MyMenu = () => (
    <Menu
        sx={{
            height: '100%',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            backgroundColor: 'rgb(255, 255, 255)',
        }}
    >
        <Menu.DashboardItem />
        <Menu.ResourceItem name="functions" />
        <Menu.ResourceItem name="dataitems" />
        <Menu.ResourceItem name="artifacts" />
    </Menu>
);
