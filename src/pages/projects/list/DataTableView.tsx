// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    BulkDeleteButton,
    DataTable,
    DateField,
    DeleteWithConfirmButton,
    FunctionField,
    useCreatePath,
    useGetList,
    useGetResourceLabel,
    useNotify,
    useRecordContext,
} from 'react-admin';
import { ChipsField } from '../../../common/components/fields/ChipsField';
import { StateColors } from '../../../common/components/StateChips';
import { RowButtonGroup } from '../../../common/components/buttons/RowButtonGroup';
import { useProjectPermissions } from '../../../common/provider/authProvider';
import { useRootSelector } from '@dslab/ra-root-selector';
import { MetricsField } from '../../../features/k8smetrics/MetricsField';
import { useNavigate } from 'react-router-dom';
import { Chip, Tooltip } from '@mui/material';
import { Stack } from '@mui/system';

const enableMetrics: string =
    (globalThis as any).REACT_APP_ENABLE_METRICS ||
    (process.env.REACT_APP_ENABLE_METRICS as string) ||
    false;

const PROJECT_METRICS: string =
    (globalThis as any).REACT_APP_PROJECT_METRICS ||
    (process.env.REACT_APP_PROJECT_METRICS as string) ||
    null;

const RowActions = () => (
    <RowButtonGroup>
        <DeleteWithConfirmButton mutationMode="pessimistic" />
    </RowButtonGroup>
);

export const DataTableView = (props: { storeKey?: string }) => {
    const { storeKey } = props;
    const { selectRoot } = useRootSelector();
    const notify = useNotify();

    const { hasAccess } = useProjectPermissions();
    const getResourceLabel = useGetResourceLabel();
    const runsLabel = getResourceLabel('run', 2);

    const handleClick = id => {
        if (id) {
            const project = { id: id as string };

            if (!hasAccess(project.id)) {
                notify('ra.notification.not_authorized', {
                    type: 'error',
                });
            }

            selectRoot(project);
        }
    };

    return (
        <DataTable
            storeKey={storeKey}
            rowClick={id => {
                handleClick(id);
                return false;
            }}
            bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />}
            hiddenColumns={['metadata.created']}
        >
            <DataTable.Col source="name" label="fields.name.title" />
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

            <DataTable.Col source="runs" disableSort label={runsLabel}>
                <Stack direction="row" spacing={1}>
                    <RunStateBadge />
                    <RunStateBadge state="ERROR" />
                    <RunStateBadge state="COMPLETED" />
                </Stack>
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
            <DataTable.Col source="metrics" label="fields.metrics.title">
                <FunctionField
                    render={record => {
                        hasAccess(record.id) && enableMetrics && (
                            <MetricsField
                                size="small"
                                metrics={
                                    PROJECT_METRICS
                                        ? PROJECT_METRICS.split(',')
                                        : true
                                }
                            />
                        );
                    }}
                />
            </DataTable.Col>
            <DataTable.Col>
                <RowActions />
            </DataTable.Col>
        </DataTable>
    );
};

const RunStateBadge = (props: { state?: string }) => {
    const { state = 'RUNNING' } = props;
    const createPath = useCreatePath();
    const navigate = useNavigate();
    const record = useRecordContext();
    const MAX = 99;

    const { total, isPending } = useGetList('runs', {
        pagination: { page: 1, perPage: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: {
            project: record?.id || null,
            state,
        },
    });

    if (isPending || !total) return null;

    const handleClick = (event, state: string) => {
        event.stopPropagation();
        event.preventDefault();

        let filter = { state, project: record?.id || null };

        const link =
            createPath({ type: 'list', resource: 'runs' }) +
            '?filter=' +
            encodeURIComponent(JSON.stringify(filter));

        navigate(link);
    };

    return (
        <Tooltip title={`${total} ${state}`} placement="top">
            <Chip
                color={StateColors[state]}
                size="small"
                label={total <= MAX ? total : `${MAX}+`}
                onClick={e => handleClick(e, state)}
                sx={{
                    '.MuiChip-label': {
                        fontSize: '12px',
                        lineHeight: '12px',
                        paddingX: '6px',
                    },
                    height: '20px',
                }}
            />
        </Tooltip>
    );
};

export const activeStates = [
    'RUNNING',
    'PENDING',
    'UPLOADING',
    'BUILT',
    'CREATED',
    'READY',
];
export const endStates = ['COMPLETED', 'ERROR', 'STOPPED', 'DELETED'];
