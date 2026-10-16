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
import { ArtifactIcon } from '../icon';
import { IdField } from '../../../common/components/fields/IdField';
import { LineageTabComponent } from '../../../features/lineage/components/LineageTabComponent';
import { ShowBaseLive } from '../../../features/notifications/components/ShowBaseLive';
import { FileInfoTree } from '../../../features/files/fileInfoTree/components/FileInfoTree';
import { SHOW_VIEW_VERSION_PROPS } from '../../../common/theme';
import { StyledFlatCard } from '../../../common/theme/StyledFlatCard';
import { ShowToolbar } from './ShowToolbar';
import { useExtensionsTabs } from '../../../features/extensions/tabs';
import { MetadataTab } from '../../../common/components/tabs/metadata';
import { SpecTab } from '../../../common/components/tabs/spec';
import { LabelsField } from '../../../common/components/fields/LabelsField';

export const ArtifactShow = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBaseLive>
                <>
                    <ShowPageTitle icon={<ArtifactIcon fontSize={'large'} />} />
                    <ShowView
                        actions={<ShowToolbar />}
                        aside={<VersionsListWrapper />}
                        {...SHOW_VIEW_VERSION_PROPS}
                        component={StyledFlatCard}
                    >
                        <ArtifactShowLayout />
                    </ShowView>
                </>
            </ShowBaseLive>
        </Container>
    );
};

const ArtifactShowLayout = (props: { record?: any }) => {
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
