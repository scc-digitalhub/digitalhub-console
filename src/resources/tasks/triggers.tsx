// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    FunctionField,
    InfiniteListBase,
    ListView,
    ShowButton,
    TextField,
    TopToolbar,
    useGetResourceLabel,
    useRecordContext,
} from 'react-admin';
import { Typography, Box, alpha } from '@mui/material';
import { CreateInDialogButton } from '@dslab/ra-dialog-crud';
import { InspectButton } from '@dslab/ra-inspect-button';
import { RowButtonGroup } from '../../common/components/buttons/RowButtonGroup';
import { StateChips } from '../../common/components/StateChips';
import { useGetManySchemas } from '../../features/jsonSchema/schemaController';
import { DropDownButton } from '../../common/components/buttons/DropdownButton';
import { TriggerCreateForm } from '../triggers/create';
import { DeactivateButton } from '../triggers/DeactivateButton';
import { LoadMore } from '../../common/components/LoadMore';
import { sanitizeObj } from '../../common/helper';

export const TaskTriggerList = () => {
    //task is the current record
    const record = useRecordContext();
    const getResourceLabel = useGetResourceLabel();
    const label = getResourceLabel('triggers', 2);

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

    const partial = sanitizeObj({
        project: record?.project,
        spec: {
            task: taskKey,
            function: taskFunction,
            workflow: taskWorkflow,
            template: {
                function: taskFunction,
                workflow: taskWorkflow,
                task: taskKey,
                local_execution: false,
            },
        },
    });

    const prepare = (r: any) => {
        const v = {
            ...r,
            spec: {
                task: taskKey,
                function: taskFunction,
                workflow: taskWorkflow,
                //copy the task spec  (using form)
                ...r.spec,
            },
        };

        //clear values from template
        if (v.spec.template) {
            if (v.spec.template['function']) {
                delete v.spec.template['function'];
            }
            if (v.spec.template['workflow']) {
                delete v.spec.template['workflow'];
            }
            if (v.spec.template.task) {
                delete v.spec.template.task;
            }
            v.spec.template.local_execution = false;
        }

        return v;
    };

    if (!runSchema || !taskSchema) {
        return <></>;
    }

    return (
        <Box>
            <TopToolbar>
                <CreateInDialogButton
                    label="actions.createTrigger"
                    resource="triggers"
                    record={partial}
                    transform={prepare}
                    fullWidth
                    maxWidth={'lg'}
                    closeOnClickOutside={false}
                >
                    <TriggerCreateForm
                        runSchema={runSchema.schema}
                        taskSchema={taskSchema.schema}
                    />
                </CreateInDialogButton>
            </TopToolbar>
            <Typography
                variant="h6"
                sx={theme => ({
                    color: alpha(theme.palette.common.black, 0.6),
                    ...theme.applyStyles('dark', {
                        color: alpha(theme.palette.common.white, 0.7),
                    }),
                })}
            >
                {label}
            </Typography>

            <InfiniteListBase
                resource="triggers"
                sort={{ field: 'created', order: 'DESC' }}
                filter={{ task: taskKey }}
                disableSyncWithLocation
            >
                <ListView
                    component={Box}
                    empty={false}
                    actions={false}
                    pagination={<LoadMore />}
                >
                    <Datagrid
                        bulkActionButtons={false}
                        rowClick={false}
                        sx={{ marginTop: '12px' }}
                    >
                        <TextField
                            source="name"
                            label="fields.name.title"
                            sortable={false}
                        />
                        <TextField
                            source="kind"
                            label="fields.kind"
                            sortable={false}
                        />
                        <StateChips
                            source="status.state"
                            sortable={false}
                            label="fields.status.state"
                        />
                        <RowButtonGroup>
                            <DropDownButton>
                                <ShowButton />
                                <InspectButton fullWidth />
                                <FunctionField
                                    render={record =>
                                        record.status?.state == 'RUNNING' ? (
                                            <DeactivateButton record={record} />
                                        ) : null
                                    }
                                />
                                <DeleteWithConfirmButton redirect={false} />
                            </DropDownButton>
                        </RowButtonGroup>
                    </Datagrid>
                </ListView>
            </InfiniteListBase>
        </Box>
    );
};
