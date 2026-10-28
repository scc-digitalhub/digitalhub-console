// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Alert, Box, Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    ArrayField,
    DataTable,
    FunctionField,
    Labeled,
    RecordContext,
    TextField,
    useDataProvider,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { IdField } from '../../../common/components/fields/IdField';
import { AceEditorField } from '@dslab/ra-ace-editor';
import { prettyBytes } from '../../../features/files/fileBrowser/utils';
import { ChipsField } from '../../../common/components/fields/ChipsField';
import { useRootSelector } from '@dslab/ra-root-selector';
import { MarkdownBody } from '../../../common/components/MarkdownBody';

export const SourceView = () => {
    const record = useRecordContext();

    if (!record || !record.status || !record.status.layers) return <></>;

    const source = record.status.layers
        .map(layer => layer.instruction)
        .join('\n');

    return (
        <RecordContext.Provider value={{ source }}>
            <Stack direction={'column'} spacing={3}>
                <Labeled>
                    <AceEditorField source="source" mode="sh" width="100%" />
                </Labeled>
            </Stack>
        </RecordContext.Provider>
    );
};

export const ContainerImageStatusView = () => {
    const record = useRecordContext();

    if (!record || !record.status) return <></>;

    const layersField = record.status.layers
        ? 'status.layers'
        : 'status.manifest.layers';

    const cleanUpInstruction = (instruction: string) => {
        // Remove buildkit syntax if present
        const buildkitPrefix = '#buildkit';
        if (instruction.startsWith(buildkitPrefix)) {
            return instruction.slice(buildkitPrefix.length).trim();
        }

        ///bin/sh -c #(nop)
        const shPrefix = '/bin/sh -c #(nop) ';
        if (instruction.startsWith(shPrefix)) {
            return instruction.slice(shPrefix.length).trim();
        }

        return instruction;
    };

    return (
        <Stack direction={'column'} spacing={3}>
            <Labeled>
                <TextField source="status.mediaType" label="mediaType" />
            </Labeled>

            <Labeled>
                <IdField
                    source="status.digest"
                    label="fields.containers.digest.title"
                />
            </Labeled>

            <Labeled label="fields.files.size">
                <FunctionField
                    render={record =>
                        record?.status?.size
                            ? prettyBytes(record.status.size)
                            : ''
                    }
                />
            </Labeled>

            {record?.status?.tags && (
                <Labeled>
                    <ChipsField label="tags" source="status.tags" />
                </Labeled>
            )}

            {layersField && (
                <Labeled label="fields.containers.layers.title">
                    <ArrayField source={layersField}>
                        <DataTable bulkActionButtons={false}>
                            {layersField == 'status.layers' && (
                                <DataTable.Col
                                    source="instruction"
                                    label="fields.containers.instructions.item.title"
                                >
                                    <FunctionField
                                        render={record =>
                                            record?.instruction ? (
                                                <IdField
                                                    source="instruction"
                                                    truncate={42}
                                                    popover={true}
                                                    copy={false}
                                                    format={cleanUpInstruction}
                                                    variant="monospaced"
                                                />
                                            ) : (
                                                ''
                                            )
                                        }
                                    />
                                </DataTable.Col>
                            )}
                            <DataTable.Col source="digest">
                                <IdField
                                    source="digest"
                                    truncate={20}
                                    popover={true}
                                    copy={false}
                                />
                            </DataTable.Col>
                            <DataTable.Col source="size">
                                <FunctionField
                                    render={record =>
                                        record?.size
                                            ? prettyBytes(record.size)
                                            : ''
                                    }
                                />
                            </DataTable.Col>
                        </DataTable>
                    </ArrayField>
                </Labeled>
            )}
        </Stack>
    );
};

export const ContainerImageInfoView = () => {
    const { root } = useRootSelector();
    const record = useRecordContext();
    const dataProvider = useDataProvider();
    const theme = useTheme();
    const translate = useTranslate();

    const [description, setDescription] = useState<any | null>(null);

    useEffect(() => {
        if (!record) return;

        const fetchDescription = async () => {
            try {
                const response = await dataProvider.invoke({
                    path: `/-/${root}/containerimages/${record.id}/description`,
                    options: { method: 'GET' },
                });
                setDescription(response);
            } catch (error) {
                console.error(
                    'Error fetching container image description:',
                    error
                );
            }
        };

        fetchDescription();
    }, [record, dataProvider]);

    if (!record && !description) return <></>;

    return (
        <Stack direction={'column'} spacing={3}>
            <Labeled label="fields.containers.image.title">
                <IdField source="spec.image" />
            </Labeled>

            <Alert severity="info" variant="outlined">
                <Typography variant="body2">
                    {translate('pages.containerimages.quick-use')}
                </Typography>
                <Stack
                    direction={'row'}
                    spacing={1}
                    alignItems={'flex-start'}
                    sx={{
                        mt: 1,
                        p: 1,
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        backgroundColor:
                            theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.08)'
                                : 'rgba(0, 0, 0, 0.04)',
                    }}
                >
                    <span>$ </span>
                    <IdField
                        source="spec.image"
                        popover={false}
                        value={`docker pull ${record?.spec?.image}`}
                        variant="monospaced"
                    />
                </Stack>
            </Alert>

            {description && (
                <RecordContext.Provider value={description}>
                    <TextField source="title" />
                    {description?.description && (
                        <Labeled label="fields.description.title">
                            <TextField source="description" />
                        </Labeled>
                    )}

                    {description?.fullDescription && (
                        <Box sx={{ width: '100%', minWidth: 0 }}>
                            <MarkdownBody
                                style={{
                                    padding: 16,
                                    borderRadius: 10,
                                    backgroundColor:
                                        theme.palette.mode === 'dark'
                                            ? 'rgba(255, 255, 255, 0.08)'
                                            : 'rgba(0, 0, 0, 0.04)',
                                }}
                            >
                                {description.fullDescription}
                            </MarkdownBody>
                        </Box>
                    )}
                </RecordContext.Provider>
            )}
        </Stack>
    );
};
