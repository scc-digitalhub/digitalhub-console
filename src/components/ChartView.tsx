// ChartView.tsx
// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import{ useEffect, useMemo, useState } from 'react';
import {
    LoadingIndicator,
    RecordContextProvider,
    useGetResourceLabel,
    useListController,
    useRecordContext,
    Labeled,
    DateField,
    TextField,
    Identifier,
} from 'react-admin';
import { Box, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { LogMetrics } from './LogsView';

type ChartViewProps = {
    id?: Identifier;
    resource?: string;
    onContainerSelect?: (containerName: string) => void;
};

export const ChartView = (props: ChartViewProps) => {
    const { id, resource, onContainerSelect } = props;
    const getResourceLabel = useGetResourceLabel();
    const [selectedId, setSelectedId] = useState<string>('');
    const [currentLog, setCurrentLog] = useState<any>(undefined);

    const label = getResourceLabel('logs', 1).toLowerCase();

    const filter = useMemo(() => {
        const f: any = {};
        if ('runs' === resource && id) {
            f['run'] = id;
        }
        return f;
    }, [resource, id]);

    const { data } = useListController({
        resource: 'logs',
        sort: { field: 'created', order: 'DESC' },
        filter,
        perPage: 100,
        disableSyncWithLocation: true,
    });

    const recordContext = useRecordContext();
    const podName = recordContext?.status?.pod || recordContext?.metadata?.name || recordContext?.name || '';

    const filteredData = useMemo(() => {
        if (!data) return [];
        if (!podName) return data;
        return data.filter((r: any) => {
            const podField = r?.status?.pod || r?.metadata?.pod || r?.spec?.pod;
            return !!podField && podField === podName;
        });
    }, [data, podName]);

    useEffect(() => {
        if (data && selectedId !== '') {
            const r = data.find((r: any) => r.id === selectedId);
            setCurrentLog(r);
        } else {
            setCurrentLog(undefined);
        }
    }, [data, selectedId]);

    useEffect(() => {
        const containerName = currentLog?.status?.container || '';
        if (typeof onContainerSelect === 'function') {
            onContainerSelect(containerName);
        }
    }, [currentLog, onContainerSelect]);

    if (!data) {
        return <LoadingIndicator />;
    }

    const onSelected = (e: any) => {
        if (e.target?.value) {
            setSelectedId(e.target.value);
        } else {
            setSelectedId('');
        }
    };

    const LogsPreview = () => {
        const record = useRecordContext();
        if (!record) return <></>;

        return (
            <Stack spacing={2}>
                <Stack direction={'row'} spacing={8}>
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
            </Stack>
        );
    };

    return (
        <Stack>
            <Box>
                <FormControl fullWidth>
                    <InputLabel>{label}</InputLabel>
                    <Select value={selectedId} label={label} onChange={onSelected}>
                        
                        {filteredData.map((r: any) => (
                            <MenuItem key={'chart-logs-select-' + r.id} value={r.id}>
                                {r.status?.container || r.metadata?.updated || r.id}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ pt: 1 }}>
                <RecordContextProvider value={currentLog ?? {}}>
                    {selectedId && currentLog ? (
                        <>
                            <LogsPreview />
                            {currentLog?.status?.metrics && (
                                <Box sx={{ pt: 1 }}>
                                    <LogMetrics metrics={currentLog.status.metrics} />
                                </Box>
                            )}
                        </>
                    ) : null}
                </RecordContextProvider>
            </Box>
        </Stack>
    );
};
