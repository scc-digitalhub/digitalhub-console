// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    Labeled,
    TextField,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { CustomTabbedShowLayout } from '../../../common/components/CustomTabbedShowLayout';
import { countLines } from '../../../common/utils/helpers';
import { useSchemaProvider } from '../../../common/provider/schemaProvider';
import { MetadataField } from '../../../features/metadata/components/MetadataField';
import { IdField } from '../../../common/components/fields/IdField';
import { LineageTabComponent } from '../../../features/lineage/components/LineageTabComponent';
import { StateChips } from '../../../common/components/StateChips';
import { toYaml } from '@dslab/ra-export-record-button';
import { AceEditorField } from '@dslab/ra-ace-editor';
import {
    ContainerImageInfoView,
    ContainerImageStatusView,
    SourceView,
} from './tabs';

export const ContainerImageShow = props => {
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
