// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Stack } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import {
    Labeled,
    ShowView,
    TextField,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { CustomTabbedShowLayout } from '../../common/components/CustomTabbedShowLayout';
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
        <CustomTabbedShowLayout
            syncWithLocation={false}
            record={record}
            sx={{
                '& .RaTabbedShowLayout-content': {
                    pb: 2,
                },
            }}
        >
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
                <CustomTabbedShowLayout.Tab value="spec" label={translate('fields.spec.title')}>
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
            {record.extensions && record.extensions.length > 0 && (
                <CustomTabbedShowLayout.Tab
                    value="extensions"
                    label={translate('fields.extensions.title')}
                >
                    <ExtensionsField source="extensions" />
                </CustomTabbedShowLayout.Tab>
            )}
            <CustomTabbedShowLayout.Tab value="files" label="fields.files.tab">
                <FileInfoTree />
            </CustomTabbedShowLayout.Tab>
            {kind && kind === 'table' && (
                <CustomTabbedShowLayout.Tab value="schema" label="resources.dataitems.tab.schema">
                    <SchemaTabComponent record={props.record} />
                </CustomTabbedShowLayout.Tab>
            )}
            {kind && kind === 'table' && (
                <CustomTabbedShowLayout.Tab value="preview" label="resources.dataitems.tab.preview">
                    <PreviewTabComponent record={props.record} />
                </CustomTabbedShowLayout.Tab>
            )}
            <CustomTabbedShowLayout.Tab value="lineage" label="pages.lineage.title">
                <LineageTabComponent />
            </CustomTabbedShowLayout.Tab>
        </CustomTabbedShowLayout>
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
