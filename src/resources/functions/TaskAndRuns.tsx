import { TaskEditComponent, TaskShowComponent } from '../tasks';
import {
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    FormDataConsumer,
    Labeled,
    List,
    RecordContextProvider,
    SaveButton,
    SimpleShowLayout,
    TextField,
    Toolbar,
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
import { useEffect, useState } from 'react';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { RowButtonGroup } from '../../components/RowButtonGroup';
import { StateChips } from '../../components/StateChips';
import InboxIcon from '@mui/icons-material/Inbox';

import { checkCpuRequestError } from '../../jsonSchema/CoreResourceCpuWidget';
import { checkGpuRequestError } from '../../jsonSchema/CoreResourceGpuWidget';
import { checkMemRequestError } from '../../jsonSchema/CoreResourceMemWidget';
import { LogsButton } from '../../components/LogsButton';
import { StepperForm } from '@dslab/ra-stepper';
import { getTaskUiSpec } from '../tasks/types';
import { JsonSchemaField, JsonSchemaInput } from '../../components/JsonSchema';
import { RunCreateComponent, RunShowComponent } from '../runs';
import { filterProps } from '../../common/schemas';
import { useGetManySchemas } from '../../controllers/schemaController';

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
    // const schemaProvider = useSchemaProvider();
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    const label = getResourceLabel('runs', 2);
    // const [runSchema, setRunSchema] = useState<any>();
    // const [taskSchema, setTaskSchema] = useState<any>();
    const fn = record?.spec?.function || '';
    const url = new URL(fn);
    const runtime = url.protocol
        ? url.protocol.substring(0, url.protocol.length - 1)
        : '';
    url.protocol = record.kind + ':';
    const key = url.toString();
    // useEffect(() => {
    //     if (!schemaProvider || !record || !fn) {
    //         return;
    //     }

    //     Promise.all([
    //         schemaProvider.list('runs', runtime),
    //         schemaProvider.list('tasks', runtime),
    //         schemaProvider.list('functions', runtime),
    //     ])
    //         .then(([rSchemas, tSchemas, fSchemas]) => {
    //             console.log('rschema', rSchemas);
    //             console.log('tschema', tSchemas);
    //             console.log('fschema', fSchemas);
    //             //get schemas for task run and function of runtime
    //             if (tSchemas && rSchemas && fSchemas) {
    //                 // get the right schema based on kind ( run and function have single schema)
    //                 const schemaTask = tSchemas.find(
    //                     schema => schema.kind === record.kind
    //                 );
    //                 const schemaRun = rSchemas.pop();
    //                 const schemaFunction = fSchemas.pop();

    //                 //keep unfiltered by default
    //                 let schemaSpec = schemaRun.schema;

    //                 //filter function props
    //                 if (schemaFunction) {
    //                     schemaSpec = filterProps(
    //                         schemaSpec,
    //                         schemaFunction.schema
    //                     );
    //                 }

    //                 //filter all task props
    //                 tSchemas.forEach(e => {
    //                     schemaSpec = filterProps(schemaSpec, e.schema);
    //                 });

    //                 schemaRun.schema = schemaSpec;

    //                 //store
    //                 setTaskSchema(schemaTask);
    //                 setRunSchema(schemaRun);

    //                 // if (schemaTask) {
    //                 //     let rProp = schemaRun?.schema?.properties;
    //                 //     let tProp = {};
    //                 //     let allOfT = schemaRun?.schema?.allOf?.find(
    //                 //         a => a.title == schemaTask?.schema?.title
    //                 //     );
    //                 //     //save task properties (all kind of tasks)
    //                 //     tSchemas.forEach(element => {
    //                 //         if (element.kind === record.kind)
    //                 //             Object.entries(
    //                 //                 element?.schema?.properties
    //                 //             ).forEach(([key, value], index) => {
    //                 //                 if (rProp[key]) {
    //                 //                     tProp[key] = value;
    //                 //                     delete rProp[key];
    //                 //                 }
    //                 //                 if (key in allOfT?.properties) {
    //                 //                     delete allOfT.properties[key];
    //                 //                 }
    //                 //             });
    //                 //     });
    //                 //     //and remove function
    //                 //     let allOfFn = schemaRun?.schema?.allOf?.find(
    //                 //         a => a.title == schemaFunction?.schema?.title
    //                 //     );
    //                 //     Object.entries(
    //                 //         schemaFunction?.schema?.properties
    //                 //     ).forEach(([key, value], index) => {
    //                 //         //remove from properties
    //                 //         if (rProp[key]) {
    //                 //             delete rProp[key];
    //                 //         }
    //                 //         //remove validation rules
    //                 //         if (key in allOfFn?.properties) {
    //                 //             delete allOfFn.properties[key];
    //                 //         }
    //                 //     });
    //                 //     //and remove them from run schema
    //                 //     tSchemas.forEach(element => {
    //                 //         if (element.kind !== record.kind)
    //                 //             Object.entries(
    //                 //                 element?.schema?.properties
    //                 //             ).forEach(([key, value], index) => {
    //                 //                 if (rProp[key]) {
    //                 //                     delete rProp[key];
    //                 //                 }
    //                 //             });
    //                 //     });

    //                 //     schemaTask.schema.properties = tProp;
    //                 //     setTaskSchema(schemaTask);
    //                 //     console.log('tschema', schemaTask.schema.properties);
    //                 //     schemaRun.schema.properties = rProp;
    //                 //     setRunSchema(schemaRun);
    //                 //     console.log('rschema', schemaRun.schema.properties);
    //                 // }
    //             }
    //         })
    //         .catch(error => {
    //             console.log('error:', error);
    //         });
    // }, [record, schemaProvider]);

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
                ...r.spec,
            },
        };
    };

    // function customValidate(formData, errors, uiSchema) {
    //     if (checkCpuRequestError(formData)) {
    //         errors.k8s.resources.cpu.requests.addError(
    //             translate('resources.tasks.errors.requestMinorLimits')
    //         );
    //     }
    //     if (checkMemRequestError(formData)) {
    //         errors.k8s.resources.mem.requests.addError(
    //             translate('resources.tasks.errors.requestMinorLimits')
    //         );
    //     }
    //     if (checkGpuRequestError(formData)) {
    //         errors.k8s.resources.gpu.requests.addError('');
    //     }
    //     return errors;
    // }

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
                <Datagrid bulkActionButtons={false}>
                    <DateField source="metadata.created" />
                    <TextField source="id" />
                    <StateChips source="status.state" />
                    <RowButtonGroup label="⋮">
                        <ShowInDialogButton>
                            <RunShowComponent />
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
