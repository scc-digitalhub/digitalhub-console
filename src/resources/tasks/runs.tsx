// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    FunctionField,
    ListView,
    ShowButton,
    TextField,
    useGetResourceLabel,
    useRecordContext,
} from 'react-admin';
import { Typography, Box } from '@mui/material';
import { CreateInDialogButton } from '@dslab/ra-dialog-crud';
import { InspectButton } from '@dslab/ra-inspect-button';
import { RowButtonGroup } from '../../components/buttons/RowButtonGroup';
import { StateChips } from '../../components/StateChips';
import { LogsButton } from '../../components/buttons/LogsButton';
import { useGetManySchemas } from '../../controllers/schemaController';
import { Empty } from '../../components/Empty';
import { StopButton } from '../runs/StopButton';
import { DropDownButton } from '../../components/buttons/DropdownButton';
import { RunCreateForm } from '../runs/create';
import { BulkDeleteAllVersionsButton } from '../../components/buttons/BulkDeleteAllVersionsButton';
import { ListBaseLive } from '../../components/ListBaseLive';
import { CloneButton } from '../runs/CloneButton';
import { useRootSelector } from '@dslab/ra-root-selector';

export const TaskRunList = () => {
    //task is the current record
    const record = useRecordContext();
    const { root } = useRootSelector();
    const getResourceLabel = useGetResourceLabel();
    const label = getResourceLabel('runs', 2);

    //TODO remove hardcoded dereference of task/runtime
    const runtime = record?.kind?.split('+')[0] || '';

    const { data: schemas } = useGetManySchemas([
        { resource: 'tasks', runtime },
        { resource: 'runs', runtime },
    ]);

    //TODO remove hardcoded dereference of run kind
    const taskSchema = schemas?.find(s => s.kind == record?.kind);
    const runSchema = schemas?.find(s => s.kind == record?.kind + ':run');

    const taskKey = `${record?.kind}://${record?.project}/${record?.id}`;
    const taskFunction = record?.spec?.function;
    const taskWorkflow = record?.spec?.workflow;

    const partial = {
        project: record?.project,
        kind: runSchema?.kind,
        spec: {
            function: taskFunction,
            workflow: taskWorkflow,
            task: taskKey,
            local_execution: false,
            //copy the task spec  (using record)
            ...record?.spec,
        },
    };

    const prepare = (r: any) => {
        return {
            ...r,
            spec: {
                function: taskFunction,
                workflow: taskWorkflow,
                task: taskKey,
                local_execution: false,
                //copy the task spec  (using form)
                ...r.spec,
            },
        };
    };

    if (!runSchema || !taskSchema) {
        return <></>;
    }

    return (
        <>
            <Typography variant="h4" sx={{ color: 'secondary.main' }}>
                {label}
            </Typography>

            <ListBaseLive
                resource="runs"
                sort={{ field: 'created', order: 'DESC' }}
                filter={{ task: taskKey }}
                disableSyncWithLocation
                queryOptions={{ meta: { root }}}
            >
                <ListView
                    component={Box}
                    empty={
                        <Empty showIcon={false}>
                            <CreateInDialogButton
                                resource="runs"
                                record={partial}
                                fullWidth
                                maxWidth={'lg'}
                                transform={prepare}
                                closeOnClickOutside={false}
                            >
                                <RunCreateForm
                                    runtime={runtime}
                                    runSchema={runSchema.schema}
                                    taskSchema={taskSchema.schema}
                                />
                            </CreateInDialogButton>
                        </Empty>
                    }
                    actions={
                        <CreateInDialogButton
                            resource="runs"
                            record={partial}
                            fullWidth
                            maxWidth={'lg'}
                            transform={prepare}
                            closeOnClickOutside={false}
                        >
                            <RunCreateForm
                                runtime={runtime}
                                runSchema={runSchema.schema}
                                taskSchema={taskSchema.schema}
                            />
                        </CreateInDialogButton>
                    }
                >
                    <Datagrid
                        bulkActionButtons={<BulkDeleteAllVersionsButton />}
                        rowClick={false}
                    >
                        <DateField
                            source="metadata.created"
                            showTime
                            label="fields.metadata.created"
                        />
                        <TextField source="id" sortable={false} />
                        <StateChips
                            source="status.state"
                            sortable={false}
                            label="fields.status.state"
                        />
                        <RowButtonGroup>
                            <DropDownButton>
                                <ShowButton />
                                <LogsButton />
                                <InspectButton fullWidth />
                                <CloneButton />
                                <FunctionField
                                    render={record =>
                                        record.status?.state == 'RUNNING' ? (
                                            <StopButton record={record} />
                                        ) : null
                                    }
                                />
                                <DeleteWithConfirmButton redirect={false} />
                            </DropDownButton>
                        </RowButtonGroup>
                    </Datagrid>
                </ListView>
            </ListBaseLive>
        </>
    );
};
