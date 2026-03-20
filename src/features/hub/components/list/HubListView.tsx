// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useListContext } from 'react-admin';
import { HubCardList } from './HubCardList';
import { HubListToolbar } from './HubListToolbar';
import { Empty } from '../../../../common/components/layout/Empty';

interface HubListViewProps {
    showTypeFilter?: boolean;
}

export const HubListView = ({ showTypeFilter = false }: HubListViewProps) => {
    const { total, isPending } = useListContext();

    return (
        <>
            <HubListToolbar showTypeFilter={showTypeFilter} />
            {!isPending && total === 0 ? (
                <Empty resource="hub" hasCreate={false} />
            ) : (
                <HubCardList showType={showTypeFilter} />
            )}
        </>
    );
};