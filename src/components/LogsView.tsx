// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Button,
    DateField,
    Labeled,
    LoadingIndicator,
    RecordContextProvider,
    useGetResourceLabel,
    useListController,
    useRecordContext,
    TopToolbar,
    ToolbarClasses,
    Identifier,
} from 'react-admin';
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    styled,
} from '@mui/material';
import NavigationRefresh from '@mui/icons-material/Refresh';
import { LazyLog } from '@melloware/react-logviewer';
import DownloadIcon from '@mui/icons-material/GetApp';

type LogsViewProps = {
    id?: Identifier;
    resource?: string;
};

export const LogsView = (props: LogsViewProps) => {
    const { id, resource } = props;
    const getResourceLabel = useGetResourceLabel();
    const [selectedId, setSelectedId] = useState<string>('');
    const [currentLog, setCurrentLog] = useState<any>(undefined);

    const label = getResourceLabel('logs', 1).toLowerCase();

    const filter = useMemo(() => {
        const f = {};
        if ('runs' === resource && id) {
            f['run'] = id;
        }
        return f;
    }, [resource, id]);

    //TODO handle pagination?
    const { data, refetch } = useListController({
        resource: 'logs',
        sort: { field: 'created', order: 'DESC' },
        filter,
        perPage: 100,
        disableSyncWithLocation: true,
    });

    useEffect(() => {
        if (data && selectedId != '') {
            const r = data.find(r => r.id === selectedId);
            setCurrentLog(r);
        } else {
            setCurrentLog(undefined);
        }
    }, [data, selectedId]);

    if (!data) {
        return <LoadingIndicator />;
    }

    const onSelected = e => {
        if (e.target?.value) {
            setSelectedId(e.target.value);
        } else {
            setSelectedId('');
        }
    };

    return (
        <Stack>
            <Box>
                <FormControl fullWidth>
                    <InputLabel>{label}</InputLabel>
                    <Select
                        value={selectedId}
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
                <RecordContextProvider value={currentLog}>
                    <LogsDetail refresh={refetch} />
                </RecordContextProvider>
            </Box>
        </Stack>
    );
};

const LogsDetail = (props: { record?: any; refresh?: () => void }) => {
    const { record: recordFromProps, refresh } = props;
    const recordContext = useRecordContext();
    const ref = React.createRef<LazyLog>();

    const handleRefresh = useCallback(
        event => {
            event.preventDefault();
            if (refresh) refresh();
        },
        [refresh]
    );

    const record = recordFromProps || recordContext;

    let text = '\n';
    if (record) {
        try {
            text = atob(record.content || '');
        } catch (e: any) {
            /* empty */
        }
    }

    if (!record) {
        return <></>;
    }

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
            <TopToolbar
                className={ToolbarClasses.mobileToolbar}
                sx={{ mb: 0, pb: 0 }}
            >
                <Button label="" onClick={handleRefresh}>
                    <NavigationRefresh />
                </Button>
                <DownloadButton label="" record={record} />
            </TopToolbar>
            <LogViewer sx={{ height: '100%', minHeight: '520px' }}>
                <LazyLog
                    key={record.id}
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
        </Stack>
    );
};

const DownloadButton = (props: { record: any; label?: string }) => {
    const { record, label = 'actions.download' } = props;

    const filename = record.status?.container || record.id;
    let text = '\n';
    try {
        text = atob(record.content || '');
    } catch (e: any) {
        /* empty */
    }

    const handleDownload = e => {
        e.stopPropagation();

        //export string as blob with exposed contextType
        const blob = new Blob([text], {
            type: 'text/plain;charset=utf-8',
        });

        // Creating the hyperlink and auto click it to start the download
        const link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);

        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.txt`;
        link.click();
    };

    return (
        <Button label={label} color={'info'} onClick={handleDownload}>
            <DownloadIcon />
        </Button>
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
