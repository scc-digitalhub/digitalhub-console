// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Datagrid,
    DateField,
    ListContextProvider,
    ResourceContextProvider,
    TextField,
    useList,
} from 'react-admin';
import { TypeChips } from '../../../common/components/TypeChips';
import { Box } from '@mui/material';

export const ConditionsList = ({ record }: { record: any }) => {
    const raw = record?.status?.pods?.[0]?.conditions ?? [];

    const listContext = useList({
        data: raw,
        sort: { field: 'lastTransitionTime', order: 'DESC' },
    });

    return (
        <Box width="60%">
            <ResourceContextProvider value="conditions">
                <ListContextProvider value={listContext}>
                    <Datagrid bulkActionButtons={false} rowClick={false}>
                        <DateField
                            showTime
                            source="lastTransitionTime"
                            label="fields.conditions.lastTransitionTime.title"
                        />
                        <TypeChips
                            source="type"
                            sortable={false}
                            label="fields.conditions.type.title"
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
                        <></>
                    </Datagrid>
                </ListContextProvider>
            </ResourceContextProvider>
        </Box>
    );
};
