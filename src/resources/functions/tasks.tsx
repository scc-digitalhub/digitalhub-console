// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { TaskShowComponent } from '../tasks';
import {
    RecordContextProvider,
    ResourceContextProvider,
    useGetList,
    useRecordContext,
} from 'react-admin';

export const FunctionTaskShow = (props: { kind: string }) => {
    const { kind } = props;
    const fn = useRecordContext(props);

    if (!kind || !fn) {
        return <></>;
    }

    return <FunctionTaskView kind={kind} fn={fn}></FunctionTaskView>;
};

const FunctionTaskView = (props: { kind: string; fn: any }) => {
    const { kind, fn } = props;

    //fetch task matching kind for current function
    const { data } = useGetList('tasks', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'kind', order: 'ASC' },
        filter: {
            function: `${fn.kind}://${fn.project}/${fn.name}:${fn.id}`,
        },
    });

    const record = data?.find(r => r.kind == kind);

    if (!record) {
        return <></>;
    }

    return (
        <ResourceContextProvider value="tasks">
            <RecordContextProvider value={record}>
                <TaskShowComponent />
            </RecordContextProvider>
        </ResourceContextProvider>
    );
};
