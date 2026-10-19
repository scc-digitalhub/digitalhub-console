// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    AccessDenied,
    LoadingIndicator,
    ShowView,
    usePermissions,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { Box, Container } from '@mui/material';
import { LogsView } from '../../../features/logs/components/LogsView';
import { AceEditorField } from '@dslab/ra-ace-editor';
import { useEffect, useState } from 'react';
import { useSchemaProvider } from '../../../common/provider/schemaProvider';
import { functionParser } from '../../../common/utils/parsers';
import { WorkflowView } from '../../workflows/components/WorkflowView';
import { LineageTabComponent } from '../../../features/lineage/components/LineageTabComponent';
import { ShowBaseLive } from '../../../features/notifications/components/ShowBaseLive';
import { ServiceDetails } from './tabs/service';
import { Inputs, Outputs } from './tabs/inputOutputs';

import ComputeResources from './tabs/computeResources';
import { getFunctionUiSpec } from '../../functions/types';
import { FilteredJsonSchemaField } from '../../../common/jsonSchema/components/FilteredJsonSchemaField';
import { MetricsField } from '../../../features/k8smetrics/MetricsField';
import { SHOW_VIEW_PROPS } from '../../../common/theme';
import { CustomTabbedShowLayout } from '../../../common/components/CustomTabbedShowLayout';
import { useExtensionsTabs } from '../../../features/extensions/tabs';
import { RunSummary } from './tabs/summary';
import { RunShowTitle } from './RunShowTitle';
import { ShowToolbar } from './ShowToolbar';
import { RunMetadata } from './tabs/metadata';
import { SpecTab } from '../../../common/components/tabs/spec';
import { MetricsTab } from './tabs/metrics';

export const RunShowComponent = () => {
    const resource = useResourceContext();
    const record = useRecordContext();
    const translate = useTranslate();
    const schemaProvider = useSchemaProvider();
    const extensionTabs = useExtensionsTabs({ source: 'extensions' });

    const [schema, setSchema] = useState<any>();

    const functionKey = record?.spec?.function
        ? functionParser(record?.spec?.function)
        : null;
    const workflowKey = record?.spec?.workflow
        ? functionParser(record?.spec?.workflow)
        : null;

    const functionKind = functionKey?.kind;
    const workflowKind = workflowKey?.kind;

    useEffect(() => {
        if (functionKind) {
            schemaProvider
                .get('functions', functionKind)
                .then(res => {
                    setSchema(res || null);
                })
                .catch(() => setSchema(undefined));
        }
        if (workflowKind) {
            schemaProvider
                .get('workflows', workflowKind)
                .then(res => {
                    setSchema(res || null);
                })
                .catch(() => setSchema(undefined));
        }
    }, [functionKind, workflowKind, schemaProvider]);

    if (!record) return <LoadingIndicator />;

    return (
        <CustomTabbedShowLayout record={record} syncWithLocation={false}>
            <CustomTabbedShowLayout.Tab
                value="summary"
                label={translate('fields.summary')}
            >
                <RunSummary record={record} />
            </CustomTabbedShowLayout.Tab>
            <CustomTabbedShowLayout.Tab
                value="metadata"
                label={translate('metadata')}
            >
                <RunMetadata record={record} />
            </CustomTabbedShowLayout.Tab>
            {record?.spec?.workflow && schema && (
                <CustomTabbedShowLayout.Tab
                    value="workflow"
                    label={'fields.workflow.title'}
                >
                    <WorkflowView record={record} />
                </CustomTabbedShowLayout.Tab>
            )}
            <CustomTabbedShowLayout.Tab
                value="spec"
                label={translate('fields.spec.title')}
            >
                <SpecTab />
            </CustomTabbedShowLayout.Tab>
            {record?.spec?.source &&
                schema?.schema &&
                !record?.status?.dockerfile && (
                    <CustomTabbedShowLayout.Tab
                        value="source-code"
                        label={'fields.code'}
                    >
                        <FilteredJsonSchemaField
                            sourceName="spec"
                            record={record}
                            fields={['source', 'requirements', 'config']}
                            schema={schema.schema}
                            uiSchema={getFunctionUiSpec(record.kind)}
                        />
                    </CustomTabbedShowLayout.Tab>
                )}
            {record?.spec?.fab_source &&
                schema?.schema &&
                !record?.status?.dockerfile && (
                    <CustomTabbedShowLayout.Tab
                        value="fab_source-code"
                        label={'fields.code'}
                    >
                        <FilteredJsonSchemaField
                            sourceName="spec"
                            record={record}
                            fields={['fab_source', 'requirements']}
                            schema={schema.schema}
                            uiSchema={getFunctionUiSpec(record.kind)}
                        />
                    </CustomTabbedShowLayout.Tab>
                )}
            {record?.status?.dockerfile && (
                <CustomTabbedShowLayout.Tab value="code" label={'fields.code'}>
                    <AceEditorField
                        source="status.dockerfile"
                        mode="text"
                        theme="monokai"
                        parse={atob}
                        minLines={10}
                        maxLines={50}
                    />
                </CustomTabbedShowLayout.Tab>
            )}
            {(record?.spec?.inputs || record?.spec?.parameters) && (
                <CustomTabbedShowLayout.Tab
                    value="inputs"
                    label={'fields.inputs.title'}
                >
                    <Inputs record={record} />
                </CustomTabbedShowLayout.Tab>
            )}
            {(record?.status?.outputs || record?.status?.results) && (
                <CustomTabbedShowLayout.Tab
                    value="outputs"
                    label={'fields.outputs.title'}
                >
                    <Outputs record={record} />
                </CustomTabbedShowLayout.Tab>
            )}
            {extensionTabs}
            <CustomTabbedShowLayout.Tab
                value="logs"
                label={translate('fields.logs')}
            >
                {record?.id && (
                    <LogsView id={record.id as string} resource={resource} />
                )}
            </CustomTabbedShowLayout.Tab>
            <CustomTabbedShowLayout.Tab value="k8s" label={'fields.k8s.title'}>
                <ComputeResources record={record} />
            </CustomTabbedShowLayout.Tab>
            {record?.status?.service && (
                <CustomTabbedShowLayout.Tab
                    value="service"
                    label={'fields.service.title'}
                >
                    <ServiceDetails record={record} />
                </CustomTabbedShowLayout.Tab>
            )}
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

export const RunShow = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBaseLive>
                <>
                    <RunShowTitle />
                    <Box sx={{ mb: 2, mt: 1, pl: 1 }}>
                        <MetricsField
                            size="small"
                            fontSize={'small'}
                            // gap={3}
                            labels
                            metrics={true}
                        />
                    </Box>
                    <ShowView actions={<ShowToolbar />} {...SHOW_VIEW_PROPS}>
                        <RunShowComponent />
                    </ShowView>
                </>
            </ShowBaseLive>
        </Container>
    );
};

export const AdminRunShow = () => {
    const { isPending, permissions } = usePermissions();

    return isPending ? (
        <LoadingIndicator />
    ) : permissions?.find(r => r === 'ROLE_ADMIN') ? (
        <RunShow />
    ) : (
        <AccessDenied />
    );
};
