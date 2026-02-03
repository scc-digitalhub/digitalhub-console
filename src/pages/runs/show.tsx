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
import { FlatCard } from '../../common/components/layout/FlatCard';
import { ShowPageTitle } from '../../common/components/layout/PageTitle';
import { StateChips, StateColors } from '../../common/components/StateChips';
import { LogsView } from '../../features/logs/components/LogsView';
import { StopButton } from './components/StopButton';
import { AceEditorField } from '@dslab/ra-ace-editor';
import { useEffect, useState } from 'react';
import { useSchemaProvider } from '../../common/provider/schemaProvider';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { ResumeButton } from './components/ResumeButton';
import { countLines } from '../../common/utils/helper';
import { functionParser } from '../../common/utils/parsers';
import { IdField } from '../../common/components/fields/IdField';
import { WorkflowView } from '../workflows/components/WorkflowView';
import { LineageTabComponent } from '../../features/lineage/components/LineageTabComponent';
import { ShowBaseLive } from '../../features/notifications/components/ShowBaseLive';
import { ServiceDetails } from './components/tabs/service';
import { TransitionsList } from './components/tabs/transitions';
import { Inputs, Outputs } from './components/tabs/inputOutputs';

import { CloneButton } from './components/CloneButton';
import ComputeResources from './components/tabs/computeResources';
import { SourceCodeView } from '../../features/sourcecode/components/SourceCodeView';
import { getFunctionUiSpec } from '../functions/types';
import { MetricsGrid } from '../../features/metrics/components/MetricsGrid';
import { MetadataField } from '../../features/metadata/components/MetadataField';
import { ClientButton } from '../../features/httpclients/components/ClientButton';

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
                {record?.status?.transitions && (
                    <TransitionsList record={record} />
                )}
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
                    minLines={lineCount[0]}
                    maxLines={lineCount[1]}
                />
            </TabbedShowLayout.Tab>
            {(record?.spec?.source || record?.spec?.fab_source) &&
                schema?.schema && (
                    <TabbedShowLayout.Tab label={'fields.code'}>
                        <SourceCodeView
                            sourceCode={record.spec.source}
                            fabSourceCode={record.spec.fab_source}
                            requirements={record.spec.requirements}
                            schema={schema.schema}
                            uiSchema={getFunctionUiSpec()}
                        />
                    </TabbedShowLayout.Tab>
                )}
            {(record?.spec?.inputs || record?.spec?.parameters) && (
                <TabbedShowLayout.Tab label={'fields.inputs.title'}>
                    <Inputs record={record} />
                </TabbedShowLayout.Tab>
            )}
            {(record?.status?.outputs || record?.status?.results) && (
                <TabbedShowLayout.Tab label={'fields.outputs.title'}>
                    <Outputs record={record} />
                </TabbedShowLayout.Tab>
            )}
            <TabbedShowLayout.Tab label={translate('fields.logs')}>
                {record?.id && (
                    <LogsView id={record.id as string} resource={resource} />
                )}
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label={'fields.k8s.title'}>
                <ComputeResources record={record} />
            </TabbedShowLayout.Tab>
            {record?.status?.service && (
                <TabbedShowLayout.Tab label={'fields.service.title'}>
                    <ServiceDetails record={record} />
                </TabbedShowLayout.Tab>
            )}
            {record?.status?.metrics &&
                Object.keys(record.status.metrics).length > 0 && (
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
                                        functionParser(record.spec.function)
                                            .name
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

const ShowToolbar = () => {
    const record = useRecordContext();

    return (
        <TopToolbar>
            <BackButton />
            <InspectButton style={{ marginLeft: 'auto' }} fullWidth />
            {record?.status?.service?.url && <ClientButton />}
            {record?.status?.openai ? (
                <ClientButton mode="chat" />
            ) : (
                <ClientButton mode="v2" />
            )}
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
};

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
                            minWidth: '1000px',
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
