import { TaskEditComponent, TaskShowComponent } from '../tasks';
import {
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    Labeled,
    List,
    SimpleShowLayout,
    TextField,
    TopToolbar,
    useGetResourceLabel,
    useRecordContext,
} from 'react-admin';
import { Stack, Typography } from '@mui/material';
import {
    CreateInDialogButton,
    EditInDialogButton,
    ShowInDialogButton,
} from '@dslab/ra-dialog-crud';
import { InspectButton } from '@dslab/ra-inspect-button';
import { RowButtonGroup } from '../../components/RowButtonGroup';
import { StateChips } from '../../components/StateChips';

import { LogsButton } from '../../components/LogsButton';
import { RunCreateForm, RunShowComponent } from '../runs';
import { filterProps } from '../../common/schemas';
import { useGetManySchemas } from '../../controllers/schemaController';
import { Empty } from '../../components/Empty';

export const TaskAndRuns = (props: {
    task?: string;
    onEdit: (id: string, data: any) => void;
}) => {
    const { task, onEdit } = props;
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
                    maxWidth={'lg'}
                    transform={prepare}
                    mutationMode="pessimistic"
                    mutationOptions={{
                        onSuccess: (data, variables, context) => {
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
                        <TextField source="kind" />
                    </Labeled>
                    <Labeled>
                        <TextField source="id" />
                    </Labeled>
                </Stack>
                <Labeled>
                    <TextField source="key" />
                </Labeled>
            </SimpleShowLayout>
            <TaskRunList />
        </>
    );
};

const TaskRunList = () => {
    const record = useRecordContext();

    const getResourceLabel = useGetResourceLabel();
    const label = getResourceLabel('runs', 2);

    const fn = record?.spec?.function || '';
    const url = new URL(fn);
    const runtime = url.protocol
        ? url.protocol.substring(0, url.protocol.length - 1)
        : '';
    url.protocol = record.kind + ':';
    const key = url.toString();

    const {
        data: schemas,
        isLoading,
        error,
    } = useGetManySchemas([
        { resource: 'functions', runtime },
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

    const CreateActionButton = () => (
        <CreateInDialogButton
            resource="runs"
            record={partial}
            fullWidth
            maxWidth={'lg'}
            transform={prepare}
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

    return (
        <>
            <Typography variant="h4" color={'secondary.main'}>
                {label}
            </Typography>

            <List
                resource="runs"
                sort={{ field: 'created', order: 'DESC' }}
                filter={{ task: key }}
                disableSyncWithLocation
                empty={
                    <Empty>
                        <CreateActionButton />
                    </Empty>
                }
                actions={<CreateActionButton />}
            >
                <Datagrid bulkActionButtons={false}>
                    <DateField source="metadata.created" />
                    <TextField source="id" />
                    <StateChips source="status.state" />
                    <RowButtonGroup label="⋮">
                        <ShowInDialogButton>
                            <RunShowComponent />
                        </ShowInDialogButton>
                        <LogsButton />
                        <InspectButton fullWidth />
                        <DeleteWithConfirmButton redirect={false} />
                    </RowButtonGroup>
                </Datagrid>
            </List>
        </>
    );
};
