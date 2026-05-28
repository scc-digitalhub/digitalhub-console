// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Stack } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import {
    DateField,
    Labeled,
    ShowView,
    TabbedShowLayout,
    TextField,
    TextInput,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { arePropsEqual, countLines } from '../../common/utils/helpers';
import { ShowPageTitle } from '../../common/components/layout/PageTitle';
import { VersionsListWrapper } from '../../common/components/VersionsList';
import { useSchemaProvider } from '../../common/provider/schemaProvider';
import { ModelIcon } from './icon';
import { MetadataField } from '../../features/metadata/components/MetadataField';
import { IdField } from '../../common/components/fields/IdField';
import { LineageTabComponent } from '../../features/lineage/components/LineageTabComponent';
import { ChipsField } from '../../common/components/fields/ChipsField';
import { ShowToolbar } from '../../common/components/toolbars/ShowToolbar';
import { StateChips } from '../../common/components/StateChips';
import { ShowBaseLive } from '../../features/notifications/components/ShowBaseLive';
import { AceEditorField } from '@dslab/ra-ace-editor';
import { toYaml } from '@dslab/ra-export-record-button';
import { FileInfoTree } from '../../features/files/fileInfoTree/components/FileInfoTree';
import { MetricsGrid } from '../../features/metrics/components/MetricsGrid';
import { ShowComponent } from '../../common/components/ShowComponent';
import { ExtensionsField } from '../../features/extensions/Field';
import { SHOW_VIEW_VERSION_PROPS } from '../../common/theme';
import { StyledFlatCard } from '../../common/theme/StyledFlatCard';

const ModelShowLayout = memo(function ModelShowLayout(props: { record: any }) {
    const { record } = props;
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

    const metricsComparisonFilters = [
        <TextInput
            label="fields.name.title"
            source="q"
            alwaysOn
            resettable
            key={1}
        />,
    ];

    const metricsDatagridFields = [
        <TextField
            source="id"
            label="fields.id"
            sortable={false}
            key={'df1'}
        />,
        <DateField
            source="metadata.created"
            showTime
            label="fields.metadata.created"
            key={'df2'}
        />,
        <ChipsField
            label="fields.labels.title"
            source="metadata.labels"
            sortable={false}
            key={'df3'}
        />,
    ];

    if (!record) return <></>;

    return (
        <TabbedShowLayout
            syncWithLocation={false}
            record={record}
            sx={{
                '& .RaTabbedShowLayout-content': {
                    pb: 2,
                },
            }}
        >
            <TabbedShowLayout.Tab label="fields.summary">
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
            </TabbedShowLayout.Tab>
            {spec && (
                <TabbedShowLayout.Tab label={translate('fields.spec.title')}>
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
                </TabbedShowLayout.Tab>
            )}
            {record.extensions && record.extensions.length > 0 && (
                <TabbedShowLayout.Tab
                    label={translate('fields.extensions.title')}
                >
                    <ExtensionsField source="extensions" />
                </TabbedShowLayout.Tab>
            )}
            <TabbedShowLayout.Tab label="fields.files.tab">
                <FileInfoTree />
            </TabbedShowLayout.Tab>
            {record?.status?.metrics && (
                <TabbedShowLayout.Tab label={'fields.metrics.title'}>
                    <MetricsGrid
                        record={record}
                        filter={{ name: record?.name, versions: 'all' }}
                        filters={metricsComparisonFilters}
                        datagridFields={metricsDatagridFields}
                    />
                </TabbedShowLayout.Tab>
            )}
            <TabbedShowLayout.Tab label="pages.lineage.title">
                <LineageTabComponent />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    );
}, arePropsEqual);

export const ModelShow = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBaseLive>
                <>
                    <ShowPageTitle icon={<ModelIcon fontSize={'large'} />} />
                    <ShowView
                        actions={<ShowToolbar />}
                        aside={<VersionsListWrapper />}
                        {...SHOW_VIEW_VERSION_PROPS}
                        component={StyledFlatCard}
                    >
                        <ShowComponent InnerShow={ModelShowLayout} />
                    </ShowView>
                </>
            </ShowBaseLive>
        </Container>
    );
};
