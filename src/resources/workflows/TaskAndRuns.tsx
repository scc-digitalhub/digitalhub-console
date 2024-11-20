import { TaskEditComponent, TaskShowComponent } from '../tasks';
import {
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    FunctionField,
    Labeled,
    List,
    ShowButton,
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
import { ReactElement, useState } from 'react';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { RowButtonGroup } from '../../components/RowButtonGroup';
import { StateChips } from '../../components/StateChips';
import InboxIcon from '@mui/icons-material/Inbox';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { WorkflowView } from './WorkflowView';
import { useGetManySchemas } from '../../controllers/schemaController';
import { filterProps } from '../../common/schemas';
import { LogsButton } from '../../components/LogsButton';
import { Empty } from '../../components/Empty';
import { RunCreateForm } from '../runs/create';
import { DropDownButton } from '../../components/DropdownButton';
import { StopButton } from '../runs/StopButton';

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
                    mutationMode="pessimistic"
                    mutationOptions={{
                        onSuccess: (data, variables, context) => {
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
    const fn = record?.spec?.workflow || '';
    const url = new URL(fn);
    const runtime = url.protocol
        ? url.protocol.substring(0, url.protocol.length - 1)
        : '';
    url.protocol = record.kind + ':';
    const key = `${record.kind}://${record.project}/${record.id}`;

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
        kind: runSchema ? runSchema.kind : 'run',
        spec: {
            task: key,
            local_execution: false,
            //copy the task spec  (using record)
            ...record?.spec,
        },
    };
    console.log('par', partial);
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

    const getExpandArea = () => {
        return record.kind === 'kfp+pipeline' ? <WorkflowView /> : <></>;
    };
    const canExpand = () => {
        return record.kind === 'kfp+pipeline';
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

            <List
                resource="runs"
                sort={{ field: 'created', order: 'DESC' }}
                filter={{ task: key }}
                disableSyncWithLocation
                empty={
                    <Empty>
                        <CreateActionButton record={partial} />
                    </Empty>
                }
                actions={<CreateActionButton record={partial} />}
            >
                <Datagrid bulkActionButtons={false} rowClick={false}>
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
                    <RowButtonGroup label="⋮">
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
            </List>
        </>
    );
};
