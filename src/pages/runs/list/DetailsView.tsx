// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    ShowButton,
    SimpleList,
    useGetResourceLabel,
    useListContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { Alert, Box, Stack, Typography, useTheme } from '@mui/material';
import { StateChips } from '../../../common/components/StateChips';
import {
    formatDateDifference,
    formatDuration,
} from '../../../common/utils/helpers';
import { functionParser, taskParser } from '../../../common/utils/parsers';
import { FunctionIcon } from '../../functions/icon';
import { MetricsField } from '../../../features/k8smetrics/MetricsField';
import { endStates } from '../../../common/components/RunStateBadge';
import { SiKubernetes } from 'react-icons/si';
import { BsGpuCard } from 'react-icons/bs';
import { BsCpuFill } from 'react-icons/bs';
import { GrStorage } from 'react-icons/gr';
import SignpostIcon from '@mui/icons-material/Signpost';

const enableMetrics: string =
    (globalThis as any).REACT_APP_ENABLE_METRICS ||
    (process.env.REACT_APP_ENABLE_METRICS as string) ||
    false;

export const DetailsView = (props: { storeKey?: string }) => {
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
            {record.status.state === 'RUNNING' && enableMetrics && (
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
