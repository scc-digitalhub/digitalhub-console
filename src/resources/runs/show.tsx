import {
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    FunctionField,
    IconButtonWithTooltip,
    Labeled,
    ListContextProvider,
    LoadingIndicator,
    Show,
    ShowBase,
    ShowButton,
    ShowView,
    SimpleShowLayout,
    TabbedShowLayout,
    TextField,
    TopToolbar,
    useCreatePath,
    useList,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import {
    Container,
    Divider,
    Grid,
    Stack,
    Typography,
    styled,
    Box,
} from '@mui/material';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton, toYaml } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { RunIcon } from './icon';
import { FlatCard } from '../../components/FlatCard';
import { ShowPageTitle } from '../../components/PageTitle';
import { StateChips } from '../../components/StateChips';
import { LogsButton, LogsView } from '../../components/LogsButton';
import { StopButton } from './StopButton';
import { useGetSchema } from '../../controllers/schemaController';
import { JsonSchemaField } from '../../components/JsonSchema';
import { AceEditorField } from '@dslab/ra-ace-editor';
import { MetadataField } from '../../components/MetadataField';
import { SourceCodeTab } from '../functions/show';
import { useEffect, useState } from 'react';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { JSONTree } from 'react-json-tree';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { useRootSelector } from '@dslab/ra-root-selector';
import { ResumeButton } from './ResumeButton';

export const RunShowLayout = () => {
    const translate = useTranslate();

    return (
        <Grid>
            <Typography variant="h6" gutterBottom>
                {translate('resources.run.title')}
            </Typography>
            <SimpleShowLayout>
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Labeled label={translate('resources.run.labelName')}>
                            <TextField source="name" />
                        </Labeled>
                    </Grid>
                </Grid>
            </SimpleShowLayout>
        </Grid>
    );
};

export const RunShowComponent = () => {
    const resource = useResourceContext();
    const record = useRecordContext();
    const translate = useTranslate();
    const schemaProvider = useSchemaProvider();
    const createPath = useCreatePath();
    const navigate = useNavigate();

    const [schema, setSchema] = useState<any>();

    const uri = record?.spec?.function ? new URL(record.spec.function) : null;

    const kind = uri
        ? uri.protocol.substring(0, uri.protocol.length - 1)
        : null;

    const functionId = uri ? uri.pathname.split(':')[1] : null;

    useEffect(() => {
        if (kind) {
            schemaProvider.get('functions', kind).then(res => {
                setSchema(res || null);
            });
        }
    }, [kind]);

    if (!record) return <LoadingIndicator />;

    return (
        <TabbedShowLayout record={record} syncWithLocation={false}>
            <TabbedShowLayout.Tab label={translate('fields.summary')}>
                <Stack direction={'row'} spacing={3}>
                    <Labeled>
                        <TextField source="name" />
                    </Labeled>

                    <Labeled>
                        <TextField source="kind" />
                    </Labeled>
                </Stack>
                <Labeled>
                    <TextField source="key" />
                </Labeled>
                {record?.metadata && <MetadataField />}
                <Divider />

                <Stack direction={'row'}>
                    <Labeled>
                        <TextField source="spec.task" />
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
                </Stack>

                <Labeled>
                    <StateChips source="status.state" />
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
            {record?.spec?.source && schema && (
                <TabbedShowLayout.Tab label={'fields.code'}>
                    <SourceCodeTab
                        sourceCode={record.spec.source}
                        spec={schema}
                    />
                </TabbedShowLayout.Tab>
            )}{' '}
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
                <LogsView id={record.id} resource={resource} />
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
        </TabbedShowLayout>
    );
};

const EventsList = (props: { record: any }) => {
    const { record } = props;
    const data = record?.status?.transitions ? record.status.transitions : [];
    const listContext = useList({ data });
    return (
        <Labeled label="fields.events">
            <ListContextProvider value={listContext}>
                <Datagrid bulkActionButtons={false} rowClick={false}>
                    <DateField showTime source="time" />
                    <StateChips source="status" sortable={false} />
                    <TextField source="message" sortable={false} />
                    <TextField source="details" sortable={false} />
                </Datagrid>
            </ListContextProvider>
        </Labeled>
    );
};

const ResultsList = (props: { record: any }) => {
    const { record } = props;
    const data = record?.status?.results
        ? Object.keys(record.status.results).map(k => ({
              id: k,
              key: k,
              value: JSON.stringify(record.status.results[k] || null),
          }))
        : [];
    const listContext = useList({ data });
    return (
        <Labeled label="fields.results">
            <ListContextProvider value={listContext}>
                <Datagrid bulkActionButtons={false} rowClick={false}>
                    <TextField source="key" label="fields.key.title" />
                    <TextField
                        source="value"
                        label="fields.value.title"
                        sortable={false}
                    />
                </Datagrid>
            </ListContextProvider>
        </Labeled>
    );
};

const InputsList = (props: { record: any }) => {
    const { record } = props;
    const data = record?.spec?.inputs
        ? Object.keys(record.spec.inputs).map(k => ({
              key: record.spec.inputs[k],
              name: k,
              id: k,
          }))
        : [];

    return (
        <Labeled label={'fields.inputs.title'}>
            <InputOutputsList data={data} />
        </Labeled>
    );
};

const OutputsList = (props: { record: any }) => {
    const { record } = props;
    const data = record?.status?.outputs
        ? Object.keys(record.status.outputs).map(k => ({
              key: record.status.outputs[k],
              name: k,
              id: k,
          }))
        : [];

    return (
        <Labeled label={'fields.outputs.title'}>
            <InputOutputsList data={data} />
        </Labeled>
    );
};

const InputOutputsList = (props: { data: any[] }) => {
    const { data } = props;
    const { root: projectId } = useRootSelector();

    const listContext = useList({ data: data || [] });
    return (
        <ListContextProvider value={listContext}>
            <Datagrid bulkActionButtons={false} rowClick={false}>
                <TextField source="name" label="fields.name.title" />
                <FunctionField
                    sortable={false}
                    label="fields.kind"
                    render={r => {
                        try {
                            if (
                                r.key.startsWith('store://' + projectId + '/')
                            ) {
                                //local ref, build path
                                const url = new URL(r.key);
                                const ip = url.pathname.substring(2).split('/');
                                const res = ip[1] + 's';
                                const rk = ip[2];
                                const i = ip[ip.length - 1].split(':');
                                if (i.length == 2) {
                                    const rn = i[0];
                                    const ri = i[1];

                                    return (
                                        <TextField
                                            record={{
                                                id: ri,
                                                kind: rk,
                                                resource: res,
                                            }}
                                            source={'kind'}
                                        />
                                    );
                                }
                            }
                        } catch (e) {}
                        return null;
                    }}
                />
                <TextField
                    source="key"
                    label="fields.key.title"
                    sortable={false}
                />

                <FunctionField
                    sortable={false}
                    render={r => {
                        try {
                            if (
                                r.key.startsWith('store://' + projectId + '/')
                            ) {
                                //local ref, build path
                                const url = new URL(r.key);
                                const ip = url.pathname.substring(2).split('/');
                                const res = ip[1] + 's';
                                const i = ip[ip.length - 1].split(':');
                                if (i.length == 2) {
                                    const rn = i[0];
                                    const ri = i[1];

                                    return (
                                        <ShowButton
                                            resource={res}
                                            record={{ id: ri }}
                                        />
                                    );
                                }
                            }
                        } catch (e) {}
                        return null;
                    }}
                />
            </Datagrid>
        </ListContextProvider>
    );
};

const K8sDetails = (props: { record: any }) => {
    const { record } = props;

    const json = record?.status?.k8s || {};

    return (
        <Labeled label="fields.k8s.title" fullWidth>
            <Box
                sx={{
                    backgroundColor: '#002b36',
                    px: 2,
                    py: 0,
                    minHeight: '20vw',
                }}
            >
                <JSONTree data={json} hideRoot />
            </Box>
        </Labeled>
    );
};

const ServiceDetails = (props: { record: any }) => {
    const { record } = props;

    const json = record?.status?.service || {};

    return (
        <Labeled label="fields.service.title" fullWidth>
            <Box
                sx={{
                    backgroundColor: '#002b36',
                    px: 2,
                    py: 0,
                    minHeight: '20vw',
                }}
            >
                <JSONTree data={json} hideRoot />
            </Box>
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
                    <ResumeButton record={record} />
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
            <ShowBase>
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
            </ShowBase>
        </Container>
    );
};
