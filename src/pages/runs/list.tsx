// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    FunctionField,
    ListView,
    SelectInput,
    ShowButton,
    TextField,
    TextInput,
    useGetList,
    useLocaleState,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { Box, Container, Stack, Typography } from '@mui/material';
import yamlExporter from '@dslab/ra-export-yaml';
import { useCallback, useMemo } from 'react';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { ListPageTitle } from '../../common/components/layout/PageTitle';
import { RowButtonGroup } from '../../common/components/buttons/RowButtonGroup';
import { StateChips, StateColors } from '../../common/components/StateChips';
import { RunIcon } from './icon';
import { BulkDeleteAllVersionsButton } from '../../common/components/buttons/delete/BulkDeleteAllVersionsButton';
import { BulkStopButton } from './components/BulkStopButton';
import { useRootSelector } from '@dslab/ra-root-selector';
import {
    formatDuration,
    FUNCTION_OR_WORKFLOW,
} from '../../common/utils/helpers';
import { functionParser } from '../../common/utils/parsers';
import { ListBaseLive } from '../../features/notifications/components/ListBaseLive';
import { useKinds } from '../../common/hooks/useKinds';
import { FILTER_INPUT_PROPS } from '../../common/theme';
import { FunctionIcon } from '../functions/icon';
import { WorkflowIcon } from '../workflows/icon';
import { MetricsField } from '../../features/k8smetrics/MetricsField';

const allStateChoices = Object.keys(StateColors).map(s => ({
    id: s,
    name: 'states.' + s.toLowerCase(),
}));

const RowActions = () => {
    return (
        <RowButtonGroup>
            <ShowButton />
            <DeleteWithConfirmButton redirect={false} />
        </RowButtonGroup>
    );
};

export const RunList = () => {
    const resource = useResourceContext();
    const { root } = useRootSelector();
    const kinds = useKinds();
    const translate = useTranslate();
    const [localeState] = useLocaleState();
    const locale = localeState?.startsWith('it') ? 'it' : 'en';

    const sortedStateChoices = useMemo(
        () =>
            [...allStateChoices].sort((a, b) =>
                translate(a.name).localeCompare(translate(b.name), locale)
            ),
        [translate, locale]
    );

    const functionSelectOption = useCallback(
        d => ({
            ...d,
            data: d.data?.map(record => ({
                name: record.name,
                id: `function_${record.kind}://${record.project}/${record.name}`,
            })),
        }),
        []
    );

    const workflowSelectOption = useCallback(
        d => ({
            ...d,
            data: d.data?.map(record => ({
                name: record.name,
                id: `workflow_${record.kind}://${record.project}/${record.name}`,
            })),
        }),
        []
    );

    const { data: functions } = useGetList(
        'functions',
        { pagination: { page: 1, perPage: 100 } },
        { select: functionSelectOption }
    );
    const { data: workflows } = useGetList(
        'workflows',
        { pagination: { page: 1, perPage: 100 } },
        { select: workflowSelectOption }
    );

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ListBaseLive
                exporter={yamlExporter}
                sort={{ field: 'metadata.created', order: 'DESC' }}
                storeKey={`${root}.${resource}.listParams`}
                queryOptions={{ meta: { root } }}
            >
                <>
                    <ListPageTitle icon={<RunIcon fontSize={'large'} />} />

                    <FlatCard>
                        <ListView
                            filters={
                                kinds && functions && workflows
                                    ? [
                                          <TextInput
                                              label="ra.action.search"
                                              source="q"
                                              alwaysOn
                                              resettable
                                              key="q"
                                          />,
                                          <SelectInput
                                              key="kind"
                                              label="fields.kind"
                                              source="kind"
                                              choices={kinds.map(s => ({
                                                  id: s,
                                                  name: s,
                                              }))}
                                              {...FILTER_INPUT_PROPS}
                                          />,
                                          <SelectInput
                                              key="state"
                                              label="fields.status.state"
                                              source="state"
                                              choices={sortedStateChoices}
                                              optionText={choice => (
                                                  <StateChips
                                                      record={choice}
                                                      source="id"
                                                      label="name"
                                                      size="small"
                                                  />
                                              )}
                                              {...FILTER_INPUT_PROPS}
                                          />,
                                          <SelectInput
                                              key={FUNCTION_OR_WORKFLOW}
                                              label={`${translate(
                                                  'resources.functions.name',
                                                  { smart_count: 1 }
                                              )}/${translate(
                                                  'resources.workflows.name',
                                                  { smart_count: 1 }
                                              )}`}
                                              source={FUNCTION_OR_WORKFLOW}
                                              choices={[
                                                  ...functions,
                                                  ...workflows,
                                              ]}
                                              {...FILTER_INPUT_PROPS}
                                          />,
                                      ]
                                    : undefined
                            }
                            actions={false}
                            component={Box}
                            sx={{ pb: 2 }}
                        >
                            <Datagrid
                                rowClick="show"
                                bulkActionButtons={
                                    <>
                                        <BulkStopButton />
                                        <BulkDeleteAllVersionsButton />
                                    </>
                                }
                            >
                                <FunctionField
                                    source="spec.function"
                                    label="fields.name.title"
                                    sortable={false}
                                    render={record => (
                                        <Stack gap={1}>
                                            <TextField
                                                source="name"
                                                label="fields.name"
                                                variant="body1"
                                            />
                                            {record?.spec?.function && (
                                                <Stack direction="row" gap={1}>
                                                    <FunctionIcon
                                                        fontSize="small"
                                                        color="info"
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        color="info"
                                                    >
                                                        {
                                                            functionParser(
                                                                record.spec
                                                                    .function
                                                            ).name
                                                        }
                                                    </Typography>
                                                </Stack>
                                            )}
                                            {record?.spec?.workflow && (
                                                <Stack direction="row" gap={1}>
                                                    <WorkflowIcon
                                                        fontSize="small"
                                                        color="info"
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        color="info"
                                                    >
                                                        {
                                                            functionParser(
                                                                record.spec
                                                                    .workflow
                                                            ).name
                                                        }
                                                    </Typography>
                                                </Stack>
                                            )}
                                        </Stack>
                                    )}
                                />
                                <DateField
                                    source="metadata.created"
                                    label="fields.created.title"
                                    showDate
                                    showTime
                                />
                                <FunctionField
                                    label="fields.duration.title"
                                    sortable={false}
                                    render={record =>
                                        record.status?.state === 'RUNNING'
                                            ? formatDuration(
                                                  Date.now() -
                                                      new Date(
                                                          record.metadata.created
                                                      ).getTime()
                                              ).asString
                                            : formatDuration(
                                                  new Date(
                                                      record.metadata.updated
                                                  ).getTime() -
                                                      new Date(
                                                          record.metadata.created
                                                      ).getTime()
                                              ).asString
                                    }
                                />
                                <TextField source="kind" label="fields.kind" />
                                <StateChips
                                    source="status.state"
                                    label="fields.status.state"
                                />
                                <FunctionField
                                    label="fields.metrics.title"
                                    render={r =>
                                        r.status.state === 'RUNNING' ? (
                                            <MetricsField
                                                size="small"
                                                fontSize={'small'}
                                            />
                                        ) : null
                                    }
                                />

                                <RowActions />
                            </Datagrid>
                        </ListView>
                    </FlatCard>
                </>
            </ListBaseLive>
        </Container>
    );
};
