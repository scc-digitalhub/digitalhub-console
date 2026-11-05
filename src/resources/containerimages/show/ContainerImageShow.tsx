// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Alert, Divider, Stack, Typography, useTheme } from '@mui/material';
import {
    FunctionField,
    Labeled,
    TextField,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { CustomTabbedShowLayout } from '../../../common/components/CustomTabbedShowLayout';
import { IdField } from '../../../common/components/fields/IdField';
import { LineageTabComponent } from '../../../features/lineage/components/LineageTabComponent';
import { StateChips } from '../../../common/components/StateChips';
import {
    ContainerImageInfoView,
    ContainerImageStatusView,
    SourceView,
} from './tabs';
import { SpecTab } from '../../../common/components/tabs/spec';
import { MetadataTab } from '../../../common/components/tabs/metadata';
import { prettyBytes } from '../../../features/files/fileBrowser/utils';

export const ContainerImageShow = props => {
    const record = useRecordContext(props);
    const translate = useTranslate();
    const theme = useTheme();

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
                <Divider />
                <Labeled label="fields.containers.image.title">
                    <IdField source="spec.image" />
                </Labeled>
                {record?.status?.size && (
                    <Labeled label="fields.files.size">
                        <FunctionField
                            render={record => prettyBytes(record.status.size)}
                        />
                    </Labeled>
                )}

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
