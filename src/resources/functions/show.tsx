import { JsonSchemaField } from '@dslab/ra-jsonschema-input';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Container, Grid, Stack, Typography } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import {
    DeleteWithConfirmButton,
    EditButton,
    Labeled,
    RecordContextProvider,
    ShowBase,
    ShowView,
    SimpleShowLayout,
    TabbedShowLayout,
    TextField,
    TopToolbar,
    useDataProvider,
    useGetList,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { arePropsEqual } from '../../common/helper';
import { MetadataSchema, createMetadataViewUiSchema } from '../../common/types';
import { FlatCard } from '../../components/FlatCard';
import { VersionsListWrapper } from '../../components/VersionsList';
import { ShowPageTitle } from '../../components/PageTitle';
import { TaskAndRun } from './TaskAndRun';
import { getFunctionSpec, getFunctionUiSpec, getTaskByFunction } from './types';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { FunctionIcon } from './icon';

const ShowComponent = () => {
    const record = useRecordContext();
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const kind = record?.kind || undefined;
    const [tasks, setTasks] = useState<any>();
    const { data, isLoading, error } = useGetList('tasks', {
        filter: {
            function: `${record?.kind}://${record?.project}/${record?.name}:${record?.id}`,
        },
    });
    // useEffect(() => {
    //     if (!isLoading && data && record) {
    //         const mapTask = {};
    //         getTaskByFunction(record?.kind)?.forEach(async kind => {
    //             //task=profile
    //             //check task for function contains a task with kind of profile
    //             let typeTask = data?.find(data => kind === data.kind);
    //             if (!typeTask) {
    //                 //crealo con await su dataprovider
    //                 const task = await dataProvider.create('tasks', {
    //                     data: {
    //                         project: record?.project,
    //                         kind: kind,
    //                         spec: {
    //                             function: `${record?.kind}://${record?.project}/${record?.name}:${record?.id}`,
    //                         },
    //                     },
    //                 });
    //                 //  .then(response => console.log(response))
    //                 //array locale
    //                 if (task) {
    //                     mapTask[kind] = typeTask;
    //                 }
    //             } else {
    //                 console.log(
    //                     'kind' + kind + ' presente' + JSON.stringify(data)
    //                 );
    //                 mapTask[kind] = typeTask;
    //             }
    //         });
    //         //setTask con array locale + task esistenti in data. Uso mappa per tipo {profile: {...}, validate: {{}}}
    //         setTasks(mapTask);
    //     }
    // }, [dataProvider, data, isLoading]);

    // if (isLoading) {
    //   return <></>;
    // }

    if (error) {
        return <p>ERROR</p>;
    }
    if (!record) return <></>;

    return (
        <TabbedShowLayout syncWithLocation={false} record={record}>
            <TabbedShowLayout.Tab label={translate('fields.summary')}>
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
                    <JsonSchemaField
                        source="metadata"
                        schema={MetadataSchema}
                        uiSchema={createMetadataViewUiSchema(record.metadata)}
                        label={false}
                    />
                    <JsonSchemaField
                        source="spec"
                        schema={getFunctionSpec(kind)}
                        uiSchema={getFunctionUiSpec(kind)}
                        label={false}
                    />
                </SimpleShowLayout>
            </TabbedShowLayout.Tab>
            {/* {getTaskByFunction(record?.kind).map((item, index) => (
                <TabbedShowLayout.Tab label={item} key={index}>
                    <div>
                        <RecordContextProvider value={tasks[item]}>
                            <TaskAndRun key={item.id} />
                        </RecordContextProvider>
                    </div>
                </TabbedShowLayout.Tab>
            ))} */}
        </TabbedShowLayout>
    );
};

const ShowToolbar = () => (
    <TopToolbar>
        <BackButton />
        <EditButton style={{ marginLeft: 'auto' }} />
        <InspectButton />
        <ExportRecordButton language="yaml" />
        <DeleteWithConfirmButton />
    </TopToolbar>
);

export const FunctionShow = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBase>
                <>
                    <ShowPageTitle icon={<FunctionIcon fontSize={'large'} />} />
                    <ShowView
                        actions={<ShowToolbar />}
                        sx={{
                            width: '100%',
                            '& .RaShow-main': {
                                display: 'grid',
                                gridTemplateColumns: { lg: '1fr 350px' },
                                gridTemplateRows: {
                                    xs: 'repeat(1, 1fr)',
                                    lg: '',
                                },
                                gap: 2,
                            },
                        }}
                        component={FlatCard}
                        aside={<VersionsListWrapper />}
                    >
                        <ShowComponent />
                    </ShowView>
                </>
            </ShowBase>
        </Container>
    );
};
