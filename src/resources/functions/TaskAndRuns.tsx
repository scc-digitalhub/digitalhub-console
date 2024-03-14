import { TaskEdit, TaskEditComponent, TaskShowComponent } from '../tasks';
import {
    ChipField,
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    Empty,
    EmptyClasses,
    FunctionField,
    Labeled,
    List,
    ListNoResults,
    RecordContextProvider,
    ResourceContextProvider,
    SaveButton,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    Toolbar,
    TopToolbar,
    useGetResourceLabel,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { Box, Stack, Typography } from '@mui/material';
import {
    CreateInDialogButton,
    EditInDialogButton,
    ShowInDialogButton,
} from '@dslab/ra-dialog-crud';
import { InspectButton } from '@dslab/ra-inspect-button';
import { Inbox } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { RowButtonGroup } from '../../components/RowButtonGroup';

export const TaskAndRuns = () => {
    const record = useRecordContext();
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    const label = getResourceLabel('task', 1);
    return (
        <>
            {/* <Typography variant="h5">
                {record &&
                    translate('pageTitle.show.title', {
                        resource: label,
                        name: record.kind,
                    })}
            </Typography> */}
            <TopToolbar>
                <ShowInDialogButton fullWidth maxWidth={'lg'}>
                    <TaskShowComponent />
                </ShowInDialogButton>
                <EditInDialogButton fullWidth maxWidth={'lg'}>
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
    const [schema, setSchema] = useState<any>();
    const fn = record?.spec?.function || '';
    const url = new URL(fn);
    url.protocol = record.kind;
    const key = url.toString();
    const runtime = 'dbt';

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
                console.log(error);
            });
    }, [record, schemaProvider]);

    const partial = {
        project: record?.project,
        kind: schema ? schema.kind : 'run',
        spec: {},
    };

    const prepare = (r: any) => {
        return {
            ...r,
            spec: {
                task: key,
            },
        };
    };

    return (
        <>
            <CreateInDialogButton
                resource="runs"
                record={partial}
                fullWidth
                maxWidth={'lg'}
                transform={prepare}
            >
                <SimpleForm toolbar={<CreateRunDialogToolbar />}>
                    <TextInput source="kind" readOnly />
                </SimpleForm>
            </CreateInDialogButton>
            <List
                resource="runs"
                sort={{ field: 'created', order: 'DESC' }}
                filter={{ task: key }}
                disableSyncWithLocation
            >
                <Datagrid bulkActionButtons={false}>
                    <DateField source="metadata.created" />
                    <TextField source="id" />
                    <TextField source="status.state" />
                    <FunctionField
                        source="status.state"
                        render={(record: any) => <ChipField />}
                    />
                    <RowButtonGroup label="⋮">
                        <ShowInDialogButton>
                            <SimpleShowLayout>
                                <TextField source="key" />
                            </SimpleShowLayout>
                        </ShowInDialogButton>
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
