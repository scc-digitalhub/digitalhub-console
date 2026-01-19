// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Stack,
    Box,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Accordion,
} from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import {
    DateField,
    Labeled,
    RecordContextProvider,
    TextField,
    useTranslate,
    useListController,
} from 'react-admin';
import { ConditionsList } from './conditions';
import { StateChips } from '../../../../../common/components/StateChips';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccordionProps } from '@mui/material/Accordion';
import { styled } from '@mui/material/styles';
import { JSONTree } from 'react-json-tree';
import { ChartView } from '../ChartView';
import { formatDuration } from '../../../../../common/utils/helper';
import { EventsList } from './events';

const AccordionStyle = styled((props: AccordionProps) => (
    <Accordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    width: `100%`,
    borderTop: `1px solid ${theme.palette.divider}`,
    '&::before': { display: 'none' },
    '& .MuiAccordionSummary-expandIconWrapper': { color: '#E0701B' },
}));

export default function ComputeResources(props: { record: any }) {
    const leftColumnWidth = '500px';
    const translate = useTranslate();
    const { record } = props;
    const pods = record?.status?.pods || [];
    const pod = pods[0] || null;
    const containers = pod?.containers || [];
    const rawDuration = Date.now() - new Date(pod?.startTime).getTime();
    const durationFormatted = formatDuration(rawDuration).asString;

    if (pod?.phase === 'Running') {
        pod.duration = durationFormatted;
    }

    const [selectedContainerName, setSelectedContainerName] = useState<string>(
        containers[0]?.name ?? ''
    );

    useEffect(() => {
        const first = (pod?.containers && pod.containers[0]?.name) ?? '';
        setSelectedContainerName(prev => {
            if (!pod) return '';
            if (prev && pod.containers?.some((c: any) => c.name === prev))
                return prev;
            return first;
        });
    }, [pod, pod?.containers]);

    const { data: logsData } = useListController({
        resource: 'logs',
        sort: { field: 'created', order: 'DESC' },
        filter: {},
        perPage: 200,
        disableSyncWithLocation: true,
    });

    const podNamesToMatch = useMemo(() => {
        const s = new Set<string>();
        if (pod?.name) s.add(pod.name);
        if (pod?.metadata?.name) s.add(pod.metadata.name);
        if (record?.metadata?.name) s.add(record.metadata.name);
        if (pod?.metadata?.uid) s.add(pod.metadata.uid);
        return Array.from(s);
    }, [pod, record]);

    const availableLogs = useMemo(() => {
        if (!logsData) return [];
        if (podNamesToMatch.length === 0) return logsData;
        return logsData.filter((r: any) => {
            const podField = r?.status?.pod || r?.metadata?.pod || r?.spec?.pod;
            if (!podField) return false;
            return podNamesToMatch.includes(podField);
        });
    }, [logsData, podNamesToMatch]);

    useEffect(() => {
        if (!availableLogs || availableLogs.length === 0) return;
        const mostRecent = availableLogs[0];
        const containerFromMostRecent = mostRecent?.status?.container || '';
        if (
            selectedContainerName &&
            selectedContainerName === containerFromMostRecent
        )
            return;
        if (containerFromMostRecent)
            setSelectedContainerName(containerFromMostRecent);
    }, [availableLogs]);

    const selectedContainer = useMemo(() => {
        if (!pod || !selectedContainerName) return {};
        return (
            (pod.containers || []).find(
                (c: any) => c.name === selectedContainerName
            ) || {}
        );
    }, [pod, selectedContainerName]);

    return (
        <Stack spacing={1}>
            {pod && (
                <RecordContextProvider value={pod}>
                    {record?.id && pod.containers && (
                        <ChartView id={record.id as string} resource="runs" />
                    )}

                    <Box
                        sx={{
                            display: { xs: 'block', sm: 'grid' },
                            gridTemplateColumns: {
                                sm: `${leftColumnWidth} 1fr`,
                            },
                            alignItems: 'center',
                        }}
                    >
                        <Box sx={{ gridColumn: { sm: '1 / 2' } }}>
                            <Labeled>
                                <DateField
                                    source="startTime"
                                    showTime
                                    label="fields.startTime.title"
                                />
                            </Labeled>
                        </Box>

                        <Box sx={{ gridColumn: { sm: '2 / 3' } }}>
                            {pod?.phase === 'Running' ? (
                                <Labeled>
                                    <TextField
                                        source="duration"
                                        label="fields.duration.title"
                                    />
                                </Labeled>
                            ) : (
                                <Box sx={{ minHeight: '1.6rem' }} />
                            )}
                        </Box>
                    </Box>
                </RecordContextProvider>
            )}

            {selectedContainer && (
                <RecordContextProvider value={selectedContainer}>
                    <Box
                        sx={{
                            display: { xs: 'block', sm: 'grid' },
                            gridTemplateColumns: {
                                sm: `${leftColumnWidth} 1fr`,
                            },
                            alignItems: 'center',
                        }}
                    >
                        <Box sx={{ gridColumn: { sm: '1 / 2' } }}>
                            <Labeled>
                                <TextField
                                    source="ready"
                                    label="fields.container.ready.title"
                                />
                            </Labeled>
                        </Box>

                        <Box sx={{ gridColumn: { sm: '2 / 3' } }}>
                            <Labeled>
                                <TextField
                                    source="restartCount"
                                    label="fields.container.restartCount.title"
                                />
                            </Labeled>
                        </Box>

                        <Box sx={{ gridColumn: { sm: '1 / 2' } }}>
                            <Labeled>
                                <TextField
                                    source="state"
                                    label="fields.container.state.title"
                                />
                            </Labeled>
                        </Box>

                        <Box sx={{ gridColumn: { sm: '2 / 3' } }}>
                            <Labeled>
                                <TextField
                                    source="image"
                                    label="fields.container.image.title"
                                />
                            </Labeled>
                        </Box>
                    </Box>
                </RecordContextProvider>
            )}

            {pod && (
                <RecordContextProvider value={pod}>
                    {pod && (
                        <Labeled
                            sx={{ pt: 1, pb: 1 }}
                            label="fields.phase.title"
                        >
                            <Box sx={{ display: 'inline-flex' }}>
                                <StateChips source="phase" />
                            </Box>
                        </Labeled>
                    )}
                </RecordContextProvider>
            )}

            {record?.status?.events && (
                <AccordionStyle>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h5">
                            {translate('fields.events.title')}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <EventsList record={record} />
                    </AccordionDetails>
                </AccordionStyle>
            )}

            {pod?.conditions && (
                <AccordionStyle>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h5">
                            {translate('fields.conditions.title')}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ConditionsList record={record} />
                    </AccordionDetails>
                </AccordionStyle>
            )}

            {record?.status?.k8s && (
                <AccordionStyle>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h5">{'Details'}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box
                            sx={{
                                backgroundColor: '#002b36',
                                px: 2,
                                py: 0,
                                minHeight: '20vw',
                            }}
                        >
                            <JSONTree data={record?.status?.k8s} hideRoot />
                        </Box>
                    </AccordionDetails>
                </AccordionStyle>
            )}
        </Stack>
    );
}
