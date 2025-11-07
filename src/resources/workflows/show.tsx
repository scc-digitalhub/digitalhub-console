// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import {
    Labeled,
    LoadingIndicator,
    ShowBase,
    ShowView,
    TabbedShowLayout,
    TextField,
    useDataProvider,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { FlatCard } from '../../components/FlatCard';
import { VersionsListWrapper } from '../../components/VersionsList';
import { ShowPageTitle } from '../../components/PageTitle';
import { toYaml } from '@dslab/ra-export-record-button';
import { WorkflowIcon } from './icon';
import { useSchemaProvider } from '../../provider/schemaProvider';

import deepEqual from 'deep-is';

import { MetadataField } from '../../components/MetadataField';
import { AceEditorField } from '@dslab/ra-ace-editor';
import { IdField } from '../../components/IdField';
import { ShowToolbar } from '../../components/toolbars/ShowToolbar';
import { RunStateBadge } from '../../components/RunStateBadge';
import { WorkflowTaskShow } from './tasks';
import { countLines } from '../../common/helper';
import { SourceCodeView } from '../../components/SourceCodeView';

const ShowComponent = () => {
    const resource = useResourceContext();
    const record = useRecordContext();
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const schemaProvider = useSchemaProvider();
    const [spec, setSpec] = useState<any>();
    const [tasks, setTasks] = useState<string[]>([]);
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

        if (record && resource) {
            cur.current = record;

            schemaProvider.get(resource, record.kind).then(s => {
                setSpec(s);
            });

            Promise.all([
                schemaProvider.list('tasks', record.kind).then(schemas => {
                    const v = schemas?.map(s => s.kind);
                    if (!v) {
                        return null;
                    }

                    v.sort((a, b) => {
                        return a.localeCompare(b);
                    });

                    return v;
                }),

                dataProvider.getList('tasks', {
                    pagination: { page: 1, perPage: 100 },
                    sort: { field: 'kind', order: 'ASC' },
                    filter: {
                        workflow: `${record.kind}://${record.project}/${record.name}:${record.id}`,
                    },
                }),
            ])
                .then(([kinds, list]) => {
                    if (!kinds || !list || !list.data) {
                        return;
                    }

                    //check if some tasks are still missing
                    const missing = kinds.filter(
                        k => !list.data.find(t => t.kind == k)
                    );
                    if (missing.length == 0) {
                        //all tasks defined
                        setTasks(kinds);
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
                                        workflow: `${record.kind}://${record.project}/${record.name}:${record.id}`,
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
                            setTasks(res.map(r => r.kind));
                        })
                        .catch(e => {
                            throw e;
                        });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [record, schemaProvider, dataProvider, resource]);

    if (!record) {
        return <LoadingIndicator />;
    }

    const getAction = (kind: string) => {
        if (kind.indexOf('+') > 0) {
            return kind.split('+')[1];
        }
        return kind;
    };

    const recordSpec = record?.spec;
    const lineCount = countLines(recordSpec);

    return (
        <TabbedShowLayout record={record} syncWithLocation={false}>
            <TabbedShowLayout.Tab label={translate('fields.summary')}>
                <Stack direction={'row'} spacing={3}>
                    <Labeled>
                        <TextField source="kind" />
                    </Labeled>

                    <Labeled>
                        <IdField source="id" />
                    </Labeled>
                </Stack>

                <IdField source="key" />

                <MetadataField />
            </TabbedShowLayout.Tab>
            {spec && (
                <TabbedShowLayout.Tab label={translate('fields.spec.title')}>
                    <Box sx={{ width: '100%' }}>
                        <AceEditorField
                            width="100%"
                            source="spec"
                            parse={toYaml}
                            mode="yaml"
                            minLines={lineCount[0]}
                            maxLines={lineCount[1]}
                        />
                    </Box>
                </TabbedShowLayout.Tab>
            )}

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
                <TabbedShowLayout.Tab
                    label={
                        <Stack direction="row" sx={{ alignItems: 'center' }}>
                            {/* <RunStateBadge
                                sx={{ marginRight: '9px' }}
                                getListFilters={{
                                    task: `${task.kind}://${task.project}/${task.id}`,
                                }}
                            /> */}
                            {translate(
                                'resources.tasks.kinds.' + getAction(task)
                            )}
                        </Stack>
                    }
                    key={task}
                    path={task}
                >
                    <WorkflowTaskShow kind={task} />
                </TabbedShowLayout.Tab>
            ))}
        </TabbedShowLayout>
    );
};

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
                        aside={
                            <VersionsListWrapper
                                leftIcon={() => <RunStateBadge />}
                            />
                        }
                    >
                        <ShowComponent />
                    </ShowView>
                </>
            </ShowBase>
        </Container>
    );
};
