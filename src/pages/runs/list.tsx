// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    ColumnsButton,
    DataTable,
    DateField,
    DeleteWithConfirmButton,
    FunctionField,
    ListView,
    SelectInput,
    ShowButton,
    SimpleList,
    TextInput,
    TopToolbar,
    useGetList,
    useGetResourceLabel,
    useListContext,
    useLocaleState,
    useResourceContext,
    useStore,
    useTranslate,
} from 'react-admin';
import {
    Alert,
    Box,
    Container,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
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
    formatDateDifference,
    formatDuration,
    FUNCTION_OR_WORKFLOW,
} from '../../common/utils/helpers';
import { functionParser, taskParser } from '../../common/utils/parsers';
import { ListBaseLive } from '../../features/notifications/components/ListBaseLive';
import { useKinds } from '../../common/hooks/useKinds';
import { FILTER_INPUT_PROPS } from '../../common/theme';
import { FunctionIcon } from '../functions/icon';
import { WorkflowIcon } from '../workflows/icon';
import { MetricsField } from '../../features/k8smetrics/MetricsField';
import {
    View,
    ViewSelector,
    TableViewIcon,
    RowsViewIcon,
} from '../../common/components/buttons/ViewsSelector';
import { ChipsField } from '../../common/components/fields/ChipsField';
import { endStates } from '../../common/components/RunStateBadge';
import { SiKubernetes } from 'react-icons/si';
import { BsGpuCard } from 'react-icons/bs';
import { BsCpuFill } from 'react-icons/bs';
import { GrStorage } from 'react-icons/gr';
import SignpostIcon from '@mui/icons-material/Signpost';

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

const ListToolbar = (props: {
    storeKey?: string;
    views: View[];
    selectedView?: string;
    setSelectedView?: (view: string) => void;
}) => {
    const {
        storeKey,
        views,
        selectedView = 'dataTable',
        setSelectedView,
    } = props;
    return (
        <TopToolbar>
            {selectedView === 'dataTable' && (
                <ColumnsButton
                    storeKey={`${storeKey}.dataTable`}
                    color="secondary"
                />
            )}
            {views && setSelectedView && (
                <ViewSelector
                    views={views}
                    selectedView={selectedView}
                    setSelectedView={setSelectedView}
                />
            )}
        </TopToolbar>
    );
};

export const RunList = () => {
    const resource = useResourceContext();
    const { root } = useRootSelector();
    const kinds = useKinds();
    const translate = useTranslate();
    const [localeState] = useLocaleState();
    const locale = localeState?.startsWith('it') ? 'it' : 'en';
    const storeKey = `${root}.${resource}.list`;
    const [selectedView, setSelectedView] = useStore(
        `${storeKey}.view`,
        'dataTable'
    );

    const views = [
        {
            name: 'dataTable',
            label: 'messages.navigation.table',
            icon: <TableViewIcon />,
        },
        {
            name: 'details',
            label: 'messages.navigation.details',
            icon: <RowsViewIcon />,
        },
    ];

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
                    <ListToolbar
                        storeKey={storeKey}
                        views={views}
                        selectedView={selectedView}
                        setSelectedView={setSelectedView}
                    />
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
                            {selectedView == 'dataTable' && (
                                <DataTableView
                                    storeKey={`${storeKey}.dataTable`}
                                />
                            )}
                            {selectedView == 'details' && (
                                <DetailsView storeKey={`${storeKey}.details`} />
                            )}
                        </ListView>
                    </FlatCard>
                </>
            </ListBaseLive>
        </Container>
    );
};

const DataTableView = (props: { storeKey?: string }) => {
    const { storeKey } = props;

    return (
        <DataTable
            storeKey={storeKey}
            rowClick="show"
            bulkActionButtons={
                <>
                    <BulkStopButton />
                    <BulkDeleteAllVersionsButton />
                </>
            }
            hiddenColumns={[
                'id',
                'metadata.created_by',
                'metadata.updated',
                'metadata.labels',
            ]}
        >
            <DataTable.Col source="name" label="fields.name.title" />
            <DataTable.Col source="id" label="fields.id" />

            <DataTable.Col
                source="function"
                disableSort
                label="fields.function.title"
            >
                <FunctionField
                    source="spec.function"
                    label="fields.name.title"
                    sortable={false}
                    render={record => (
                        <>
                            {record?.spec?.function && (
                                <Stack direction="row" gap={1}>
                                    <FunctionIcon
                                        fontSize="small"
                                        color="info"
                                    />
                                    <Typography variant="body2" color="info">
                                        {
                                            functionParser(record.spec.function)
                                                .name
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
                                    <Typography variant="body2" color="info">
                                        {
                                            functionParser(record.spec.workflow)
                                                .name
                                        }
                                    </Typography>
                                </Stack>
                            )}
                        </>
                    )}
                />
            </DataTable.Col>
            <DataTable.Col source="kind" label="fields.kind" />
            <DataTable.Col
                source="metadata.created"
                label="fields.created.title"
            >
                <DateField
                    source="metadata.created"
                    label="fields.created.title"
                    showDate={true}
                    showTime={true}
                />
            </DataTable.Col>
            <DataTable.Col
                source="metadata.updated"
                label="fields.updated.title"
            >
                <DateField
                    source="metadata.updated"
                    label="fields.updated.title"
                    showDate={true}
                    showTime={true}
                />
            </DataTable.Col>
            <DataTable.Col
                disableSort
                source="metadata.created_by"
                label="fields.user.title"
            />

            <DataTable.Col
                disableSort
                source="duration"
                label="fields.duration.title"
            >
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
                                  new Date(record.metadata.updated).getTime() -
                                      new Date(
                                          record.metadata.created
                                      ).getTime()
                              ).asString
                    }
                />
            </DataTable.Col>

            <DataTable.Col
                source="status.state"
                disableSort
                label="fields.status.state"
            >
                <StateChips source="status.state" label="fields.status.state" />
            </DataTable.Col>
            <DataTable.Col
                source="metrics"
                disableSort
                label="fields.metrics.title"
            >
                <FunctionField
                    label="fields.metrics.title"
                    render={r =>
                        r.status.state === 'RUNNING' ? (
                            <MetricsField size="small" fontSize={'small'} />
                        ) : null
                    }
                />
            </DataTable.Col>
            <DataTable.Col
                source="metadata.labels"
                disableSort
                label="fields.labels.title"
            >
                <ChipsField
                    label="fields.labels.title"
                    source="metadata.labels"
                    sortable={false}
                />
            </DataTable.Col>

            <DataTable.Col>
                <RowActions />
            </DataTable.Col>
        </DataTable>
    );
};

const DetailsView = (props: { storeKey?: string }) => {
    const { storeKey } = props;
    const translate = useTranslate();
    const theme = useTheme();
    const getResourceLabel = useGetResourceLabel();
    const resource = useResourceContext();
    const { total } = useListContext();
    const label = resource
        ? getResourceLabel(resource, total || 1)
        : 'resources.' + resource + '.name';
    const showHeader = (total && total >= 1) || false;

    return (
        <>
            {showHeader && (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontWeight: 'medium' }}
                >
                    {translate('messages.navigation.x-elements', {
                        resource: label,
                        smart_count: total,
                    })}
                </Typography>
            )}

            <SimpleList
                primaryText={record => <DetailsHeader record={record} />}
                secondaryText={record => <DetailsBox record={record} />}
                tertiaryText={() => <ShowButton size="medium" label={''} />}
                leftAvatar={record => {
                    return (
                        <FunctionIcon kind={record.kind} color={'secondary'} />
                    );
                }}
                rowClick={'show'}
                rowSx={() => ({
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '.MuiAvatar-root': {
                        background:
                            theme.palette.mode === 'dark'
                                ? theme.palette.grey[700]
                                : theme.palette.grey[300],
                    },
                })}
            />
        </>
    );
};

const DetailsHeader = ({ record }: { record: any }) => {
    const translate = useTranslate();

    const theme = useTheme();

    return (
        <Stack direction="column" gap={0.3}>
            <Typography variant="body1" color="textDisabled">
                {record?.spec?.task && taskParser(record.spec.task).kind}
                {' / '}
                {record?.spec?.function &&
                    functionParser(record.spec.function).name}
                {record?.spec?.workflow &&
                    functionParser(record.spec.workflow).name}
            </Typography>
            <Stack direction="row" gap={1} alignItems="left">
                <Typography
                    variant="body1"
                    color="secondary"
                    sx={{ fontWeight: 'medium', fontSize: '110%' }}
                >
                    {record.name}
                </Typography>

                {record?.status?.service && (
                    <SignpostIcon
                        color={'action'}
                        fontSize="small"
                        titleAccess={translate('fields.service.title')}
                    />
                )}
                {record?.status?.k8s && (
                    <SiKubernetes
                        color={theme.palette.secondary.main}
                        fontSize={'1.25rem'}
                        title={translate('fields.k8s.resources.title')}
                    />
                )}
                {record?.status?.k8s &&
                    (record.spec?.profile || record.spec.resources?.gpu ? (
                        <BsGpuCard
                            color={theme.palette.info.main}
                            fontSize={'1.25rem'}
                            title={translate('fields.k8s.resources.gpu.title')}
                        />
                    ) : (
                        <BsCpuFill
                            color={theme.palette.info.main}
                            fontSize={'1.25rem'}
                            title={translate('fields.k8s.resources.cpu.title')}
                        />
                    ))}
                {record?.status?.k8s &&
                    (record.spec?.volumes || record.spec.resources?.disk) && (
                        <GrStorage
                            color={theme.palette.info.main}
                            fontSize={'1.25rem'}
                            title={translate('fields.k8s.resources.disk.title')}
                        />
                    )}
            </Stack>
        </Stack>
    );
};

const DetailsBox = ({ record }: { record: any }) => {
    const translate = useTranslate();
    const now = new Date();

    return (
        <Stack direction="column" gap={0.3} mt={0.3}>
            <Stack direction="row" gap={0.3}>
                <Typography variant="body2" color="textDisabled" mb={0.7}>
                    {record?.status?.state &&
                    endStates.includes(record.status.state.toUpperCase())
                        ? formatDateDifference(
                              new Date(record.metadata.updated),
                              now,
                              translate
                          )
                        : formatDateDifference(
                              new Date(record.metadata.created),
                              now,
                              translate
                          )}
                </Typography>
                {' | '}
                <Typography
                    variant="body2"
                    color="secondary"
                    sx={{ fontWeight: 'medium' }}
                >
                    {record.status?.state === 'RUNNING'
                        ? formatDuration(
                              Date.now() -
                                  new Date(record.metadata.created).getTime()
                          ).asString
                        : formatDuration(
                              new Date(record.metadata.updated).getTime() -
                                  new Date(record.metadata.created).getTime()
                          ).asString}
                </Typography>
            </Stack>

            <Box mt={0.3} mb={0.3}>
                <StateChips
                    source="status.state"
                    label="fields.status.state"
                    size="small"
                    // variant="compact"
                />
            </Box>
            {record.status?.message && (
                <Alert
                    icon={false}
                    severity={
                        record.status?.state === 'RUNNING'
                            ? 'info'
                            : record.status?.state === 'ERROR'
                            ? 'error'
                            : record.status?.state === 'COMPLETED'
                            ? 'success'
                            : 'warning'
                    }
                    // variant="outlined"
                >
                    {record.status?.message}
                </Alert>
            )}
            {record.status.state === 'RUNNING' && (
                <Box>
                    <MetricsField
                        sx={{ mt: 1 }}
                        size="small"
                        fontSize={'small'}
                        metrics={true}
                    />
                </Box>
            )}
        </Stack>
    );
};
