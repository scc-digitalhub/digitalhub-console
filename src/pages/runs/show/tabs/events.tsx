// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Datagrid,
    DateField,
    FunctionField,
    Labeled,
    ListContextProvider,
    TextField,
    useList,
} from 'react-admin';

export const EventsList = (props: { record: any }) => {
    const { record } = props;
    const data = record?.status?.events ? [...record.status.events] : [];
    //sort by timestamp
    data.sort((a, b) => {
        return a.timestamp - b.timestamp;
    });

    const listContext = useList({ data });

    if (!data || data.length == 0) {
        return <></>;
    }

    return (
        <Labeled>
            <ListContextProvider value={listContext}>
                <Datagrid bulkActionButtons={false} rowClick={false}>
                    <DateField
                        showTime
                        source="timestamp"
                        transform={v => new Date(v * 1000)}
                        label="fields.events.time.title"
                    />
                    <TextField
                        source="kind"
                        sortable={false}
                        label="fields.kind"
                    />
                    <FunctionField
                        source="reason"
                        sortable={false}
                        label="fields.events.details.title"
                        render={r => (
                            <>
                                <strong>{r.type}:</strong> {r.reason}
                            </>
                        )}
                    />
                    <TextField
                        source="note"
                        sortable={false}
                        label="fields.events.message.title"
                    />
                </Datagrid>
            </ListContextProvider>
        </Labeled>
    );
};
