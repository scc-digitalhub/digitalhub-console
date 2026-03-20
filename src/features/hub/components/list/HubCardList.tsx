// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ListView } from 'react-admin';
import { Box } from '@mui/material';
import { GridList } from '../../../../common/components/layout/GridList';
import { HubCard } from './HubCard';



interface HubCardListProps {
    showType?: boolean;
}

export const HubCardList = ({ showType }: HubCardListProps) => (
    <ListView actions={false} pagination={false} component={Box} empty={false}>
        <GridList
            spacing={2}
            component={<Box sx={{ width: '100%' }} />}
            linkType={false}
        >
            <HubCard showType={showType} />
        </GridList>
    </ListView>
);