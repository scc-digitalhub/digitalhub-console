// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Sidebar } from 'react-admin';

export const MySidebar = props => (
    <Sidebar
        sx={{
            '& .RaSidebar-fixed': {
                height: '100vh',
            },
        }}
        {...props}
    />
);
