import React, { Fragment, ReactElement, useMemo, useState } from 'react';
import {
    Button,
    ButtonProps,
    DateField,
    Labeled,
    List,
    LoadingIndicator,
    Pagination,
    RaRecord,
    RecordContextProvider,
    RefreshButton,
    SelectInput,
    ShowButton,
    SimpleList,
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
    Typography,
    styled,
    useTheme,
} from '@mui/material';
import SegmentIcon from '@mui/icons-material/Segment';
import CloseIcon from '@mui/icons-material/Close';
import { LazyLog } from '@melloware/react-logviewer';

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
        setOpen(false);
        e.stopPropagation();
    };

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
