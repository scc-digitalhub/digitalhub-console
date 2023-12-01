import { Menu } from 'react-admin';

export const MyMenu = () => (
    <Menu>
        <Menu.DashboardItem/>
        <Menu.ResourceItem name="functions" />
        <Menu.ResourceItem name="dataitems" />
        <Menu.ResourceItem name="artifacts" />
    </Menu>
);