// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { JsonSchemaField } from '../../components/JsonSchema';
import { Container, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import {
    Labeled,
    LoadingIndicator,
    RecordContextProvider,
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
import { FlatCard } from '../../components/FlatCard';
import { VersionsListWrapper } from '../../components/VersionsList';
import { ShowPageTitle } from '../../components/PageTitle';
import { getFunctionUiSpec } from './types';
import { InspectButton } from '@dslab/ra-inspect-button';
import { FunctionIcon } from './icon';
import { useSchemaProvider } from '../../provider/schemaProvider';
import deepEqual from 'deep-is';
import { MetadataField } from '../../components/MetadataField';
import { IdField } from '../../components/IdField';
import { ShowToolbar } from '../../components/toolbars/ShowToolbar';
import { FunctionTaskShow } from './tasks';

const ShowComponent = () => {
    const resource = useResourceContext();
    const record = useRecordContext();
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const schemaProvider = useSchemaProvider();

    const kind = record?.kind || undefined;
    const [spec, setSpec] = useState<any>();
    const [tasks, setTasks] = useState<string[]>([]);
    const [sourceCode, setSourceCode] = useState<any>();
    const [fabSourceCode, setFabSourceCode] = useState<any>();
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
        if (record?.spec?.fab_source) {
            setFabSourceCode(record.spec.fab_source);
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
                        function: `${record.kind}://${record.project}/${record.name}:${record.id}`,
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

    //TODO refactor!
    const getUiSpec = (kind: string) => {
        const uiSpec = getFunctionUiSpec(kind) || {};
        if (sourceCode) {
            //hide source field
            uiSpec['source'] = {
                'ui:widget': 'hidden',
            };
        }
        if (fabSourceCode) {
            //hide source field
            uiSpec['fab_source'] = {
                'ui:widget': 'hidden',
            };
        }

        return uiSpec;
    };

    const getAction = (kind: string) => {
        if (kind.indexOf('+') > 0) {
            return kind.split('+')[1];
        }
        return kind;
    };

    return (
        <TabbedShowLayout record={record} syncWithLocation={false}>
            <TabbedShowLayout.Tab label={translate('fields.summary')}>
                <Stack direction={'row'} spacing={3}>
                    <Labeled>
                        <TextField source="kind" label="fields.kind" />
                    </Labeled>

                    <Labeled>
                        <IdField source="id" />
                    </Labeled>
                </Stack>

                <IdField source="key" />

                <MetadataField />

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
                    <SourceCodeTab sourceCode={sourceCode} spec={spec} />
                </TabbedShowLayout.Tab>
            )}
            {fabSourceCode && (
                <TabbedShowLayout.Tab
                    label={'fields.code'}
                    key={record.id + ':source_code'}
                    path="code"
                >
                    <SourceCodeTab fabSourceCode={fabSourceCode} spec={spec} />
                </TabbedShowLayout.Tab>
            )}

            {tasks?.map(task => (
                <TabbedShowLayout.Tab
                    label={'resources.tasks.kinds.' + getAction(task)}
                    key={task}
                    path={task}
                >
                    <FunctionTaskShow kind={task} />
                </TabbedShowLayout.Tab>
            ))}
        </TabbedShowLayout>
    );
};

export const SourceCodeTab = (props: {
    sourceCode?: any;
    fabSourceCode?: any;
    spec: any;
}) => {
    const { sourceCode, fabSourceCode, spec } = props;
    const record = useRecordContext();
    const uiSchema = getFunctionUiSpec(record?.kind) || {};
    const values = { spec: { source: sourceCode, fab_source: fabSourceCode } };
    const schema = spec ? JSON.parse(JSON.stringify(spec.schema)) : {};
    if ('properties' in schema) {
        if (sourceCode) {
            schema.properties = { source: spec?.schema.properties.source };
        }
        if (fabSourceCode) {
            schema.properties = {
                fab_source: spec?.schema.properties.fab_source,
            };
        }
    }

    return (
        <RecordContextProvider value={values}>
            <TopToolbar>
                <InspectButton showCopyButton={false} />
            </TopToolbar>
            {spec && (
                <JsonSchemaField
                    source="spec"
                    schema={{ ...schema, title: '' }}
                    uiSchema={uiSchema}
                    label={false}
                />
            )}
        </RecordContextProvider>
    );
};

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
