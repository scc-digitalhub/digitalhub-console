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

export const WorkflowTaskShow = (props: { kind: string }) => {
    const { kind } = props;
    const fn = useRecordContext(props);

    if (!kind || !fn) {
        return <></>;
    }

    return <WorkflowTaskView kind={kind} workflow={fn}></WorkflowTaskView>;
};

const WorkflowTaskView = (props: { kind: string; workflow: any }) => {
    const { kind, workflow } = props;

    //fetch task matching kind for current function
    const { data } = useGetList('tasks', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'kind', order: 'ASC' },
        filter: {
            workflow: `${workflow.kind}://${workflow.project}/${workflow.name}:${workflow.id}`,
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
