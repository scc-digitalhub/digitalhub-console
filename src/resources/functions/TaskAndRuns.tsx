import { TaskEdit, TaskEditComponent, TaskShowComponent } from '../tasks';
import {
    Datagrid,
    DateField,
    Empty,
    EmptyClasses,
    Labeled,
    List,
    ListNoResults,
    RecordContextProvider,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
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
                <ShowInDialogButton fullWidth>
                    <TaskShowComponent />
                </ShowInDialogButton>
                <EditInDialogButton fullWidth>
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
    const fn = record?.spec?.function || null;
    if (!fn) {
        return null;
    }

    const url = new URL(fn);
    url.protocol = record.kind;
    console.log('url', url);
    const key = url.toString();
    console.log('key', key);
    return (
        <List
            resource="runs"
            sort={{ field: 'created', order: 'DESC' }}
            filter={{ task: key }}
            disableSyncWithLocation
        >
            <Datagrid bulkActionButtons={false}>
                <DateField source="metadata.created" />
                <TextField source="id" />
                <TextField source="status" />
            </Datagrid>
        </List>
    );
};
