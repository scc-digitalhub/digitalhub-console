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
import { cards } from './cards';
import { tabs } from './tabs';
import { LabelsField } from '../../../common/components/fields/LabelsField';
import { MetadataTab } from '../../../common/components/tabs/metadata';
import { SpecTab } from '../../../common/components/tabs/spec';

export const ModelShow = (props: { record?: any }) => {
    const record = useRecordContext(props);
    const translate = useTranslate();
    const extensionTabs = useExtensionsTabs({ source: 'extensions' });

    if (!record) return <></>;

    const kind = record?.kind;
    const Card = kind && cards[kind] ? cards[kind] : null;
    const kindTabs = kind ? tabs[kind] : null;

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
                {Card && <Card />}
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
            {kind &&
                kindTabs
                    ?.filter(Tab =>
                        Tab.isVisible ? Tab.isVisible(record) : true
                    )
                    .map(Tab => (
                        <CustomTabbedShowLayout.Tab
                            key={Tab.key || kind}
                            value={Tab.key || kind}
                            label={Tab.label || kind}
                        >
                            <Tab.Element />
                        </CustomTabbedShowLayout.Tab>
                    ))}

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
