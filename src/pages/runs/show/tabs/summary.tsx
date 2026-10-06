// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    IconButtonWithTooltip,
    Labeled,
    LoadingIndicator,
    useRecordContext,
    useCreatePath,
    useTranslate,
    UseRecordContextParams,
} from 'react-admin';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Alert, Stack, Typography } from '@mui/material';
import { functionParser } from '../../../../common/utils/parsers';
import { IdField } from '../../../../common/components/fields/IdField';
import { StateChips } from '../../../../common/components/StateChips';
import {
    formatDateDifference,
    formatDuration,
} from '../../../../common/utils/helpers';
import { FunctionIcon } from '../../../functions/icon';
import { endStates } from '../../../projects/list/DataTableView';
import { WorkflowIcon } from '../../../workflows/icon';
import { useNavigate } from 'react-router-dom';
import { TransitionsList } from './transitions';

export const RunSummary = (props?: UseRecordContextParams) => {
    const record = useRecordContext(props);
    const translate = useTranslate();
    const createPath = useCreatePath();
    const navigate = useNavigate();

    const functionKey = record?.spec?.function
        ? functionParser(record?.spec?.function)
        : null;
    const workflowKey = record?.spec?.workflow
        ? functionParser(record?.spec?.workflow)
        : null;
    const now = new Date();

    if (!record) return <LoadingIndicator />;

    return (
        <Stack direction="column" gap={3}>
            <Stack direction={'row'} spacing={3} alignItems={'center'}>
                {functionKey && (
                    <Labeled label="fields.function.title">
                        <Stack direction={'row'} gap={1} alignItems="center">
                            <FunctionIcon
                                kind={functionKey.kind}
                                color={'secondary'}
                            />

                            <span>
                                {functionKey.name}
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
                            </span>
                        </Stack>
                    </Labeled>
                )}

                {workflowKey && (
                    <Labeled label="fields.workflow.title">
                        <Stack direction={'row'} gap={1} alignItems="center">
                            <WorkflowIcon color={'secondary'} />

                            <span>
                                {workflowKey.name}
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
                            </span>
                        </Stack>
                    </Labeled>
                )}

                <Labeled label="fields.key.title">
                    <IdField source="key" />
                </Labeled>
            </Stack>
            <Stack direction="row" gap={3}>
                <Labeled label="fields.created.title">
                    <Typography variant="body2" mb={0.7}>
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
                        {record?.metadata?.created_by &&
                            ` by ${record.metadata.created_by}`}
                    </Typography>
                </Labeled>
                <Labeled>
                    <StateChips
                        source="status.state"
                        variant="outlined"
                        size="small"
                        fontSize="inherit"
                        label="fields.status.state"
                    />
                </Labeled>
                <Labeled label="fields.duration.title">
                    <Typography
                        variant="body2"
                        color="secondary"
                        sx={{ fontWeight: 'bold' }}
                    >
                        {record.status?.state === 'RUNNING'
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
                              ).asString}
                    </Typography>
                </Labeled>
            </Stack>

            {record.status?.message && (
                <Labeled label="fields.events.message.title">
                    <Alert
                        // icon={false}
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
                </Labeled>
            )}

            {record?.status?.transitions && (
                <TransitionsList record={record} variant="graph" />
            )}
        </Stack>
    );
};
