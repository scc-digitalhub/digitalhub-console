// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    UserMenu,
    MenuItemLink,
    UserMenuProps,
    useAuthProvider,
    Logout,
} from 'react-admin';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

export const MyUserMenu = (props: UserMenuProps) => {
    const authProvider = useAuthProvider();

    return (
        <UserMenu {...props}>
            <MenuItemLink
                to="/account"
                primaryText="Configuration"
                leftIcon={<ManageAccountsIcon />}
            />
            {!!authProvider && <Logout />}
        </UserMenu>
    );
};
