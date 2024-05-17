import { TaskEditComponent, TaskShowComponent } from '../tasks';
import {
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

import { runSpecUiSchemaFactory } from '../runs/types';
import { checkCpuRequestError } from '../../components/resourceInput/CoreResourceCpuWidget';
import { checkGpuRequestError } from '../../components/resourceInput/CoreResourceGpuWidget';
import { checkMemRequestError } from '../../components/resourceInput/CoreResourceMemWidget';
import { LogsButton } from '../../components/LogsButton';

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
    const [schema, setSchema] = useState<any>();
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

        schemaProvider
            .list('runs', runtime)
            .then(schemas => {
                if (schemas) {
                    setSchema(schemas.pop());
                }
            })
            .catch(error => {
                console.log('error:', error);
            });
    }, [record, schemaProvider]);

    const partial = {
        project: record?.project,
        kind: schema ? schema.kind : 'run',
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
            <SimpleForm toolbar={<CreateRunDialogToolbar />}>
                <TextInput source="kind" readOnly />
                {schema?.schema && (
                    <JsonSchemaInput
                        source="spec"
                        schema={schema.schema}
                        uiSchema={runSpecUiSchemaFactory(record.kind)}
                        customValidate={customValidate}
                    />
                )}
            </SimpleForm>
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
