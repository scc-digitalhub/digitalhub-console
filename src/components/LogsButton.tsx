import React, { Fragment, ReactElement, useCallback, useMemo, useState } from 'react';
import {
    Button,
    ButtonProps,
    DateField,
    Labeled,
    LoadingIndicator,
    RaRecord,
    RecordContextProvider,
    RefreshButton,
    TextField,
    useGetResourceLabel,
    useListController,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import {
    Box,
    Breakpoint,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    styled,
} from '@mui/material';
import SegmentIcon from '@mui/icons-material/Segment';
import { LazyLog } from '@melloware/react-logviewer';
import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import Parser from 'k8s-resource-parser';
import { ByteConverter, B as Byte } from '@wtfcode/byte-converter';

const defaultIcon = <SegmentIcon />;

export const LogsButton = (props: LogsButtonProps) => {
    const {
        id: idFromProps,
        label = 'fields.logs',
        icon = defaultIcon,
        fullWidth = true,
        maxWidth = 'md',
        color = 'info',
        record: recordFromProps,
        resource: resourceFromProps,
        ...rest
    } = props;
    const translate = useTranslate();
    const [open, setOpen] = useState(false);

    const resourceContext = useResourceContext();
    const recordContext = useRecordContext();

    const resource = resourceFromProps || resourceContext;
    const record = recordFromProps || recordContext;

    const id = idFromProps || record?.id;

    const isLoading = !record;

    const handleDialogOpen = e => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose = e => {
        e.stopPropagation();
        setOpen(false);
    };
    const handleClick = useCallback(e => {
        e.stopPropagation();
    }, []);

    return (
        <Fragment>
            <Button
                label={label}
                onClick={handleDialogOpen}
                color={color}
                {...rest}
            >
                {icon}
            </Button>
            <Dialog
                open={open}
                onClose={handleDialogClose}
                onClick={handleClick}
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                aria-labelledby="logs-dialog-title"
            >
                <DialogTitle id="logs-dialog-title" sx={{ paddingBottom: 0 }}>
                    {translate(label)}
                </DialogTitle>

                <DialogContent>
                    {isLoading ? (
                        <LoadingIndicator />
                    ) : (
                        <LogsView id={id} resource={resource} />
                    )}
                </DialogContent>
            </Dialog>
        </Fragment>
    );
};

export type LogsButtonProps<RecordType extends RaRecord = any> = ButtonProps & {
    /**
     * (Optional) ref id, by default uses record.id
     */
    id?: string;
    /**
     * (Optional) Custom icon for the button
     */
    icon?: ReactElement;
    /**
     * (Optional) record object to use in place of the context
     */
    record?: RecordType;
    /**
     * (Optional) resource identifier to use in place of the context
     */
    resource?: string;
    /**
     * Display the modal window as full-width, filling the viewport. Defaults to `false`
     */
    fullWidth?: boolean;
    /**
     * Max width for the modal window (breakpoint). Defaults to `md`
     */
    maxWidth?: Breakpoint;
};

const LogsView = (props: LogsButtonProps) => {
    const { id, resource } = props;
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    const [cur, setCur] = useState<any>(undefined);

    const label = getResourceLabel('logs', 1).toLowerCase();

    const filter = useMemo(() => {
        const f = {};
        if ('runs' === resource && id) {
            f['run'] = id;
        }
        return f;
    }, [resource, id]);

    //TODO handle pagination?
    const { data, page, total, setPage, isLoading } = useListController({
        resource: 'logs',
        sort: { field: 'created', order: 'DESC' },
        filter,
        perPage: 100,
        disableSyncWithLocation: true,
    });

    if (!data) {
        return <LoadingIndicator />;
    }

    const selected = cur ? cur.id : '';
    const onSelected = e => {
        if (e.target?.value && data) {
            const r = data.find(r => r.id === e.target.value);
            setCur(r);
        }
    };

    return (
        <Stack>
            <Box>
                <FormControl fullWidth>
                    <InputLabel>{label}</InputLabel>
                    <Select
                        value={selected}
                        label={label}
                        onChange={onSelected}
                    >
                        {data.map(r => {
                            return (
                                <MenuItem
                                    key={'logs-list-select-' + r.id}
                                    value={r.id}
                                >
                                    {r.status?.container || r.metadata?.updated}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ pt: 2 }}>
                <RecordContextProvider value={cur}>
                    <LogsDetail />
                </RecordContextProvider>
            </Box>
        </Stack>
    );

    // return (
    //     <List
    //         component={Box}
    //         resource={'logs'}
    //         actions={false}
    //         sort={{ field: 'created', order: 'DESC' }}
    //         filter={filter}
    //         perPage={100}
    //         pagination={false}
    //         disableSyncWithLocation
    //         storeKey={false}
    //         aside={<LogsDetail />}
    //     >
    //         <SimpleList
    //             linkType={false}
    //             key={resource + ':logs:'}
    //             primaryText={item => {
    //                 const value = item.metadata?.updated
    //                     ? new Date(item.metadata.updated).toLocaleString()
    //                     : item.id;

    //                 return <Typography color={'primary'}>{value}</Typography>;
    //             }}
    //             secondaryText={item => {
    //                 return <> {item.status?.pod} </>;
    //             }}
    //         />
    //     </List>
    // );
};

const LogsDetail = (props: { record?: any }) => {
    const { record: recordFromProps } = props;
    const recordContext = useRecordContext();
    const ref = React.createRef<LazyLog>();

    const record = recordFromProps || recordContext;
    if (!record) {
        return <></>;
    }

    let text = '\n';
    try {
        text = atob(record.content || '');
    } catch (e: any) {}

    return (
        <Stack spacing={2}>
            <Stack direction={'row'} spacing={2}>
                <Labeled>
                    <DateField source="metadata.created" showTime />
                </Labeled>
                <Labeled>
                    <DateField source="metadata.updated" showTime />
                </Labeled>
            </Stack>
            {record.status?.pod && (
                <Labeled>
                    <TextField source="status.pod" />
                </Labeled>
            )}

            {record.status?.container && (
                <Labeled>
                    <TextField source="status.container" />
                </Labeled>
            )}

            {record.status?.metrics && (
                <LogMetrics metrics={record.status.metrics} />
            )}

            <LogViewer sx={{ height: '100%', minHeight: '520px' }}>
                <LazyLog
                    ref={ref}
                    text={text}
                    caseInsensitive={true}
                    enableLineNumbers={true}
                    enableLinks={false}
                    enableMultilineHighlight={true}
                    enableSearch={true}
                    enableSearchNavigation={true}
                    selectableLines={true}
                    width={'auto'}
                />
            </LogViewer>

            <RefreshButton />
        </Stack>
    );
};

const LogViewer = styled(Box, {
    name: 'LogViewer',
    overridesResolver: (_props, styles) => styles.root,
})(() => ({
    [`& .log-line > .log-number`]: {
        marginLeft: 0,
        marginRight: 0,
    },
}));

const LogMetrics = (props: { metrics: any[] }) => {
    const { metrics } = props;
    const keyToLabel: { [key: string]: string } = {
        cpu: 'Cpu (n)',
        memory: 'Memory (MB)',
    };

    const data = metrics.map((m: { timestamp: any; usage: any }) => {
        let val = { timestamp: new Date(m.timestamp) };
        if (m.usage.memory) {
            //parse kubernetes resource and convert to Megabytes
            const bytes = Parser.memoryParser(m.usage.memory);
            val['memory'] = ByteConverter.convert(
                Byte.value(bytes),
                'MB'
            ).value;
        }
        if (m.usage.cpu) {
            //convert nanocores to millicores
            const cpu = m.usage.cpu.endsWith('n')
                ? parseInt(m.usage.cpu.slice(0, -1))/1000000
                : parseInt(m.usage.cpu);
            val['cpu'] = cpu;
        }
        return val;
    });

    return (
        <LineChart
            xAxis={[
                {
                    dataKey: 'timestamp',
                    scaleType: 'time',
                    tickNumber: 4,
                    valueFormatter: (value: Date, context) =>
                        context.location === 'tick'
                            ? `${value.toLocaleDateString()}\n${value.toLocaleTimeString()}`
                            : value.toLocaleString(),
                },
            ]}
            yAxis={Object.keys(keyToLabel).map(key => ({
                id: key,
                scaleType: 'linear',
                label: keyToLabel[key],
                min: 0,
            }))}
            series={Object.keys(keyToLabel).map(key => ({
                dataKey: key,
                label: keyToLabel[key],
                yAxisKey: key,
                showMark: false,
            }))}
            margin={{ top: 50, right: 50, bottom: 50, left: 65 }}
            sx={{
                [`.${axisClasses.left} .${axisClasses.label}`]: {
                    transform: 'translateX(-15px)',
                },
            }}
            dataset={data}
            leftAxis="cpu"
            rightAxis="memory"
            height={300}
        />
    );
};
