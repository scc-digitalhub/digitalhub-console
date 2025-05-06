import {
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    FunctionField,
    IconButtonWithTooltip,
    Labeled,
    ListContextProvider,
    LoadingIndicator,
    ShowView,
    TabbedShowLayout,
    TextField,
    TopToolbar,
    useCreatePath,
    useList,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { Container, Divider, Stack } from '@mui/material';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton, toYaml } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { TriggerIcon } from './icon';
import { FlatCard } from '../../components/FlatCard';
import { ShowPageTitle } from '../../components/PageTitle';
import { StateChips, StateColors } from '../../components/StateChips';
import { StopButton } from './StopButton';
import { AceEditorField } from '@dslab/ra-ace-editor';
import { MetadataField } from '../../components/MetadataField';
import { useEffect, useState } from 'react';
import { useSchemaProvider } from '../../provider/schemaProvider';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { RunButton } from './RunButton';
import { IdField } from '../../components/IdField';
import { LineageTabComponent } from '../../components/lineage/LineageTabComponent';
import { ShowBaseLive } from '../../components/ShowBaseLive';

export const TriggerShowComponent = () => {
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

            <TabbedShowLayout.Tab label="pages.lineage.title">
                <LineageTabComponent />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
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
                    <StopButton record={record} />
                ) : record.status?.state == 'STOPPED' ? (
                    <RunButton record={record} />
                ) : null
            }
        />
        <ExportRecordButton language="yaml" />
        <DeleteWithConfirmButton />
    </TopToolbar>
);

export const RunShow = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBaseLive>
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
            </ShowBaseLive>
        </Container>
    );
};
