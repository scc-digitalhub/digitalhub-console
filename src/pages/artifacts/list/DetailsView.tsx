// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Typography, useTheme } from '@mui/material';
import {
    FunctionField,
    RecordContextProvider,
    ShowButton,
    SimpleList,
    TextField,
    useGetResourceLabel,
    useListContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { ArtifactIcon } from '../icon';
import { ChipsField } from '../../../common/components/fields/ChipsField';
import { StateChips } from '../../../common/components/StateChips';
import { prettyBytes } from '../../../features/files/fileBrowser/utils';
import { Stack } from '@mui/system';
import { FileIcon } from '../../../features/files/fileBrowser/components/FileIcon';
import { formatDateDifference } from '../../../common/utils/helpers';

export const DetailsView = (props: { storeKey?: string }) => {
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
                        {record?.status?.files && (
                            <Typography variant="body2" color="text.primary">
                                <Stack direction="row" gap={1}>
                                    <FunctionField
                                        render={record =>
                                            record?.status?.files
                                                ? prettyBytes(
                                                      record.status.files.reduce(
                                                          (acc, file) =>
                                                              acc +
                                                              (file.size || 0),
                                                          0
                                                      )
                                                  )
                                                : ''
                                        }
                                    />
                                    {'-'}
                                    <FunctionField
                                        render={record =>
                                            `${record?.status?.files?.length} ` +
                                                translate(
                                                    'fields.files.title'
                                                ) || ''
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
                leftAvatar={record => {
                    if (record?.status?.files?.length > 0) {
                        const file = record.status.files[0];
                        return (
                            <RecordContextProvider value={file}>
                                <FileIcon />
                            </RecordContextProvider>
                        );
                    }

                    return <ArtifactIcon />;
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
