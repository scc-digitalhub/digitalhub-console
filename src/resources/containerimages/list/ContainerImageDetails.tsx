// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Typography, useTheme } from '@mui/material';
import {
    FunctionField,
    ShowButton,
    SimpleList,
    TextField,
    useGetResourceLabel,
    useListContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { ContainerImageIcon } from '../icon';
import { StateChips } from '../../../common/components/StateChips';
import { prettyBytes } from '../../../features/files/fileBrowser/utils';
import { Stack } from '@mui/system';
import { formatDateDifference } from '../../../common/utils/helpers';
import { LabelsField } from '../../../common/components/fields/LabelsField';

export const ContainerImageDetails = () => {
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
                            {record?.spec?.image || record.name}
                        </Typography>
                        <LabelsField
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
                        {record?.status?.size && (
                            <Typography variant="body2" color="text.primary">
                                <Stack direction="row" gap={1}>
                                    <FunctionField
                                        render={record =>
                                            prettyBytes(record.status.size)
                                        }
                                    />
                                </Stack>
                            </Typography>
                        )}
                        <Box mt={1}>
                            <StateChips
                                source="status.state"
                                label="fields.status.state"
                                size="small"
                            />
                        </Box>
                    </Stack>
                )}
                tertiaryText={() => <ShowButton size="medium" label={''} />}
                leftAvatar={() => <ContainerImageIcon />}
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
