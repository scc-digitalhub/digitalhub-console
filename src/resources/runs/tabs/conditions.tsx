// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Datagrid,
    DateField,
    Labeled,
    ListContextProvider,
    TextField,
    useList,
} from 'react-admin';
import { TypeChips } from '../../../components/TypeChips';

export const ConditionsList = (props: { record: any }) => {
    const { record } = props;
    const raw = record?.status?.pods?.[0]?.conditions ?? [];

    const toMs = (item: any) => {
        if (!item) return 0;
        const v = item.lastTransitionTime;
        if (v == null) return 0;

        if (typeof v === 'number') {
            return v < 1e12 ? v * 1000 : v;
        }

        const parsed = Date.parse(String(v));
        return Number.isNaN(parsed) ? 0 : parsed;
    };

    const sortedConditions = [...raw].sort((a, b) => toMs(b) - toMs(a));

    const listContext = useList({ data: sortedConditions });
    
    return (
        <Labeled label="fields.conditions.title"  width={"50%"}>
            <ListContextProvider value={listContext}>
                <Datagrid bulkActionButtons={false} rowClick={false}   >
                    <DateField
                        showTime
                        source={"lastTransitionTime"}
                        label="fields.conditions.lastTransitionTime.title"

                    />
                    <TextField
                        source="reason"
                        sortable={false}
                        label="fields.conditions.reason.title"
                    />
                    <TextField
                        source="status"
                        sortable={false}
                        label="fields.conditions.status.title"
                    />
                    <TypeChips 
                        source="type"
                        sortable={false}
                        label="fields.conditions.type.title"
                    />
                    <></>
                </Datagrid>
            </ListContextProvider>
        </Labeled>
    );
};
