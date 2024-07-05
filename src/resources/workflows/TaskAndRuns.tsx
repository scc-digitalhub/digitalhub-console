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
    useTranslate,
} from 'react-admin';
import { Box, Divider, Stack, Typography } from '@mui/material';
import {
    CreateInDialogButton,
    EditInDialogButton,
    ShowInDialogButton,
} from '@dslab/ra-dialog-crud';
import { InspectButton } from '@dslab/ra-inspect-button';
import { useState } from 'react';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { RowButtonGroup } from '../../components/RowButtonGroup';
import { StateChips } from '../../components/StateChips';
import InboxIcon from '@mui/icons-material/Inbox';

import { WorkflowView } from './WorkflowView';
import { useGetManySchemas } from '../../controllers/schemaController';
import { filterProps } from '../../common/schemas';
import { RunCreateComponent } from '../runs';
import { LogsButton } from '../../components/LogsButton';

export const TaskAndRuns = (props: {
    task?: string;
    onEdit: (id: string, data: any) => void;
}) => {
    const { task, onEdit } = props;
    const getResourceLabel = useGetResourceLabel();

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
                    mutationOptions={{
                        onSuccess: (data, variables, context) => {
                            //data is updated
                            if (task && data) onEdit(task, data);
                        },
                    }}
                >
                    <TaskEditComponent />
                </EditInDialogButton>
                <InspectButton />
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
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    const label = getResourceLabel('runs', 2);
    const [schema] = useState<any>();
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
        { resource: 'workflows', runtime },
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
        kind: schema ? schema.kind : 'run',
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
                ...r.spec,
            },
        };
    };

    const getExpandArea = () => {
        return record.kind === 'kfp+pipeline' ? <WorkflowView /> : <></>;
    };
    const canExpand = () => {
        return record.kind === 'kfp+pipeline';
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
                <RunCreateComponent
                    runSchema={runSchema.schema}
                    taskSchema={taskSchema.schema}
                />
            )}

        </CreateInDialogButton>
    );
    const ListActions = () => <CreateActionButton />;
    const Empty = () => (
        <Box textAlign="center" m={'auto'} sx={{ color: 'grey.500' }}>
            <InboxIcon fontSize="large" sx={{ width: '9em', height: '9em' }} />
            <Typography variant="h4" paragraph>
                {translate('resources.runs.empty')}
            </Typography>
            <Typography variant="body1">
                {translate('resources.runs.create')}
            </Typography>
            <CreateActionButton />
        </Box>
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
                empty={<Empty />}
                actions={<ListActions />}
            >
                <Datagrid
                    expand={getExpandArea()}
                    expandSingle={canExpand()}
                    bulkActionButtons={false}
                >
                    <DateField source="metadata.created" />
                    <TextField source="id" />
                    <StateChips source="status.state" />
                    <RowButtonGroup label="⋮">
                        <ShowInDialogButton>
                            <SimpleShowLayout>
                                <Stack direction={'row'} spacing={3}>
                                    <Labeled>
                                        <TextField source="name" />
                                    </Labeled>

                                    <Labeled>
                                        <TextField source="kind" />
                                    </Labeled>
                                </Stack>
                                <Labeled>
                                    <TextField source="key" />
                                </Labeled>
                                <Divider />
                                <Stack direction={'row'} spacing={3}>
                                    <Labeled>
                                        <DateField
                                            source="metadata.created"
                                            showDate
                                            showTime
                                        />
                                    </Labeled>

                                    <Labeled>
                                        <DateField
                                            source="metadata.updated"
                                            showDate
                                            showTime
                                        />
                                    </Labeled>
                                </Stack>
                                <Labeled>
                                    <TextField source="spec.task" />
                                </Labeled>
                                <Labeled>
                                    <StateChips source="status.state" />
                                </Labeled>
                            </SimpleShowLayout>
                        </ShowInDialogButton>
                        <LogsButton />
                        <InspectButton />
                        <DeleteWithConfirmButton redirect={false} />
                    </RowButtonGroup>
                </Datagrid>
            </List>
        </>
    );
};