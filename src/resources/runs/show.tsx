// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    DateField,
    DeleteWithConfirmButton,
    FunctionField,
    IconButtonWithTooltip,
    Labeled,
    LoadingIndicator,
    SelectInput,
    ShowView,
    TabbedShowLayout,
    TextField,
    TextInput,
    TopToolbar,
    useCreatePath,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { Container, Divider, Stack } from '@mui/material';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton, toYaml } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { RunIcon } from './icon';
import { FlatCard } from '../../components/FlatCard';
import { ShowPageTitle } from '../../components/PageTitle';
import { StateChips, StateColors } from '../../components/StateChips';
import { LogsView } from '../../components/LogsView';
import { StopButton } from './StopButton';
import { AceEditorField } from '@dslab/ra-ace-editor';
import { MetadataField } from '../../components/MetadataField';
import { SourceCodeTab } from '../functions/show';
import { useEffect, useState } from 'react';
import { useSchemaProvider } from '../../provider/schemaProvider';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { ResumeButton } from './ResumeButton';
import { functionParser } from '../../common/helper';
import { IdField } from '../../components/IdField';
import { WorkflowView } from '../workflows/WorkflowView';
import { LineageTabComponent } from '../../components/lineage/LineageTabComponent';
import { MetricsGrid } from '../../components/metrics/MetricsGrid';
import { ShowBaseLive } from '../../components/ShowBaseLive';
import { ServiceDetails } from './tabs/service';
import { EventsList } from './tabs/events';
import { InputsList, OutputsList, ResultsList } from './tabs/inputOutputs';
import { K8sDetails } from './tabs/k8s';
import { OpenAIDetails } from './tabs/openai';
import { CloneButton } from './CloneButton';
import { ClientTab } from './tabs/client';

export const RunShowComponent = () => {
    const resource = useResourceContext();
    const record = useRecordContext();
    const translate = useTranslate();
    const schemaProvider = useSchemaProvider();
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

    const functionId =
        record?.spec?.function && uri ? uri.pathname.split(':')[1] : null;
    const workflowId =
        record?.spec?.workflow && uri ? uri.pathname.split(':')[1] : null;

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
        <TabbedShowLayout record={record} syncWithLocation={false}>
            <TabbedShowLayout.Tab label={translate('fields.summary')}>
                <Stack direction={'row'} spacing={3}>
                    <Labeled>
                        <TextField source="kind" label="fields.kind" />
                    </Labeled>
                    <Labeled>
                        <IdField source="id" />
                    </Labeled>
                </Stack>
                <Labeled>
                    <IdField source="key" />
                </Labeled>
                {record?.metadata && <MetadataField />}
                <Divider />

                <Stack direction={'row'}>
                    <Labeled>
                        <TextField
                            source="spec.task"
                            label="fields.spec.task.title"
                        />
                    </Labeled>
                    {functionId && (
                        <IconButtonWithTooltip
                            label="ra.action.show"
                            color="primary"
                            sx={{ mt: 1 }}
                            onClick={() => {
                                const path = createPath({
                                    resource: 'functions',
                                    id: functionId,
                                    type: 'show',
                                });

                                navigate(path);
                            }}
                        >
                            <OpenInNewIcon fontSize="small" />
                        </IconButtonWithTooltip>
                    )}
                    {workflowId && (
                        <IconButtonWithTooltip
                            label="ra.action.show"
                            color="primary"
                            sx={{ mt: 1 }}
                            onClick={() => {
                                const path = createPath({
                                    resource: 'workflows',
                                    id: workflowId,
                                    type: 'show',
                                });

                                navigate(path);
                            }}
                        >
                            <OpenInNewIcon fontSize="small" />
                        </IconButtonWithTooltip>
                    )}
                </Stack>

                <Labeled>
                    <StateChips
                        source="status.state"
                        label="fields.status.state"
                    />
                </Labeled>
                {record?.status?.transitions && <EventsList record={record} />}
            </TabbedShowLayout.Tab>
            {record?.spec?.workflow && schema && (
                <TabbedShowLayout.Tab label={'fields.workflow.title'}>
                    <WorkflowView record={record} />
                </TabbedShowLayout.Tab>
            )}
            <TabbedShowLayout.Tab label={translate('fields.spec.title')}>
                <AceEditorField
                    source="spec"
                    parse={toYaml}
                    mode="yaml"
                    minLines={20}
                />
            </TabbedShowLayout.Tab>
            {record?.spec?.source && schema && (
                <TabbedShowLayout.Tab label={'fields.code'}>
                    <SourceCodeTab
                        sourceCode={record.spec.source}
                        spec={schema}
                    />
                </TabbedShowLayout.Tab>
            )}
            {record?.spec?.inputs && (
                <TabbedShowLayout.Tab label={'fields.inputs.title'}>
                    <InputsList record={record} />
                </TabbedShowLayout.Tab>
            )}
            {(record?.status?.outputs || record?.status?.results) && (
                <TabbedShowLayout.Tab label={'fields.results'}>
                    {record?.status?.outputs && <OutputsList record={record} />}
                    {record?.status?.results && <ResultsList record={record} />}
                </TabbedShowLayout.Tab>
            )}
            <TabbedShowLayout.Tab label={translate('fields.logs')}>
                {record?.id && (
                    <LogsView id={record.id as string} resource={resource} />
                )}
            </TabbedShowLayout.Tab>
            {record?.status?.k8s && (
                <TabbedShowLayout.Tab label={'fields.k8s.title'}>
                    <K8sDetails record={record} />
                </TabbedShowLayout.Tab>
            )}
            {record?.status?.service && (
                <TabbedShowLayout.Tab label={'fields.service.title'}>
                    <ServiceDetails record={record} />
                </TabbedShowLayout.Tab>
            )}
            {record?.status?.service?.url && (
                <TabbedShowLayout.Tab label={'client'}>
                    <ClientTab record={record} />
                </TabbedShowLayout.Tab>
            )}
            {record?.status?.openai && (
                <TabbedShowLayout.Tab label={'fields.openai.title'}>
                    <OpenAIDetails record={record} />
                </TabbedShowLayout.Tab>
            )}
            {record?.spec?.function && (
                <TabbedShowLayout.Tab label={'fields.metrics.title'}>
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
                </TabbedShowLayout.Tab>
            )}
            <TabbedShowLayout.Tab label="pages.lineage.title">
                <LineageTabComponent />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    );
};

const ShowToolbar = () => (
    <TopToolbar>
        <BackButton />
        <InspectButton style={{ marginLeft: 'auto' }} fullWidth />
        <FunctionField
            render={record =>
                record.status?.state == 'RUNNING' ? (
                    <StopButton record={record} />
                ) : record.status?.state == 'STOPPED' ? (
                    <ResumeButton record={record} />
                ) : null
            }
        />
        <CloneButton />
        <ExportRecordButton language="yaml" />
        <DeleteWithConfirmButton />
    </TopToolbar>
);

export const RunShow = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBaseLive>
                <>
                    <ShowPageTitle icon={<RunIcon fontSize={'large'} />} />
                    <ShowView
                        actions={<ShowToolbar />}
                        sx={{
                            width: '100%',
                        }}
                        component={FlatCard}
                    >
                        <RunShowComponent />
                    </ShowView>
                </>
            </ShowBaseLive>
        </Container>
    );
};
