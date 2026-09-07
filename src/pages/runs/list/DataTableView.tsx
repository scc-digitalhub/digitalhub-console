// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    DataTable,
    DateField,
    DeleteWithConfirmButton,
    FunctionField,
    ShowButton,
} from 'react-admin';
import { Stack, Typography } from '@mui/material';
import { RowButtonGroup } from '../../../common/components/buttons/RowButtonGroup';
import { StateChips } from '../../../common/components/StateChips';
import { BulkDeleteAllVersionsButton } from '../../../common/components/buttons/delete/BulkDeleteAllVersionsButton';
import { BulkStopButton } from '../components/BulkStopButton';
import { formatDuration } from '../../../common/utils/helpers';
import { functionParser } from '../../../common/utils/parsers';
import { FunctionIcon } from '../../functions/icon';
import { WorkflowIcon } from '../../workflows/icon';
import { MetricsField } from '../../../features/k8smetrics/MetricsField';
import { ChipsField } from '../../../common/components/fields/ChipsField';

const enableMetrics: string =
    (globalThis as any).REACT_APP_ENABLE_METRICS ||
    (process.env.REACT_APP_ENABLE_METRICS as string) ||
    false;
const RUN_METRICS: string =
    (globalThis as any).REACT_APP_RUN_METRICS ||
    (process.env.REACT_APP_RUN_METRICS as string) ||
    null;

const RowActions = () => {
    return (
        <RowButtonGroup>
            <ShowButton />
            <DeleteWithConfirmButton redirect={false} />
        </RowButtonGroup>
    );
};

export const DataTableView = (props: { storeKey?: string }) => {
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
            {enableMetrics && (
                <DataTable.Col
                    source="metrics"
                    disableSort
                    label="fields.metrics.title"
                >
                    <FunctionField
                        label="fields.metrics.title"
                        render={r =>
                            r.status.state === 'RUNNING' ? (
                                <MetricsField
                                    size="small"
                                    fontSize={'small'}
                                    metrics={
                                        RUN_METRICS
                                            ? RUN_METRICS.split(',')
                                            : true
                                    }
                                />
                            ) : null
                        }
                    />
                </DataTable.Col>
            )}
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
