// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Divider, Stack } from '@mui/material';
import {
    Labeled,
    TextField,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { CustomTabbedShowLayout } from '../../../common/components/CustomTabbedShowLayout';
import { IdField } from '../../../common/components/fields/IdField';
import { LineageTabComponent } from '../../../features/lineage/components/LineageTabComponent';
import { FileInfoTree } from '../../../features/files/fileInfoTree/components/FileInfoTree';
import { useExtensionsTabs } from '../../../features/extensions/tabs';
import { MetadataTab } from '../../../common/components/tabs/metadata';
import { SpecTab } from '../../../common/components/tabs/spec';
import { LabelsField } from '../../../common/components/fields/LabelsField';

export const ArtifactShow = (props: { record?: any }) => {
    const record = useRecordContext(props);
    const translate = useTranslate();
    const extensionTabs = useExtensionsTabs({ source: 'extensions' });

    if (!record) return <></>;

    return (
        <CustomTabbedShowLayout syncWithLocation={false} record={record}>
            <CustomTabbedShowLayout.Tab value="summary" label="fields.summary">
                <Stack direction={'column'} gap={1}>
                    <Stack direction={'row'} spacing={3}>
                        <Labeled>
                            <TextField source="kind" />
                        </Labeled>

                        <Labeled>
                            <IdField source="id" />
                        </Labeled>
                    </Stack>
                    <Labeled>
                        <IdField source="key" />
                    </Labeled>
                    {record?.metadata?.labels && (
                        <Labeled>
                            <LabelsField
                                label="fields.labels.title"
                                source="metadata.labels"
                                sortable={false}
                            />
                        </Labeled>
                    )}
                </Stack>
                <Divider />
                {record?.status?.files && <FileInfoTree />}
            </CustomTabbedShowLayout.Tab>
            <CustomTabbedShowLayout.Tab value="metadata" label="metadata">
                <MetadataTab />
            </CustomTabbedShowLayout.Tab>
            <CustomTabbedShowLayout.Tab
                value="spec"
                label={translate('fields.spec.title')}
            >
                <SpecTab />
            </CustomTabbedShowLayout.Tab>
            {extensionTabs}
            <CustomTabbedShowLayout.Tab
                value="lineage"
                label="pages.lineage.title"
            >
                <LineageTabComponent />
            </CustomTabbedShowLayout.Tab>
        </CustomTabbedShowLayout>
    );
};
