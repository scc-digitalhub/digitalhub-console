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
import { Stack, Typography, Box, alpha } from '@mui/material';
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
import { DeactivateButton } from '../resources/triggers/DeactivateButton';

export const TaskAndRuns = (props: {
    task?: string;
    onEdit: (id: string, data: any) => void;
    runOf: 'function' | 'workflow';
}) => {
    const { task, onEdit, runOf } = props;
    const record = useRecordContext();

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

    const prepareTask = (r: any) => {
        return {
            ...r,
            spec: {
                task,
                ...r.spec,
            },
        };
    };

    const partialTrigger = {
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

    const prepareTrigger = (r: any) => {
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
                    transform={prepareTask}
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
                <CreateActionButton
                    label="actions.createTrigger"
                    resource="triggers"
                    record={partialTrigger}
                    runSchema={runSchema}
                    taskSchema={taskSchema}
                    prepare={prepareTrigger}
                />
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
            <TaskTriggerList taskKey={key} />
            <TaskRunList
                taskKey={key}
                runSchema={runSchema}
                taskSchema={taskSchema}
                runtime={runtime}
            />
        </>
    );
};

type ListProps = {
    taskKey: string;
    runSchema: any;
    taskSchema: any;
    runtime: string;
};

const TaskRunList = (props: ListProps) => {
    const { taskKey: key, runSchema, taskSchema, runtime } = props;
    const record = useRecordContext();
    const getResourceLabel = useGetResourceLabel();
    const label = getResourceLabel('runs', 2);

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
                            <CreateActionButton
                                record={partial}
                                resource="runs"
                                runSchema={runSchema}
                                taskSchema={taskSchema}
                                prepare={prepare}
                                runtime={runtime}
                            />
                        </Empty>
                    }
                    actions={
                        <CreateActionButton
                            record={partial}
                            resource="runs"
                            runSchema={runSchema}
                            taskSchema={taskSchema}
                            prepare={prepare}
                            runtime={runtime}
                        />
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
                                <FunctionField
                                    render={record => (
                                        <CreateActionButton
                                            record={{
                                                ...partial,
                                                spec: record.spec,
                                            }}
                                            label="ra.action.clone"
                                            icon={<ContentCopyIcon />}
                                            resource="runs"
                                            runSchema={runSchema}
                                            taskSchema={taskSchema}
                                            prepare={prepare}
                                            runtime={runtime}
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

const TaskTriggerList = (props: { taskKey: string }) => {
    const { taskKey: key } = props;
    const getResourceLabel = useGetResourceLabel();
    const label = getResourceLabel('triggers', 2);

    return (
        <Box sx={{ paddingX: '18px', paddingY: '9px' }}>
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

            <ListBaseLive
                resource="triggers"
                sort={{ field: 'created', order: 'DESC' }}
                filter={{ task: key }}
                disableSyncWithLocation
            >
                <ListView component={Box} empty={false} actions={false}>
                    <Datagrid
                        bulkActionButtons={false}
                        rowClick={false}
                        sx={{ marginTop: '12px' }}
                    >
                        <DateField
                            source="metadata.created"
                            showTime
                            label="fields.metadata.created"
                        />
                        <TextField
                            source="name"
                            label="fields.name.title"
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
            </ListBaseLive>
        </Box>
    );
};

const CreateActionButton = (props: {
    record?: any;
    label?: string;
    icon?: ReactElement;
    resource: 'triggers' | 'runs';
    runtime?: string;
    runSchema: any;
    taskSchema: any;
    prepare: (r: any) => any;
}) => {
    const {
        record,
        label,
        icon,
        resource,
        runtime = '',
        runSchema,
        taskSchema,
        prepare,
    } = props;

    return (
        <CreateInDialogButton
            resource={resource}
            label={label}
            icon={icon}
            record={record}
            fullWidth
            maxWidth={'lg'}
            transform={prepare}
            closeOnClickOutside={false}
        >
            {runSchema?.schema &&
                taskSchema?.schema &&
                (resource === 'triggers' ? (
                    <TriggerCreateForm
                        runSchema={runSchema.schema}
                        taskSchema={taskSchema.schema}
                    />
                ) : (
                    <RunCreateForm
                        runtime={runtime}
                        runSchema={runSchema.schema}
                        taskSchema={taskSchema.schema}
                    />
                ))}
        </CreateInDialogButton>
    );
};
