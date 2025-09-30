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

    return (
        <Stack spacing={1}>
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
                <Labeled>
                    <TextField
                        source="name"
                        label="fields.container.name.title"
                    />
                </Labeled>

                <Labeled>
                    <TextField
                        source="image"
                        label="fields.container.image.title"
                    />
                </Labeled>

                <Labeled>
                    <TextField
                        source="ready"
                        label="fields.container.ready.title"
                    />
                </Labeled>

                <Labeled>
                    <TextField
                        source="restartCount"
                        label="fields.container.restartCount.title"
                    />
                </Labeled>

                <Labeled>
                    <TextField
                        source="state"
                        label="fields.container.state.title"
                    />
                </Labeled>
            </RecordContextProvider>

            <Divider />

            <RecordContextProvider value={pod ?? {}}>
                <Labeled>
                    <TextField source="name" label="fields.name.title" />
                </Labeled>
                <Labeled>
                    <DateField
                        source="startTime"
                        showTime
                        label="fields.startTime.title"
                    />
                </Labeled>

                <Labeled>
                    <TextField source="phase" label="fields.phase.title" />
                </Labeled>

                <Labeled>
                    <TextField
                        source="namespace"
                        label="fields.namespace.title"
                    />
                </Labeled>
            </RecordContextProvider>
            <Labeled width={100}>
                <StateChips source="status.state" label="fields.status.state" />
            </Labeled>
            {pod?.conditions && <ConditionsList record={record} />}
        </Stack>
    );
}
