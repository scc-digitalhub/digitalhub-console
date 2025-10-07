// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Divider,
    FormControl,
    MenuItem,
    Select,
    Stack,
    InputLabel,
    Box,
} from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import {
    DateField,
    Labeled,
    RecordContextProvider,
    TextField,
} from 'react-admin';
import { ConditionsList } from './conditions';
import { StateChips } from '../../../components/StateChips';

export default function PodsTab(props: { record: any }) {
    const { record } = props;
    const pods = record?.status?.pods || [];

    const pod = pods[0] || null;
    const containers = pod?.containers || [];

    function formatDuration(ms) {
        if (!Number.isFinite(ms) || ms <= 0) return '0s';
        let s = Math.floor(ms / 1000);

        const days = Math.floor(s / 86400);
        s = s % 86400;

        const hours = Math.floor(s / 3600);
        s = s % 3600;

        const minutes = Math.floor(s / 60);
        const seconds = s % 60;

        if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
        if (minutes > 0) return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
    }

    const rawDuration = Date.now() - new Date(pod?.startTime).getTime();
    const durationFormatted = formatDuration(rawDuration);

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

    const selectedContainer = useMemo(() => {
        if (!pod || !selectedContainerName) return {};
        return (
            (pod.containers || []).find(
                (c: any) => c.name === selectedContainerName
            ) || {}
        );
    }, [pod, selectedContainerName]);

    const onSelectedContainer = (event: any) => {
        setSelectedContainerName(event.target.value);
    };

    const label = 'Container';

    const leftColumnWidth = '600px';

    return (
        <Stack spacing={1}>
            <RecordContextProvider value={pod ?? {}}>
                <Box
                    sx={{
                        display: { xs: 'block', sm: 'grid' },
                        gridTemplateColumns: { sm: `${leftColumnWidth} 1fr` },
                        gap: 1,
                        alignItems: 'center',
                    }}
                >
                    <Box>
                        <Labeled>
                            <TextField
                                source="name"
                                label="fields.name.title"
                            />
                        </Labeled>
                    </Box>

                    <Box>
                        <Labeled>
                            <TextField
                                source="namespace"
                                label="fields.namespace.title"
                            />
                        </Labeled>
                    </Box>

                    <Box>
                        <Labeled>
                            <DateField
                                source="startTime"
                                showTime
                                label="fields.startTime.title"
                            />
                        </Labeled>
                    </Box>

                    <Box>
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

            <Divider />

            <Box>
                <FormControl fullWidth>
                    <InputLabel>{label}</InputLabel>
                    <Select
                        value={selectedContainerName}
                        label={label}
                        onChange={onSelectedContainer}
                    >
                        {containers.length === 0 ? (
                            <MenuItem value="" disabled>
                                (no containers)
                            </MenuItem>
                        ) : (
                            containers.map((c: any) => (
                                <MenuItem key={c.name} value={c.name}>
                                    {c.name}
                                </MenuItem>
                            ))
                        )}
                    </Select>
                </FormControl>
            </Box>

            <RecordContextProvider value={selectedContainer ?? {}}>
                <Box
                    sx={{
                        display: { xs: 'block', sm: 'grid' },
                        gridTemplateColumns: { sm: `${leftColumnWidth} 1fr` },
                        gap: 1,
                        alignItems: 'center',
                    }}
                >
                    <Box>
                        <Labeled>
                            <TextField
                                source="name"
                                label="fields.container.name.title"
                            />
                        </Labeled>
                    </Box>

                    <Box>
                        <Labeled>
                            <TextField
                                source="image"
                                label="fields.container.image.title"
                            />
                        </Labeled>
                    </Box>

                    <Box>
                        <Labeled>
                            <TextField
                                source="ready"
                                label="fields.container.ready.title"
                            />
                        </Labeled>
                    </Box>

                    <Box>
                        <Labeled>
                            <TextField
                                source="restartCount"
                                label="fields.container.restartCount.title"
                            />
                        </Labeled>
                    </Box>

                    <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
                        <Labeled>
                            <TextField
                                source="state"
                                label="fields.container.state.title"
                            />
                        </Labeled>
                    </Box>
                </Box>
            </RecordContextProvider>

            <RecordContextProvider value={pod ?? {}}>
                <Labeled sx={{ pt: 1, pb: 1 }} label="fields.phase.title">
                    <Box sx={{ display: 'inline-flex' }}>
                        <StateChips source="phase" />
                    </Box>
                </Labeled>
            </RecordContextProvider>

            {pod?.conditions && <ConditionsList record={record} />}
        </Stack>
    );
}
