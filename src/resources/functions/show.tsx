import { JsonSchemaField } from '../../components/JsonSchema';
import { Box, Container, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    DeleteWithConfirmButton,
    EditButton,
    Labeled,
    LoadingIndicator,
    RecordContextProvider,
    ResourceContextProvider,
    ShowBase,
    ShowView,
    TabbedShowLayout,
    TextField,
    TopToolbar,
    useDataProvider,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import {
    MetadataSchema,
    createMetadataViewUiSchema,
} from '../../common/schemas';
import { FlatCard } from '../../components/FlatCard';
import { VersionsListWrapper } from '../../components/VersionsList';
import { ShowPageTitle } from '../../components/PageTitle';
import { TaskAndRuns } from './TaskAndRuns';
import { getFunctionUiSpec } from './types';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { FunctionIcon } from './icon';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { SourceCodeBlock } from '../../components/SourceCodeBlock';

const ShowComponent = () => {
    const resource = useResourceContext();
    const record = useRecordContext();
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const schemaProvider = useSchemaProvider();

    const kind = record?.kind || undefined;
    const [spec, setSpec] = useState<any>();
    const [tasks, setTasks] = useState<any>([]);
    const [sourceCode, setSourceCode] = useState<any>();

    // const { data, isLoading, error } = useGetList('tasks', {
    //     filter: {
    //         function: `${record?.kind}://${record?.project}/${record?.name}:${record?.id}`,
    //     },
    // });
    useEffect(() => {
        if (!schemaProvider || !dataProvider) {
            return;
        }

        if (record?.spec?.source) {
            setSourceCode(record.spec.source);
        }

        if (record && tasks.length == 0) {
            schemaProvider.get(resource, record.kind).then(s => {
                console.log('spec', s);
                setSpec(s);
            });

            Promise.all([
                schemaProvider.list('tasks', record.kind).then(schemas => {
                    console.log('schema  for ' + record.kind, schemas);
                    return schemas?.map(s => s.kind);
                }),

                dataProvider.getList('tasks', {
                    pagination: { page: 1, perPage: 100 },
                    sort: { field: 'kind', order: 'ASC' },
                    filter: {
                        function: `${record.kind}://${record.project}/${record.name}:${record.id}`,
                    },
                }),
            ])
                .then(([kinds, list]) => {
                    console.log('kinds', kinds);
                    console.log('list', list);

                    if (!kinds || !list || !list.data) {
                        return;
                    }

                    //check if some tasks are still missing
                    const missing = kinds.filter(
                        k => !list.data.find(t => t.kind == k)
                    );
                    console.log('missing', missing);
                    if (missing.length == 0) {
                        //all tasks defined
                        list.data.sort((a, b) => {
                            return a.kind.localeCompare(b.kind);
                        });

                        setTasks(list.data);
                        return;
                    }

                    //create missing tasks
                    Promise.all(
                        missing.map(async k => {
                            return await dataProvider.create('tasks', {
                                data: {
                                    project: record.project,
                                    kind: k,
                                    spec: {
                                        function: `${record.kind}://${record.project}/${record.name}:${record.id}`,
                                    },
                                },
                            });
                        })
                    )
                        .then(records => {
                            const rts = records
                                .filter(r => r.data)
                                .map(r => r.data);
                            const res = list.data.concat(rts);
                            res.sort((a, b) => {
                                return a.kind.localeCompare(b.kind);
                            });
                            setTasks(res);
                        })
                        .catch(e => {
                            throw e;
                        });
                })
                .catch(error => {
                    console.log(error);
                });

            // const mapTask = {};
            // getTaskByFunction(record?.kind)?.forEach(async kind => {
            //     //task=profile
            //     //check task for function contains a task with kind of profile
            //     let typeTask = data?.find(data => kind === data.kind);
            //     if (!typeTask) {
            //         //crealo con await su dataprovider
            //         const task = await dataProvider.create('tasks', {
            //             data: {
            //                 project: record?.project,
            //                 kind: kind,
            //                 spec: {
            //                     function: `${record?.kind}://${record?.project}/${record?.name}:${record?.id}`,
            //                 },
            //             },
            //         });
            //         //  .then(response => console.log(response))
            //         //array locale
            //         if (task) {
            //             mapTask[kind] = typeTask;
            //         }
            //     } else {
            //         console.log(
            //             'kind' + kind + ' presente' + JSON.stringify(data)
            //         );
            //         mapTask[kind] = typeTask;
            //     }
            // });
            // //setTask con array locale + task esistenti in data. Uso mappa per tipo {profile: {...}, validate: {{}}}
            // setTasks(mapTask);
        }
    }, [record, schemaProvider, dataProvider]);

    // if (isLoading) {
    //   return <></>;
    // }

    if (!record) {
        return <LoadingIndicator />;
    }

    const getUiSpec = (kind: string) => {
        const uiSpec = getFunctionUiSpec(kind) || {};
        if (sourceCode) {
            //hide source field
            uiSpec['source'] = {
                'ui:widget': 'hidden',
            };
        }

        return uiSpec;
    };

    console.log('tasks', tasks);

    return (
        <TabbedShowLayout syncWithLocation={false} record={record}>
            <TabbedShowLayout.Tab label={translate('fields.summary')}>
            <Stack direction={'row'} spacing={3}>
                    <Labeled>
                        <TextField source="kind" />
                    </Labeled>

                    <Labeled>
                        <TextField source="id" />
                    </Labeled>
                </Stack>

                <TextField source="key" />

                <JsonSchemaField
                    source="metadata"
                    schema={MetadataSchema}
                    uiSchema={createMetadataViewUiSchema(record.metadata)}
                    label={false}
                />
                {spec && (
                    <JsonSchemaField
                        source="spec"
                        schema={spec.schema}
                        uiSchema={getUiSpec(kind)}
                        label={false}
                    />
                )}
            </TabbedShowLayout.Tab>

            {sourceCode && (
                <TabbedShowLayout.Tab
                    label={'fields.code'}
                    key={record.id + ':source_code'}
                >
                    <SourceCodeView sourceCode={sourceCode} />
                </TabbedShowLayout.Tab>
            )}

            {tasks?.map(task => (
                <TabbedShowLayout.Tab
                    label={'resources.tasks.kinds.' + task.kind}
                    key={task.kind}
                >
                    <ResourceContextProvider value="tasks">
                        <RecordContextProvider value={task}>
                            <TaskAndRuns key={task.id} />
                        </RecordContextProvider>
                    </ResourceContextProvider>
                </TabbedShowLayout.Tab>
            ))}
        </TabbedShowLayout>
    );
};

const SourceCodeView = (props: { sourceCode: any }) => {
    const { sourceCode } = props;
    console.log('source', sourceCode);
    const code = sourceCode.code
        ? sourceCode.code
        : sourceCode.base64
        ? atob(sourceCode.base64)
        : '';

    const values = {
        ...{ sourceCode },
        source: sourceCode.source || '-',
        lang: sourceCode.lang || 'unknown',
    };

    return (
        <RecordContextProvider value={values}>
            <TopToolbar>
                <InspectButton showCopyButton={false} />
            </TopToolbar>
            <Stack direction={'row'} spacing={3} color={'gray'}>
                <Labeled>
                    <TextField source="lang" record={values} />
                </Labeled>

                <Labeled>
                    <TextField source="source" record={values} />
                </Labeled>
            </Stack>
            <Box sx={{ pt: 2 }}>
                <Labeled label="fields.code">
                    <SourceCodeBlock
                        code={code}
                        showLineNumbers={true}
                        showCopyButton={false}
                        maxWidth={'lg'}
                    />
                </Labeled>
            </Box>
        </RecordContextProvider>
    );
};

const ShowToolbar = () => (
    <TopToolbar>
        <BackButton />
        <EditButton style={{ marginLeft: 'auto' }} />
        <InspectButton />
        <ExportRecordButton language="yaml" color="info" />
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
