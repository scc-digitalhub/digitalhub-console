// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    FunctionField,
    IconButtonWithTooltip,
    Labeled,
    ListContextProvider,
    LoadingIndicator,
    Pagination,
    ResourceContextProvider,
    ShowBase,
    ShowView,
    TabbedShowLayout,
    TextField,
    TopToolbar,
    useCreatePath,
    useList,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { Container, Divider, Stack, Typography } from '@mui/material';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton, toYaml } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { TriggerIcon } from './icon';
import { FlatCard } from '../../common/components/FlatCard';
import { ShowPageTitle } from '../../common/components/PageTitle';
import { StateChips, StateColors } from '../../common/components/StateChips';
import { DeactivateButton } from './DeactivateButton';
import { AceEditorField } from '@dslab/ra-ace-editor';
import { MetadataField } from '../../features/jsonSchema/components/MetadataField';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { ActivateButton } from './ActivateButton';
import { IdField } from '../../common/components/IdField';
import { functionParser, taskParser } from '../../common/helper';
import {
    useGetRunIds,
    useTriggerRunsController,
} from '../../controllers/triggerRunsController';

export const TriggerShowComponent = () => {
    const record = useRecordContext();
    const translate = useTranslate();
    const createPath = useCreatePath();
    const navigate = useNavigate();

    const uri = record?.spec?.function
        ? new URL(record.spec.function)
        : record?.spec?.workflow
        ? new URL(record.spec.workflow)
        : null;

    const functionId =
        record?.spec?.function && uri ? uri.pathname.split(':')[1] : null;
    const workflowId =
        record?.spec?.workflow && uri ? uri.pathname.split(':')[1] : null;

    const states: any[] = [];
    for (const c in StateColors) {
        states.push({ id: c, name: translate('states.' + c.toLowerCase()) });
    }

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

            <TabbedShowLayout.Tab label={translate('fields.spec.title')}>
                <AceEditorField
                    source="spec"
                    parse={toYaml}
                    mode="yaml"
                    minLines={20}
                />
            </TabbedShowLayout.Tab>

            <TabbedShowLayout.Tab
                label={translate('resources.runs.name', { smart_count: 2 })}
            >
                <GeneratedRunsList />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    );
};

const GeneratedRunsList = () => {
    const translate = useTranslate();
    const result = useGetRunIds();
    const listContext = useTriggerRunsController(result);

    const renderFunctionName = record => {
        if (record?.spec?.function) {
            return <>{functionParser(record.spec.function).name}</>;
        }

        if (record?.spec?.workflow) {
            return <>{functionParser(record.spec.workflow).name}</>;
        }

        return <></>;
    };

    return (
        <ListContextProvider value={listContext}>
            <Typography variant="h6" gutterBottom>
                {translate('resources.runs.name', { smart_count: 2 })}
            </Typography>
            <ResourceContextProvider value="runs">
                <>
                    <Datagrid bulkActionButtons={false} rowClick="show">
                        <TextField source="id" label="fields.id" />
                        <DateField
                            source="metadata.created"
                            label="fields.created.title"
                            showDate
                            showTime
                        />
                        <DateField
                            source="metadata.updated"
                            label="fields.updated.title"
                            showDate
                            showTime
                        />
                        <FunctionField
                            source="spec.function"
                            label="fields.function.title"
                            sortable={false}
                            render={renderFunctionName}
                        />
                        <TextField source="kind" label="fields.kind" />
                        <FunctionField
                            source="spec.task"
                            label="fields.task.title"
                            sortable={false}
                            render={record =>
                                record?.spec?.task ? (
                                    <>{taskParser(record.spec.task).kind}</>
                                ) : (
                                    <></>
                                )
                            }
                        />
                        <StateChips
                            source="status.state"
                            label="fields.status.state"
                        />
                    </Datagrid>
                    <Pagination />
                </>
            </ResourceContextProvider>
        </ListContextProvider>
    );
};

const EventsList = (props: { record: any }) => {
    const { record } = props;
    const data = record?.status?.transitions ? record.status.transitions : [];
    const listContext = useList({ data });
    return (
        <Labeled label="fields.events.title">
            <ListContextProvider value={listContext}>
                <Datagrid bulkActionButtons={false} rowClick={false}>
                    <DateField
                        showTime
                        source="time"
                        label="fields.events.time.title"
                    />
                    <StateChips
                        source="status"
                        sortable={false}
                        label="fields.events.status.title"
                    />
                    <TextField
                        source="message"
                        sortable={false}
                        label="fields.events.message.title"
                    />
                    <TextField
                        source="details"
                        sortable={false}
                        label="fields.events.details.title"
                    />
                </Datagrid>
            </ListContextProvider>
        </Labeled>
    );
};

const ShowToolbar = () => (
    <TopToolbar>
        <BackButton />
        <InspectButton style={{ marginLeft: 'auto' }} fullWidth />
        <FunctionField
            render={record =>
                record.status?.state == 'RUNNING' ? (
                    <DeactivateButton record={record} />
                ) : record.status?.state == 'STOPPED' ? (
                    <ActivateButton record={record} />
                ) : null
            }
        />
        <ExportRecordButton language="yaml" />
        <DeleteWithConfirmButton />
    </TopToolbar>
);

export const TriggerShow = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBase>
                <>
                    <ShowPageTitle icon={<TriggerIcon fontSize={'large'} />} />
                    <ShowView
                        actions={<ShowToolbar />}
                        sx={{
                            width: '100%',
                        }}
                        component={FlatCard}
                    >
                        <TriggerShowComponent />
                    </ShowView>
                </>
            </ShowBase>
        </Container>
    );
};
