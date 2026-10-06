// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Datagrid,
    DateField,
    Labeled,
    ListContextProvider,
    RecordContextProvider,
    TextField,
    useList,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import {
    Controls,
    Edge,
    Handle,
    MarkerType,
    Node,
    NodeProps,
    Position,
    ReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { StateChips } from '../../../../common/components/StateChips';
import { endStates } from '../../../../common/components/RunStateBadge';
import { formatDuration } from '../../../../common/utils/helpers';

export const TransitionsList = (props: {
    record: any;
    variant?: 'list' | 'graph';
}) => {
    const { variant = 'list' } = props;
    const record = useRecordContext(props);
    const data = record?.status?.transitions ? record.status.transitions : [];
    const listContext = useList({ data });
    if (variant === 'graph') {
        return (
            <Labeled label="fields.events.title" sx={{ width: '100%' }}>
                <TransitionsGraph transitions={data} />
            </Labeled>
        );
    }
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

type Transition = {
    time?: string;
    status?: string;
    message?: string;
    details?: string;
};

type TransitionNode = Node<
    {
        transition: Transition;
        duration?: number;
        hasIncoming: boolean;
        hasOutgoing: boolean;
    },
    'transition'
>;

const TransitionEventNode = ({ id, data }: NodeProps<TransitionNode>) => (
    <RecordContextProvider value={{ ...data.transition, id }}>
        <Box
            sx={{
                width: 220,
                height: 112,
                p: 1,
                boxSizing: 'border-box',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.paper',
                '& .MuiChip-label': { fontSize: '1rem' },
            }}
        >
            {data.hasIncoming && (
                <Handle type="target" position={Position.Left} />
            )}
            <Stack spacing={0.5} alignItems="center">
                <Stack direction="row" alignItems="center">
                    <StateChips source="status" size="medium" />
                    {data.transition.message && (
                        <Tooltip title={data.transition.message}>
                            <InfoIcon
                                className="nodrag nopan"
                                fontSize="small"
                                color="disabled"
                                sx={{
                                    ml: 0.3,
                                    pointerEvents: 'auto',
                                    cursor: 'default',
                                }}
                            />
                        </Tooltip>
                    )}
                </Stack>
                <DateField source="time" showTime />
                {data.duration !== undefined && (
                    <Typography
                        variant="h6"
                        color="secondary"
                        sx={{ fontWeight: 'bold' }}
                    >
                        {formatDuration(data.duration).asString}
                    </Typography>
                )}
            </Stack>
            {data.hasOutgoing && (
                <Handle type="source" position={Position.Right} />
            )}
        </Box>
    </RecordContextProvider>
);

const transitionNodeTypes = { transition: TransitionEventNode };

const TransitionsGraph = ({ transitions }: { transitions: Transition[] }) => {
    const translate = useTranslate();
    const orderedTransitions = [...transitions].reverse();
    const nodes: TransitionNode[] = orderedTransitions.map(
        (transition, index) => {
            const startTime = transition.time
                ? new Date(transition.time).getTime()
                : undefined;
            const nextTime = orderedTransitions[index + 1]?.time;
            const isFinalTransition =
                index === orderedTransitions.length - 1 &&
                endStates.includes(transition.status?.toUpperCase() ?? '');
            const endTime = nextTime
                ? new Date(nextTime).getTime()
                : isFinalTransition
                ? undefined
                : Date.now();

            return {
                id: String(index),
                type: 'transition',
                position: { x: index * 280, y: 0 },
                data: {
                    transition,
                    hasIncoming: index > 0,
                    hasOutgoing: index < orderedTransitions.length - 1,
                    duration:
                        index > 0 &&
                        startTime !== undefined &&
                        endTime !== undefined
                            ? endTime - startTime
                            : undefined,
                },
            };
        }
    );
    const edges: Edge[] = orderedTransitions
        .slice(1)
        .map((transition, index) => ({
            id: `${index}-${index + 1}`,
            source: String(index),
            target: String(index + 1),
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed },
        }));

    return (
        <Box
            sx={{
                width: '100%',
                height: 280,
                bgcolor: theme =>
                    theme.palette.mode === 'dark'
                        ? theme.palette.grey[900]
                        : theme.palette.grey[100],
            }}
        >
            {nodes.length === 0 ? (
                <Typography color="text.secondary">
                    {translate('ra.navigation.no_results')}
                </Typography>
            ) : (
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={transitionNodeTypes}
                    proOptions={{ hideAttribution: true }}
                    fitView
                    fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
                    nodesConnectable={false}
                    nodesDraggable={false}
                    elementsSelectable={false}
                    zoomOnScroll={false}
                >
                    <Controls showInteractive={false} />
                </ReactFlow>
            )}
        </Box>
    );
};
