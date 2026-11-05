// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Datagrid,
    DateField,
    FunctionField,
    IconButtonWithTooltip,
    Labeled,
    ListContextProvider,
    LoadingIndicator,
    Pagination,
    ResourceContextProvider,
    TextField,
    useCreatePath,
    useDataProvider,
    useList,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { CustomTabbedShowLayout } from '../../common/components/CustomTabbedShowLayout';
import { Divider, Stack, Typography } from '@mui/material';
import { StateChips } from '../../common/components/StateChips';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { IdField } from '../../common/components/fields/IdField';
import { functionParser, taskParser } from '../../common/utils/parsers';

import { useGetRunIds } from './hooks/useGetRunIds';
import { useTriggerRunsController } from './hooks/useTriggerRunsController';
import { MetadataTab } from '../../common/components/tabs/metadata';
import { SpecTab } from '../../common/components/tabs/spec';
import { FunctionIcon } from '../functions/icon';
import { useEffect, useState } from 'react';
import { WorkflowIcon } from '../workflows/icon';

export const TriggerShow = () => {
    const record = useRecordContext();
    const translate = useTranslate();
    const createPath = useCreatePath();
    const navigate = useNavigate();
    const dataProvider = useDataProvider();

    const [functionKey, setFunctionKey] = useState<any>();
    const [workflowKey, setWorkflowKey] = useState<any>();

    useEffect(() => {
        if (record) {
            //function
            const fk = record?.spec?.function
                ? functionParser(record?.spec?.function)
                : null;
            if (fk?.id) {
                setFunctionKey(fk);
            } else if (dataProvider && fk && !fk.id) {
                //resolve latest by name
                dataProvider
                    .getList('functions', {
                        filter: { name: fk.name },
                        sort: { field: 'created', order: 'DESC' },
                        pagination: { page: 1, perPage: 1 },
                    })
                    .then(({ data }) => {
                        if (data.length > 0) {
                            fk.id = data[0].id;
                            setFunctionKey(fk);
                        }
                    })
                    .catch(() => {});
            }

            //workflow
            const wk = record?.spec?.workflow
                ? functionParser(record?.spec?.workflow)
                : null;
            if (wk?.id) {
                setWorkflowKey(wk);
            } else if (dataProvider && wk && !wk.id) {
                //resolve latest by name
                dataProvider
                    .getList('workflows', {
                        filter: { name: wk.name },
                        sort: { field: 'created', order: 'DESC' },
                        pagination: { page: 1, perPage: 1 },
                    })
                    .then(({ data }) => {
                        if (data.length > 0) {
                            wk.id = data[0].id;
                            setWorkflowKey(wk);
                        }
                    })
                    .catch(() => {});
            }
        }
    }, [record, dataProvider]);

    if (!record) return <LoadingIndicator />;

    return (
        <CustomTabbedShowLayout record={record} syncWithLocation={false}>
            <CustomTabbedShowLayout.Tab
                value="summary"
                label={translate('fields.summary')}
            >
                <Stack direction={'row'} spacing={3}>
                    <Labeled>
                        <TextField source="kind" label="fields.kind" />
                    </Labeled>
                    <Labeled>
                        <IdField source="id" />
                    </Labeled>
                </Stack>
                <Labeled>
                    <IdField source="key" />
                </Labeled>

                <Divider />

                <Stack direction={'row'} gap={1} alignItems="center">
                    {functionKey && (
                        <Labeled label="fields.function.title">
                            <Stack
                                direction={'row'}
                                gap={1}
                                alignItems="center"
                            >
                                <FunctionIcon
                                    kind={functionKey.kind}
                                    color={'secondary'}
                                />

                                <span>
                                    {functionKey.name}
                                    {functionKey.id && (
                                        <IconButtonWithTooltip
                                            label="ra.action.show"
                                            color="primary"
                                            onClick={() => {
                                                const path = createPath({
                                                    resource: 'functions',
                                                    id: functionKey.id,
                                                    type: 'show',
                                                });

                                                navigate(path);
                                            }}
                                        >
                                            <OpenInNewIcon fontSize="small" />
                                        </IconButtonWithTooltip>
                                    )}
                                </span>
                            </Stack>
                        </Labeled>
                    )}
                    {workflowKey && (
                        <Labeled label="fields.workflow.title">
                            <Stack
                                direction={'row'}
                                gap={1}
                                alignItems="center"
                            >
                                <WorkflowIcon color={'secondary'} />

                                <span>
                                    {workflowKey.name}
                                    {workflowKey.id && (
                                        <IconButtonWithTooltip
                                            label="ra.action.show"
                                            color="primary"
                                            onClick={() => {
                                                const path = createPath({
                                                    resource: 'workflows',
                                                    id: workflowKey.id,
                                                    type: 'show',
                                                });

                                                navigate(path);
                                            }}
                                        >
                                            <OpenInNewIcon fontSize="small" />
                                        </IconButtonWithTooltip>
                                    )}
                                </span>
                            </Stack>
                        </Labeled>
                    )}
                    <Labeled>
                        <TextField
                            source="spec.task"
                            label="fields.spec.task.title"
                        />
                    </Labeled>
                </Stack>

                <Labeled>
                    <StateChips
                        source="status.state"
                        label="fields.status.state"
                    />
                </Labeled>
                {record?.status?.transitions && <EventsList record={record} />}
            </CustomTabbedShowLayout.Tab>
            <CustomTabbedShowLayout.Tab value="metadata" label="metadata">
                <MetadataTab />
            </CustomTabbedShowLayout.Tab>
            <CustomTabbedShowLayout.Tab
                value="spec"
                label={translate('fields.spec.title')}
            >
                <SpecTab />
            </CustomTabbedShowLayout.Tab>

            <CustomTabbedShowLayout.Tab
                value="runs"
                label={translate('resources.runs.name', { smart_count: 2 })}
            >
                <GeneratedRunsList />
            </CustomTabbedShowLayout.Tab>
        </CustomTabbedShowLayout>
    );
};

const GeneratedRunsList = () => {
    const translate = useTranslate();
    const result = useGetRunIds();
    const listContext = useTriggerRunsController(result);

    const renderFunctionName = record => {
        if (record?.spec?.function) {
            return <>{functionParser(record.spec.function).name}</>;
        }

        if (record?.spec?.workflow) {
            return <>{functionParser(record.spec.workflow).name}</>;
        }

        return <></>;
    };

    return (
        <ListContextProvider value={listContext}>
            <Typography variant="h6" gutterBottom>
                {translate('resources.runs.name', { smart_count: 2 })}
            </Typography>
            <ResourceContextProvider value="runs">
                <>
                    <Datagrid bulkActionButtons={false} rowClick="show">
                        <TextField source="id" label="fields.id" />
                        <DateField
                            source="metadata.created"
                            label="fields.created.title"
                            showDate
                            showTime
                        />
                        <DateField
                            source="metadata.updated"
                            label="fields.updated.title"
                            showDate
                            showTime
                        />
                        <FunctionField
                            source="spec.function"
                            label="fields.function.title"
                            sortable={false}
                            render={renderFunctionName}
                        />
                        <TextField source="kind" label="fields.kind" />
                        <FunctionField
                            source="spec.task"
                            label="fields.task.title"
                            sortable={false}
                            render={record =>
                                record?.spec?.task ? (
                                    <>{taskParser(record.spec.task).kind}</>
                                ) : (
                                    <></>
                                )
                            }
                        />
                        <StateChips
                            source="status.state"
                            label="fields.status.state"
                        />
                    </Datagrid>
                    <Pagination />
                </>
            </ResourceContextProvider>
        </ListContextProvider>
    );
};

const EventsList = (props: { record: any }) => {
    const { record } = props;
    const data = record?.status?.transitions ? record.status.transitions : [];
    const listContext = useList({ data });
    return (
        <Labeled label="fields.events.title">
            <ListContextProvider value={listContext}>
                <Datagrid bulkActionButtons={false} rowClick={false}>
                    <DateField
                        showTime
                        source="time"
                        label="fields.events.time.title"
                    />
                    <StateChips
                        source="status"
                        sortable={false}
                        label="fields.events.status.title"
                    />
                    <TextField
                        source="message"
                        sortable={false}
                        label="fields.events.message.title"
                    />
                    <TextField
                        source="details"
                        sortable={false}
                        label="fields.events.details.title"
                    />
                </Datagrid>
            </ListContextProvider>
        </Labeled>
    );
};
