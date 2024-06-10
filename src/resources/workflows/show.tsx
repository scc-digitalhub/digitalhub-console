import { JsonSchemaField } from '../../components/JsonSchema';
import { Box, Container, Stack, Typography, Divider } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
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
    SimpleForm,
    TextInput,
    Datagrid,
    DateField,
    SimpleShowLayout,
    List,
    Toolbar,
    SaveButton,
} from 'react-admin';
import {
    MetadataSchema,
    createMetadataViewUiSchema,
} from '../../common/schemas';
import { FlatCard } from '../../components/FlatCard';
import { VersionsListWrapper } from '../../components/VersionsList';
import { ShowPageTitle } from '../../components/PageTitle';
import { TaskAndRuns } from './TaskAndRuns';
import { getWorkflowUiSpec } from './types';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { WorkflowIcon } from './icon';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { WorkflowView } from './WorkflowView';

import { RowButtonGroup } from '../../components/RowButtonGroup';
import { JsonSchemaInput } from '../../components/JsonSchema';
import { StateChips } from '../../components/StateChips';

import InboxIcon from '@mui/icons-material/Inbox';

import deepEqual from 'deep-is';

import {
    CreateInDialogButton,
    ShowInDialogButton,
} from '@dslab/ra-dialog-crud';
import { AceEditorField } from '../../components/AceEditorField';

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
    const initializing = useRef<boolean>(false);
    const cur = useRef<any>(null);

    const isInitializing = () => {
        return initializing.current === true;
    };

    const acquireInitializing = () => {
        if (!initializing.current) {
            initializing.current = true;
            return initializing.current;
        }

        return false;
    };

    useEffect(() => {
        if (!schemaProvider || !dataProvider || !record) {
            return;
        }

        if (cur.current != null && !deepEqual(cur.current, record)) {
            //reloading, reset
            console.log('reloading');
            cur.current = null;
            if (isInitializing()) {
                initializing.current = false;
            }
        }

        //single loading
        if (isInitializing() || !acquireInitializing()) {
            return;
        }

        if (record?.spec?.source) {
            setSourceCode(record.spec.source);
        }

        if (record) {
            cur.current = record;

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
        }
    }, [record, schemaProvider, dataProvider]);

    // if (isLoading) {
    //   return <></>;
    // }

    if (!record) {
        return <LoadingIndicator />;
    }

    const getUiSpec = (kind: string) => {
        const uiSpec = getWorkflowUiSpec(kind) || {};
        if (sourceCode) {
            //hide source field
            uiSpec['source'] = {
                'ui:widget': 'hidden',
            };
        }

        return uiSpec;
    };

    const getKind = (kind: string) => {
        if (kind.indexOf('+') > 0) {
            return kind.split('+')[1];
        }
        return kind;
    };

    return (
        <TabbedShowLayout record={record}>
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
                        schema={{ ...spec.schema, title: 'Spec' }}
                        uiSchema={getUiSpec(kind)}
                        label={false}
                    />
                )}
            </TabbedShowLayout.Tab>

            {sourceCode && (
                <TabbedShowLayout.Tab
                    label={'fields.code'}
                    key={record.id + ':source_code'}
                    path="code"
                >
                    <SourceCodeView sourceCode={sourceCode} />
                </TabbedShowLayout.Tab>
            )}

            {tasks?.map(task => (
                // <TabbedShowLayout.Tab
                //     label={'resources.workflows.tab.runs'}
                //     key={'runs'}
                //     path={'runs'}
                // >
                //     <ResourceContextProvider value="tasks">
                //         <RecordContextProvider value={task}>
                //             <WorkflowRunList key={task.id} />
                //         </RecordContextProvider>
                //     </ResourceContextProvider>
                // </TabbedShowLayout.Tab>
                <TabbedShowLayout.Tab
                    label={'resources.tasks.kinds.' + getKind(task.kind)}
                    key={task.kind}
                    path={task.kind}
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
                <Box sx={{ pt: 2 }}>
                    <Labeled label="fields.code">
                        <AceEditorField
                            mode={sourceCode.lang}
                            source="sourceCode.base64"
                            theme="monokai"
                        />
                    </Labeled>
                </Box>
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

export const WorkflowShow = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBase>
                <>
                    <ShowPageTitle icon={<WorkflowIcon fontSize={'large'} />} />
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

const WorkflowRunList = () => {
    const record = useRecordContext();
    const schemaProvider = useSchemaProvider();
    const translate = useTranslate();
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
        },
    };

    const prepare = (r: any) => {
        return {
            ...r,
            spec: {
                task: key,
            },
        };
    };

    const runSpecUiSchema = {
        task: {
            'ui:readonly': true,
        },
    };

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
                        uiSchema={runSpecUiSchema}
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
    const WorkflowViewWrapper = () => <WorkflowView record={record} />;

    return (
        <>
            <List
                resource="runs"
                sort={{ field: 'created', order: 'DESC' }}
                filter={{ task: key }}
                disableSyncWithLocation
                empty={<Empty />}
                actions={<ListActions />}
            >
                <Datagrid
                    expand={WorkflowViewWrapper}
                    expandSingle={true}
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
