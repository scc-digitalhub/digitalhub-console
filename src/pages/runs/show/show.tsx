// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    AccessDenied,
    DateField,
    LoadingIndicator,
    SelectInput,
    ShowView,
    TextField,
    TextInput,
    useCreatePath,
    usePermissions,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { Box, Container } from '@mui/material';
import { toYaml } from '@dslab/ra-export-record-button';
import { StateColors } from '../../../common/components/StateChips';
import { LogsView } from '../../../features/logs/components/LogsView';
import { AceEditorField } from '@dslab/ra-ace-editor';
import { useEffect, useState } from 'react';
import { useSchemaProvider } from '../../../common/provider/schemaProvider';
import { useNavigate } from 'react-router-dom';
import { countLines } from '../../../common/utils/helpers';
import { functionParser } from '../../../common/utils/parsers';
import { WorkflowView } from '../../workflows/components/WorkflowView';
import { LineageTabComponent } from '../../../features/lineage/components/LineageTabComponent';
import { ShowBaseLive } from '../../../features/notifications/components/ShowBaseLive';
import { ServiceDetails } from './tabs/service';
import { Inputs, Outputs } from './tabs/inputOutputs';

import ComputeResources from './tabs/computeResources';
import { getFunctionUiSpec } from '../../functions/types';
import { MetricsGrid } from '../../../features/metrics/components/MetricsGrid';
import { FilteredJsonSchemaField } from '../../../common/jsonSchema/components/FilteredJsonSchemaField';
import { MetricsField } from '../../../features/k8smetrics/MetricsField';
import { SHOW_VIEW_PROPS } from '../../../common/theme';
import { CustomTabbedShowLayout } from '../../../common/components/CustomTabbedShowLayout';
import { useExtensionsTabs } from '../../../features/extensions/tabs';
import { RunSummary } from './tabs/summary';
import { RunShowTitle } from './RunShowTitle';
import { ShowToolbar } from './ShowToolbar';
import { RunMetadata } from './tabs/metadata';

export const RunShowComponent = () => {
    const resource = useResourceContext();
    const record = useRecordContext();
    const translate = useTranslate();
    const schemaProvider = useSchemaProvider();
    const extensionTabs = useExtensionsTabs({ source: 'extensions' });
    const createPath = useCreatePath();
    const navigate = useNavigate();

    const [schema, setSchema] = useState<any>();

    const uri = record?.spec?.function
        ? new URL(record.spec.function)
        : record?.spec?.workflow
        ? new URL(record.spec.workflow)
        : null;

    const kind = uri
        ? uri.protocol.substring(0, uri.protocol.length - 1)
        : null;

    const functionKey = record?.spec?.function
        ? functionParser(record?.spec?.function)
        : null;
    const workflowKey = record?.spec?.workflow
        ? functionParser(record?.spec?.workflow)
        : null;
    const functionId = functionKey ? functionKey.id : null;
    const workflowId = workflowKey ? workflowKey.id : null;

    useEffect(() => {
        if (kind) {
            if (functionId) {
                schemaProvider.get('functions', kind).then(res => {
                    setSchema(res || null);
                });
            }
            if (workflowId) {
                schemaProvider.get('workflows', kind).then(res => {
                    setSchema(res || null);
                });
            }
        }
    }, [kind]);

    const states: any[] = [];
    for (const c in StateColors) {
        states.push({ id: c, name: translate('states.' + c.toLowerCase()) });
    }
    const recordSpec = record?.spec;
    const lineCount = countLines(recordSpec);

    const metricsComparisonFilters = [
        <TextInput
            label="fields.name.title"
            source="q"
            alwaysOn
            resettable
            key={1}
        />,
        <SelectInput
            alwaysOn
            key={2}
            label="fields.status.state"
            source="state"
            choices={states}
            sx={{ '& .RaSelectInput-input': { margin: '0px' } }}
        />,
    ];

    const metricsDatagridFields = [
        <TextField
            source="name"
            label="fields.name.title"
            sortable={false}
            key={'df1'}
        />,
        <DateField
            source="metadata.created"
            showTime
            label="fields.metadata.created"
            key={'df2'}
        />,
        <TextField
            source="spec.task"
            label="fields.task.title"
            sortable={false}
            key={'df3'}
        />,
    ];

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
                <AceEditorField
                    source="spec"
                    parse={toYaml}
                    mode="yaml"
                    minLines={lineCount[0]}
                    maxLines={lineCount[1]}
                />
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
                    <MetricsGrid
                        record={record}
                        filters={metricsComparisonFilters}
                        datagridFields={metricsDatagridFields}
                        postFetchFilter={v =>
                            //TODO refactor properly
                            {
                                if (!v.spec?.function) {
                                    return false;
                                }

                                if (!v.kind || v.kind != record.kind) {
                                    return false;
                                }

                                if (
                                    functionParser(v.spec.function).name !=
                                    functionParser(record.spec.function).name
                                ) {
                                    return false;
                                }

                                return true;
                            }
                        }
                    />
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
