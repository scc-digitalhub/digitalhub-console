// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Stack, Typography, useTheme } from '@mui/material';
import {
    ShowButton,
    SimpleList,
    TextField,
    useGetResourceLabel,
    useListContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { FunctionIcon } from '../icon';
import { ChipsField } from '../../../common/components/fields/ChipsField';
import { RunStateBadge } from '../../../common/components/RunStateBadge';
import { formatDateDifference } from '../../../common/utils/helpers';

export const DetailsView = (props: { storeKey?: string }) => {
    const { storeKey } = props;
    const translate = useTranslate();
    const theme = useTheme();
    const getResourceLabel = useGetResourceLabel();
    const resource = useResourceContext();
    const { total } = useListContext();
    const now = new Date();
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
                primaryText={record => (
                    <Stack direction="row" gap={1} alignItems="left">
                        <Typography
                            variant="body1"
                            color="secondary"
                            sx={{ fontWeight: 'medium' }}
                        >
                            {record.name}
                        </Typography>
                        <ChipsField
                            size={'small'}
                            source="metadata.labels"
                            sortable={false}
                        />
                    </Stack>
                )}
                secondaryText={record => (
                    <Stack direction="column" gap={0.3}>
                        <Stack direction="row" gap={0.3}>
                            <TextField source="kind" />
                            {'| '}
                            {translate('fields.updated.title') +
                                ' ' +
                                formatDateDifference(
                                    new Date(record.metadata.updated),
                                    now,
                                    translate
                                )}
                        </Stack>

                        <Box mt={1}>
                            <Stack direction="row" spacing={0.5}>
                                <RunStateBadge />
                                <RunStateBadge state="COMPLETED" />
                                <RunStateBadge state="ERROR" />
                            </Stack>
                        </Box>
                    </Stack>
                )}
                tertiaryText={() => <ShowButton size="medium" label={''} />}
                leftAvatar={record => {
                    return (
                        <FunctionIcon kind={record.kind} color="secondary" />
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
