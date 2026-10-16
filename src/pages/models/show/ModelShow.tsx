// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Container, Divider, Stack } from '@mui/material';
import {
    Labeled,
    ShowView,
    TextField,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { CustomTabbedShowLayout } from '../../../common/components/CustomTabbedShowLayout';
import { ShowPageTitle } from '../../../common/components/layout/PageTitle';
import { VersionsListWrapper } from '../../../common/components/VersionsList';
import { ModelIcon } from '../icon';
import { IdField } from '../../../common/components/fields/IdField';
import { LineageTabComponent } from '../../../features/lineage/components/LineageTabComponent';
import { ShowBaseLive } from '../../../features/notifications/components/ShowBaseLive';
import { FileInfoTree } from '../../../features/files/fileInfoTree/components/FileInfoTree';
import { SHOW_VIEW_VERSION_PROPS } from '../../../common/theme';
import { StyledFlatCard } from '../../../common/theme/StyledFlatCard';
import { useExtensionsTabs } from '../../../features/extensions/tabs';
import { ShowToolbar } from './ShowToolbar';
import { cards } from './cards';
import { tabs } from './tabs';
import { LabelsField } from '../../../common/components/fields/LabelsField';
import { MetadataTab } from '../../../common/components/tabs/metadata';
import { MetricsTab } from './tabs/metrics';
import { SpecTab } from '../../../common/components/tabs/spec';

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
                        <ModelShowLayout />
                    </ShowView>
                </>
            </ShowBaseLive>
        </Container>
    );
};

const ModelShowLayout = (props: { record?: any }) => {
    const record = useRecordContext(props);
    const extensionTabs = useExtensionsTabs({ source: 'extensions' });
    const translate = useTranslate();

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
            {record?.status?.metrics && (
                <CustomTabbedShowLayout.Tab
                    value="metrics"
                    label={'fields.metrics.title'}
                >
                    <MetricsTab />
                </CustomTabbedShowLayout.Tab>
            )}
            <CustomTabbedShowLayout.Tab
                value="lineage"
                label="pages.lineage.title"
            >
                <LineageTabComponent />
            </CustomTabbedShowLayout.Tab>
        </CustomTabbedShowLayout>
    );
};
