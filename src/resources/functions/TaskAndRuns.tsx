import { TaskEditComponent, TaskShowComponent } from '../tasks';
import {
    Button,
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    Labeled,
    List,
    SaveButton,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
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
import { JsonSchemaInput } from '../../components/JsonSchema';
import { StateChips } from '../../components/StateChips';
import InboxIcon from '@mui/icons-material/Inbox';

import {
    getRunSchemaUI,
    getTaskSchemaUI,
    runSpecUiSchemaFactory,
} from '../runs/types';
import { checkCpuRequestError } from '../../components/resourceInput/CoreResourceCpuWidget';
import { checkGpuRequestError } from '../../components/resourceInput/CoreResourceGpuWidget';
import { checkMemRequestError } from '../../components/resourceInput/CoreResourceMemWidget';
import { LogsButton } from '../../components/LogsButton';
import {
    MetadataCreateUiSchema,
    MetadataSchema,
    createMetadataViewUiSchema,
} from '../../common/schemas';
import { JsonSchemaField } from '@dslab/ra-jsonschema-input';
import { StepperForm, StepContent } from '@dslab/ra-stepper';

export const TaskAndRuns = (props: { task?: string }) => {
    const { task } = props;

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
    const schemaProvider = useSchemaProvider();
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    const label = getResourceLabel('runs', 2);
    const [runSchema, setRunSchema] = useState<any>();
    const [taskSchema, setTaskSchema] = useState<any>();
    const fn = record?.spec?.function || '';
    const url = new URL(fn);
    const runtime = url.protocol
        ? url.protocol.substring(0, url.protocol.length - 1)
        : '';
    url.protocol = record.kind + ':';
    const key = url.toString();
    useEffect(() => {
        if (!schemaProvider || !record || !fn) {
            return;
        }

        Promise.all([
            schemaProvider.list('runs', runtime),
            schemaProvider.list('tasks', runtime),
            schemaProvider.list('functions', runtime),
        ]).then(([rSchemas, tSchemas,fSchemas]) => {
            console.log("rschema",rSchemas);
            console.log("tschema",tSchemas);
            console.log("fschema",fSchemas);
            //get schemas for task run and function of runtime
            if (tSchemas && rSchemas&& fSchemas) {
                // get the right schema based on kind ( run and function have single schema)
                const schemaTask = tSchemas.find(schema => schema.kind === record.kind)
                const schemaRun = rSchemas.pop();
                const schemaFunction = fSchemas.pop();
                if (schemaTask)
                    {
                    let rProp = schemaRun?.schema?.properties;
                    let tProp={};
                    //save task properties (all kind of tasks) and remove them from run schema
                    tSchemas.forEach(element => {
                        Object.entries(element?.schema?.properties).forEach(([key, value], index) => {
                            if (rProp[key])
                            {
                             if (element.kind===record.kind)
                                 tProp[key]=value;
                             delete rProp[key];
                            }
                        }) 
                    }); 
                    Object.entries(schemaFunction?.schema?.properties).forEach(([key, value], index) => {
                        if (rProp[key])
                        {
                         delete rProp[key];
                        }
                    })
                    schemaTask.schema.properties=tProp;
                    setTaskSchema(schemaTask);
                    console.log("tschema",schemaTask);
                    schemaRun.schema.properties=rProp;
                    setRunSchema(schemaRun);
                    console.log("rschema",schemaRun);
            }
            }                
        }).catch(error => {
                console.log('error:', error);
            });
        // schemaProvider
        // .list('runs', runtime)
        // .then(schemas => {
        //     if (schemas) {
        //         setSchema(schemas.pop());
        //     }
        // }).then(()=>{
        //     schemaProvider
        // .list('tasks', runtime)
        // .then(schemas => {
        //     if (schemas) {
        //         setSchema(schemas.pop());
        //     }
        // })
        // .catch(error => {
        //     console.log('error:', error);
        // });
    }, [record, schemaProvider]);

    const partial = {
        project: record?.project,
        kind: runSchema ? runSchema.kind : 'run',
        spec: {
            task: key,
            local_execution: false,
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

    function customValidate(formData, errors, uiSchema) {
        if (checkCpuRequestError(formData)) {
            errors.k8s.resources.cpu.requests.addError(
                translate('resources.tasks.errors.requestMinorLimits')
            );
        }
        if (checkMemRequestError(formData)) {
            errors.k8s.resources.mem.requests.addError(
                translate('resources.tasks.errors.requestMinorLimits')
            );
        }
        if (checkGpuRequestError(formData)) {
            errors.k8s.resources.gpu.requests.addError('');
        }
        return errors;
    }

    const CreateActionButton = () => (
        <CreateInDialogButton
            resource="runs"
            record={partial}
            fullWidth
            maxWidth={'lg'}
            transform={prepare}
        >
            {runSchema?.schema && (
                <StepperForm>
                    <StepContent label="TaskSchema">
                        <JsonSchemaInput
                            source="spec.task"
                            schema={taskSchema.schema}
                            // uiSchema={getTaskSchemaUI(taskSchema.schema, record)}
                            // customValidate={customValidate}
                        />
                    </StepContent>
                    <StepContent label="Spec">
                        <JsonSchemaInput
                            source="spec.run"
                            schema={runSchema.schema}
                        />
                    </StepContent>
                    <StepContent label="Recap">
                        <JsonSchemaField
                            source="metadata"
                            schema={MetadataSchema}
                            uiSchema={createMetadataViewUiSchema(
                                record?.metadata
                            )}
                            label={false}
                        />
                        <JsonSchemaField
                            source="spec"
                            schema={runSchema.schema}
                            uiSchema={getTaskSchemaUI(runSchema.schema, record)}
                        />
                    </StepContent>
                </StepperForm>
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

const CreateRunDialogToolbar = () => (
    <Toolbar>
        <SaveButton alwaysEnable />
    </Toolbar>
);
