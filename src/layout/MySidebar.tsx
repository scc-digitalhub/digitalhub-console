// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import useScrollTrigger from '@mui/material/useScrollTrigger';
import { Sidebar } from 'react-admin';

export const MySidebar = props => {
    const trigger = useScrollTrigger();

    return (
        <Sidebar
            sx={{
                '& .RaSidebar-fixed': {
                    //consider appbar height (subtracted by default) when calculating sidebar
                    //height to avoid either overflow or white space
                    height: trigger ? '100vh' : undefined,
                    pb: '10px',
                },
            }}
            {...props}
        />
    );
};
