import { TaskEditComponent, TaskShowComponent } from '../resources/tasks';
import {
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    FunctionField,
    Labeled,
    ListView,
    ShowButton,
    SimpleShowLayout,
    TextField,
    TopToolbar,
    useGetResourceLabel,
    useRecordContext,
} from 'react-admin';
import { Stack, Typography, Box } from '@mui/material';
import {
    CreateInDialogButton,
    EditInDialogButton,
    ShowInDialogButton,
} from '@dslab/ra-dialog-crud';
import { InspectButton } from '@dslab/ra-inspect-button';
import { RowButtonGroup } from './buttons/RowButtonGroup';
import { StateChips } from './StateChips';
import { LogsButton } from './buttons/LogsButton';
import { filterProps } from '../common/schemas';
import { useGetManySchemas } from '../controllers/schemaController';
import { Empty } from './Empty';
import { ReactElement } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { StopButton } from '../resources/runs/StopButton';
import { DropDownButton } from './buttons/DropdownButton';
import { RunCreateForm } from '../resources/runs/create';
import { BulkDeleteAllVersionsButton } from './buttons/BulkDeleteAllVersionsButton';
import { ListBaseLive } from './ListBaseLive';
import { TriggerCreateForm } from '../resources/triggers/create';

export const TaskAndRuns = (props: {
    task?: string;
    onEdit: (id: string, data: any) => void;
    runOf: 'function' | 'workflow';
}) => {
    const { task, onEdit, runOf } = props;

    const prepare = (r: any) => {
        return {
            ...r,
            spec: {
                task,
                ...r.spec,
            },
        };
    };

    return (
        <>
            <TopToolbar>
                <ShowInDialogButton fullWidth maxWidth={'lg'}>
                    <TaskShowComponent />
                </ShowInDialogButton>
                <EditInDialogButton
                    fullWidth
                    closeOnClickOutside={false}
                    maxWidth={'lg'}
                    transform={prepare}
                    mutationMode="pessimistic"
                    mutationOptions={{
                        onSuccess: data => {
                            //data is updated
                            if (task && data) onEdit(task, data);
                        },
                    }}
                >
                    <TaskEditComponent />
                </EditInDialogButton>
                <InspectButton fullWidth />
            </TopToolbar>
            <SimpleShowLayout>
                <Stack direction={'row'} spacing={3}>
                    <Labeled>
                        <TextField source="kind" label="fields.kind" />
                    </Labeled>
                    <Labeled>
                        <TextField source="id" />
                    </Labeled>
                </Stack>
                <Labeled>
                    <TextField source="key" />
                </Labeled>
            </SimpleShowLayout>
            <TaskTriggerList runOf={runOf} />
            <TaskRunList runOf={runOf} />
        </>
    );
};

const TaskRunList = ({ runOf }: { runOf: 'function' | 'workflow' }) => {
    const record = useRecordContext();
    const getResourceLabel = useGetResourceLabel();
    const label = getResourceLabel('runs', 2);

    const fn = record?.spec?.[runOf] || '';
    const url = new URL(fn);
    const runtime = url.protocol
        ? url.protocol.substring(0, url.protocol.length - 1)
        : '';
    url.protocol = record.kind + ':';
    const key = `${record.kind}://${record.project}/${record.id}`;

    const { data: schemas } = useGetManySchemas([
        { resource: runOf + 's', runtime },
        { resource: 'tasks', runtime },
        { resource: 'runs', runtime },
    ]);

    //filter run and task schema
    let runSchema = schemas ? schemas.find(s => s.entity === 'RUN') : null;
    const taskSchema = schemas
        ? schemas.find(s => s.entity === 'TASK' && s.kind === record?.kind)
        : null;

    if (runSchema && schemas) {
        //filter out embedded props from spec
        schemas
            .filter(s => s.entity != 'RUN')
            .forEach(s => {
                runSchema.schema = filterProps(runSchema.schema, s.schema);
            });
    }

    const partial = {
        project: record?.project,
        kind: runSchema ? runSchema.kind : 'run',
        spec: {
            task: key,
            local_execution: false,
            //copy the task spec  (using record)
            ...record?.spec,
        },
    };

    const prepare = (r: any) => {
        return {
            ...r,
            spec: {
                task: key,
                local_execution: false,
                //copy the task spec  (using form)
                ...r.spec,
            },
        };
    };

    const CreateActionButton = (props: {
        record?: any;
        label?: string;
        icon?: ReactElement;
    }) => {
        const { record, label, icon } = props;
        return (
            <CreateInDialogButton
                resource="runs"
                label={label}
                icon={icon}
                record={record}
                fullWidth
                maxWidth={'lg'}
                transform={prepare}
                closeOnClickOutside={false}
            >
                {runSchema?.schema && taskSchema?.schema && (
                    <RunCreateForm
                        runtime={runtime}
                        runSchema={runSchema.schema}
                        taskSchema={taskSchema.schema}
                    />
                )}
            </CreateInDialogButton>
        );
    };

    return (
        <>
            <Typography variant="h4" color={'secondary.main'}>
                {label}
            </Typography>

            <ListBaseLive
                resource="runs"
                sort={{ field: 'created', order: 'DESC' }}
                filter={{ task: key }}
                disableSyncWithLocation
            >
                <ListView
                    component={Box}
                    empty={
                        <Empty showIcon={false}>
                            <CreateActionButton record={partial} />
                        </Empty>
                    }
                    actions={<CreateActionButton record={partial} />}
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
                                <FunctionField
                                    render={record => (
                                        <CreateActionButton
                                            record={{
                                                ...partial,
                                                spec: record.spec,
                                            }}
                                            label="ra.action.clone"
                                            icon={<ContentCopyIcon />}
                                        />
                                    )}
                                />
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

const TaskTriggerList = ({ runOf }: { runOf: 'function' | 'workflow' }) => {
    const record = useRecordContext();
    const getResourceLabel = useGetResourceLabel();
    const label = getResourceLabel('triggers', 2);

    const fn = record?.spec?.[runOf] || '';
    const url = new URL(fn);
    const runtime = url.protocol
        ? url.protocol.substring(0, url.protocol.length - 1)
        : '';
    url.protocol = record.kind + ':';
    const key = `${record.kind}://${record.project}/${record.id}`;

    const { data: schemas } = useGetManySchemas([
        { resource: runOf + 's', runtime },
        { resource: 'tasks', runtime },
        { resource: 'runs', runtime },
    ]);

    //filter run and task schema
    let runSchema = schemas ? schemas.find(s => s.entity === 'RUN') : null;
    const taskSchema = schemas
        ? schemas.find(s => s.entity === 'TASK' && s.kind === record?.kind)
        : null;

    if (runSchema && schemas) {
        //filter out embedded props from spec
        schemas
            .filter(s => s.entity != 'RUN')
            .forEach(s => {
                runSchema.schema = filterProps(runSchema.schema, s.schema);
            });
    }

    const partial = {
        project: record?.project,
        spec: {
            task: key,
            function: fn,
            template: {
                function: fn,
                task: key,
                local_execution: false,
            },
        },
    };

    const prepare = (r: any) => {
        const v = {
            ...r,
            spec: {
                task: key,
                function: fn,
                //copy the task spec  (using form)
                ...r.spec,
            },
        };

        //clear values from template
        if (v.spec.template) {
            if (v.spec.template.function) {
                delete v.spec.template.function;
            }
            if (v.spec.template.task) {
                delete v.spec.template.task;
            }
            v.spec.template.local_execution = false;
        }

        return v;
    };

    const CreateActionButton = (props: {
        record?: any;
        label?: string;
        icon?: ReactElement;
    }) => {
        const { record, label, icon } = props;
        return (
            <CreateInDialogButton
                resource="triggers"
                label={label}
                icon={icon}
                record={record}
                fullWidth
                maxWidth={'lg'}
                transform={prepare}
                closeOnClickOutside={false}
            >
                {runSchema?.schema && taskSchema?.schema && (
                    <TriggerCreateForm
                        runSchema={runSchema.schema}
                        taskSchema={taskSchema.schema}
                    />
                )}
            </CreateInDialogButton>
        );
    };

    return (
        <>
            <Typography variant="h4" color={'secondary.main'}>
                {label}
            </Typography>

            <ListBaseLive
                resource="triggers"
                sort={{ field: 'created', order: 'DESC' }}
                filter={{ task: key }}
                disableSyncWithLocation
            >
                <ListView
                    component={Box}
                    empty={
                        <Empty showIcon={false}>
                            <CreateActionButton record={partial} />
                        </Empty>
                    }
                    actions={<CreateActionButton record={partial} />}
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
                                <FunctionField
                                    render={record => (
                                        <CreateActionButton
                                            record={{
                                                ...partial,
                                                spec: record.spec,
                                            }}
                                            label="ra.action.clone"
                                            icon={<ContentCopyIcon />}
                                        />
                                    )}
                                />
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
