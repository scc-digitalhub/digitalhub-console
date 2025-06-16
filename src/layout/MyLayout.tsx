// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Layout } from 'react-admin';
import { MyAppBar } from './MyAppBar';
import { MyMenu } from './MyMenu';
import { MySidebar } from './MySidebar';

export const MyLayout = (props: any) => {
    return (
        <Layout
            {...props}
            appBar={MyAppBar}
            menu={MyMenu}
            sidebar={MySidebar}
        />
    );
};
