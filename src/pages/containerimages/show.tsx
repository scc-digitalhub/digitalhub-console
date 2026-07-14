// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Alert,
    Box,
    Container,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
    ArrayField,
    DataTable,
    FunctionField,
    Labeled,
    RecordContext,
    ShowView,
    TextField,
    useDataProvider,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { CustomTabbedShowLayout } from '../../common/components/CustomTabbedShowLayout';
import { countLines } from '../../common/utils/helpers';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { ShowPageTitle } from '../../common/components/layout/PageTitle';
import { useSchemaProvider } from '../../common/provider/schemaProvider';
import { ContainerImageIcon } from './icon';
import { MetadataField } from '../../features/metadata/components/MetadataField';
import { IdField } from '../../common/components/fields/IdField';
import { LineageTabComponent } from '../../features/lineage/components/LineageTabComponent';
import { ShowToolbar } from '../../common/components/toolbars/ShowToolbar';
import { StateChips } from '../../common/components/StateChips';
import { ShowBaseLive } from '../../features/notifications/components/ShowBaseLive';
import { toYaml } from '@dslab/ra-export-record-button';
import { AceEditorField } from '@dslab/ra-ace-editor';
import { prettyBytes } from '../../features/files/fileBrowser/utils';
import { ChipsField } from '../../common/components/fields/ChipsField';
import { useRootSelector } from '@dslab/ra-root-selector';
import { MarkdownBody } from '../../common/components/MarkdownBody';

const ContainerImageShowLayout = props => {
    const record = useRecordContext(props);
    const schemaProvider = useSchemaProvider();
    const translate = useTranslate();
    const resource = useResourceContext();
    const [spec, setSpec] = useState<any>();
    const recordSpec = record?.spec;
    const lineCount = countLines(recordSpec);

    useEffect(() => {
        if (!schemaProvider) {
            return;
        }

        if (record && resource) {
            schemaProvider.get(resource, record.kind).then(s => {
                setSpec(s);
            });
        }
    }, [record, schemaProvider, resource]);

    if (!record) return <></>;

    return (
        <CustomTabbedShowLayout syncWithLocation={false} record={record}>
            <CustomTabbedShowLayout.Tab value="summary" label="fields.summary">
                <Stack direction={'row'} spacing={3}>
                    <Labeled>
                        <TextField source="kind" />
                    </Labeled>

                    <Labeled>
                        <IdField source="id" />
                    </Labeled>
                </Stack>

                <IdField source="key" />
                <StateChips source="status.state" label="fields.status.state" />
                <MetadataField />
            </CustomTabbedShowLayout.Tab>
            {spec && (
                <CustomTabbedShowLayout.Tab
                    value="spec"
                    label={translate('fields.spec.title')}
                >
                    <Box sx={{ width: '100%' }}>
                        <AceEditorField
                            width="100%"
                            source="spec"
                            parse={toYaml}
                            mode="yaml"
                            minLines={lineCount[0]}
                            maxLines={lineCount[1]}
                        />
                    </Box>
                </CustomTabbedShowLayout.Tab>
            )}
            <CustomTabbedShowLayout.Tab value="info" label="fields.info.tab">
                <ContainerImageInfoView />
            </CustomTabbedShowLayout.Tab>
            {record?.status?.layers && (
                <CustomTabbedShowLayout.Tab
                    value="source"
                    label="fields.source.title"
                >
                    <SourceView />
                </CustomTabbedShowLayout.Tab>
            )}
            <CustomTabbedShowLayout.Tab
                value="details"
                label="messages.navigation.details"
            >
                <ContainerImageStatusView />
            </CustomTabbedShowLayout.Tab>
            <CustomTabbedShowLayout.Tab
                value="lineage"
                label="pages.lineage.title"
            >
                <LineageTabComponent />
            </CustomTabbedShowLayout.Tab>
        </CustomTabbedShowLayout>
    );
};

export const ContainerImageShow = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBaseLive>
                <>
                    <ShowPageTitle
                        icon={<ContainerImageIcon fontSize={'large'} />}
                    />
                    <ShowView
                        actions={<ShowToolbar />}
                        // sx={{
                        //     width: '100%',
                        //     '& .RaShow-main': {
                        //         display: 'grid',
                        //         gridTemplateColumns: { lg: '1fr 350px' },
                        //         gridTemplateRows: {
                        //             xs: 'repeat(1, 1fr)',
                        //             lg: '',
                        //         },
                        //         gap: 2,
                        //     },
                        // }}
                        component={FlatCard}
                        // aside={<VersionsListWrapper />}
                    >
                        <ContainerImageShowLayout />
                    </ShowView>
                </>
            </ShowBaseLive>
        </Container>
    );
};

const SourceView = () => {
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

const ContainerImageStatusView = () => {
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

const ContainerImageInfoView = () => {
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
