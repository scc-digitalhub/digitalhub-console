// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Stack } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import {
    Labeled,
    ShowView,
    TabbedShowLayout,
    TextField,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { arePropsEqual, countLines } from '../../common/utils/helpers';
import { ShowPageTitle } from '../../common/components/layout/PageTitle';
import { VersionsListWrapper } from '../../common/components/VersionsList';
import { useSchemaProvider } from '../../common/provider/schemaProvider';
import { DataItemIcon } from './icon';
import { MetadataField } from '../../features/metadata/components/MetadataField';
import { IdField } from '../../common/components/fields/IdField';
import { LineageTabComponent } from '../../features/lineage/components/LineageTabComponent';
import { ShowToolbar } from '../../common/components/toolbars/ShowToolbar';
import { StateChips } from '../../common/components/StateChips';
import { ShowBaseLive } from '../../features/notifications/components/ShowBaseLive';
import { AceEditorField } from '@dslab/ra-ace-editor';
import { toYaml } from '@dslab/ra-export-record-button';
import { FileInfoTree } from '../../features/files/fileInfoTree/components/FileInfoTree';
import { PreviewTabComponent } from './components/preview-table/PreviewTabComponent';
import { SchemaTabComponent } from './components/schema-table/SchemaTabComponent';
import { ShowComponent } from '../../common/components/ShowComponent';
import { ExtensionsField } from '../../features/extensions/Field';
import { SHOW_VIEW_VERSION_PROPS } from '../../common/theme';
import { StyledFlatCard } from '../../common/theme/StyledFlatCard';

const DataItemShowLayout = memo(function DataItemShowLayout(props: {
    record: any;
}) {
    const { record } = props;
    const schemaProvider = useSchemaProvider();
    const translate = useTranslate();
    const resource = useResourceContext();
    const [spec, setSpec] = useState<any>();
    const kind = record?.kind || undefined;
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
            {kind && kind === 'table' && (
                <TabbedShowLayout.Tab label="resources.dataitems.tab.schema">
                    <SchemaTabComponent record={props.record} />
                </TabbedShowLayout.Tab>
            )}
            {kind && kind === 'table' && (
                <TabbedShowLayout.Tab label="resources.dataitems.tab.preview">
                    <PreviewTabComponent record={props.record} />
                </TabbedShowLayout.Tab>
            )}
            <TabbedShowLayout.Tab label="pages.lineage.title">
                <LineageTabComponent />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    );
},
arePropsEqual);

export const DataItemShow = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBaseLive>
                <>
                    <ShowPageTitle icon={<DataItemIcon fontSize={'large'} />} />
                    <ShowView
                        actions={<ShowToolbar />}
                        aside={<VersionsListWrapper />}
                        {...SHOW_VIEW_VERSION_PROPS}
                        component={StyledFlatCard}
                    >
                        <ShowComponent InnerShow={DataItemShowLayout} />
                    </ShowView>
                </>
            </ShowBaseLive>
        </Container>
    );
};
