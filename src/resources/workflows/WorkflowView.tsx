// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useState } from 'react';
import { Box } from '@mui/system';

import {
    Node,
    Edge,
    ReactFlow,
    Background,
    BackgroundVariant,
    Controls,
    applyEdgeChanges,
    applyNodeChanges,
    MarkerType,
    ReactFlowInstance,
    Position,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import {
    Labeled,
    TextField,
    DateField,
    ChipField,
    RecordContextProvider,
    useRecordContext,
    useDataProvider,
    Link,
    useCreatePath,
    Datagrid,
} from 'react-admin';
import { Grid, Divider } from '@mui/material';

import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

export type WorkflowViewProps = {
    record?: any;
};

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    dagreGraph.setGraph({ rankdir: 'TB' });

    nodes.forEach(node => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach(edge => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach(node => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = Position.Top;
        node.sourcePosition = Position.Bottom;

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
    });

    return { nodes, edges };
};
export const WorkflowView = (props: WorkflowViewProps) => {
    const record = useRecordContext(props);
    const createPath = useCreatePath();
    const dataProvider = useDataProvider();

    let interval: any = null;

    const [gnodes, setNodes] = useState<Node<any>[]>();
    const [gedges, setEdges] = useState<Edge<any>[]>();

    const buildGraph = run => {
        const graph =
            run && run.status && run.status.nodes 
                ? run.status.nodes
                : [];
        // const graph = [
        //     {type:'DAG', id: 'root', display_name: 'root', children: ['1'], state: 'Error'},
        //     {type:'TASK', id: '1', display_name: '1', children: ['2', '3'], state: 'Succeeded'},
        //     {type:'TASK', id: '2', display_name: '2', children: ['4'], state : 'Failed'},
        //     {type:'TASK', id: '3', display_name: '3', children: ['4'], state : 'Ready'},
        //     {type:'TASK', id: '4', display_name: '4'},
        // ];
        const { nodes, edges } = computeGraph(graph);
        const { nodes: layoutedNodes, edges: layoutedEdges } =
            getLayoutedElements(nodes, edges);
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
    };

    const workflowFinished = run => {
        const state =
            run &&
            run.status &&
            run.status.state &&
            run.status.state &&
            run.status.state;
        return state === 'COMPLETED' || state === 'ERROR';
    };

    const onInit = (instance: ReactFlowInstance) => {
        setReactFlowInstance(instance);
        buildGraph(record);
        if (!workflowFinished(record)) {
            interval = setInterval(() => {
                dataProvider.getOne('runs', { id: record.id }).then(data => {
                    buildGraph(data.data);
                    if (workflowFinished(data.data)) {
                        clearInterval(interval);
                    }
                });
            }, 5000);
        }
    };

    const onNodesChange = useCallback(
        changes => setNodes((nds: any) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        changes => setEdges((eds: any) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );
    const [activeNode, setActiveNode] = useState<any>();
    const [reactFlowInstance, setReactFlowInstance] =
        useState<ReactFlowInstance | null>(null);

    const onNodeClick = (event, node: Node) => {
        setActiveNode(node.data);
        setTimeout(() => reactFlowInstance?.fitView());
        event.stopPropagation();
    };

    return (
        <Grid container spacing={2} sx={{ width: '100%' }}>
            <Grid item xs>
                <Box
                    sx={{
                        mt: '9px',
                        mb: '7px',
                        width: '100%',
                        height: '400px',
                    }}
                >
                    <ReactFlow
                        nodes={gnodes}
                        edges={gedges}
                        fitView={true}
                        nodesConnectable={false}
                        nodesDraggable={true}
                        zoomOnScroll={false}
                        onNodeClick={onNodeClick}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onInit={onInit}
                    >
                        <Controls showInteractive={false} />
                        <Background
                            variant={BackgroundVariant.Dots}
                            gap={12}
                            size={1}
                        />
                    </ReactFlow>
                </Box>
            </Grid>
            <>
                {activeNode && (
                    <Grid item xs>
                        <RecordContextProvider value={activeNode}>
                            <Grid container spacing={2} sx={{ width: '100%' }}>
                                <Grid item xs={5}>
                                    <Labeled label="resources.workflows.fields.function">
                                        <TextField source="function" />
                                    </Labeled>
                                </Grid>
                                <Grid item xs={4}>
                                    <Labeled label="resources.workflows.fields.action">
                                        <TextField source="action" />
                                    </Labeled>
                                </Grid>
                                <Grid item xs={3}>
                                    <ChipField
                                        record={activeNode}
                                        source="state"
                                        color={getColor(activeNode)}
                                    />
                                </Grid>
                            </Grid>

                            <Labeled label="resources.workflows.fields.run_id">
                                <Link
                                    to={createPath({
                                        type: 'show',
                                        resource: 'functions',
                                        id: activeNode.function_id,
                                    })}
                                >
                                    <TextField source="run_id" />
                                </Link>
                            </Labeled>

                            <Grid container spacing={2} sx={{ width: '100%' }}>
                                <Grid item xs>
                                    <Labeled label="resources.workflows.fields.start_time">
                                        <DateField
                                            source="start_time"
                                            showDate
                                            showTime
                                        />
                                    </Labeled>
                                </Grid>
                                <Grid item xs>
                                    <Labeled label="resources.workflows.fields.end_time">
                                        <DateField
                                            source="end_time"
                                            showDate
                                            showTime
                                        />
                                    </Labeled>
                                </Grid>
                            </Grid>
                            <>
                                {activeNode.inputs &&
                                    activeNode.inputs.length > 0 && (
                                        <>
                                            <br />
                                            <Divider />
                                            <Labeled label="resources.workflows.inputs">
                                                <Datagrid
                                                    header={
                                                        <div
                                                            style={{
                                                                display: 'none',
                                                            }}
                                                        ></div>
                                                    }
                                                    data={activeNode.inputs}
                                                    bulkActionButtons={false}
                                                >
                                                    <TextField source="name" />
                                                    <TextField source="value" />
                                                </Datagrid>
                                            </Labeled>
                                        </>
                                    )}
                            </>
                            <>
                                {activeNode.outputs &&
                                    activeNode.outputs.length > 0 && (
                                        <>
                                            <br />
                                            <Divider />
                                            <Labeled label="resources.workflows.outputs">
                                                <Datagrid
                                                    header={
                                                        <div
                                                            style={{
                                                                display: 'none',
                                                            }}
                                                        ></div>
                                                    }
                                                    data={activeNode.outputs}
                                                    bulkActionButtons={false}
                                                >
                                                    <TextField source="name" />
                                                    <TextField source="value" />
                                                </Datagrid>
                                            </Labeled>
                                        </>
                                    )}
                            </>
                        </RecordContextProvider>
                    </Grid>
                )}
            </>
        </Grid>
    );
};

function computeGraph(graph) {
    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let nodeMap = {};
    let root: any = null;

    graph.forEach(n => {
        nodeMap[n.id] = n;
        if (n.type === 'DAG') root = n;
    });
    if (!root || !root.children || root.children.length == 0)
        return { nodes, edges };

    let list: any[] = root.children.map(id => nodeMap[id]);
    processChildren(nodeMap, list, 0, nodes, edges);

    return { nodes, edges };
}

function processChildren(
    nodeMap,
    list,
    level: number,
    nodes: Node[],
    edges: Edge[]
) {
    if (list.length > 0) {
        let node = list.shift();
        nodes.push({
            id: node.id,
            position: { x: 0, y: 0 },
            data: { label: node.display_name, ...node },
            style: getNodeStyle(node),
            deletable: false,
            connectable: false,
        });
        if (node.children && node.children.length > 0) {
            node.children.forEach(c => {
                edges.push({
                    id: node.id + '-' + c,
                    source: node.id,
                    target: c,
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 10,
                        height: 10,
                        color: 'rgba(0, 0, 0, 0.6)',
                    },
                    style: {
                        stroke: 'rgba(0, 0, 0, 0.6)',
                    },
                    type: 'smoothstep',
                    deletable: false,
                    reconnectable: false,
                    focusable: false,
                });
                nodeMap[c].level = level + 1;
                list.push(nodeMap[c]);
            });
        }
        processChildren(nodeMap, list, level + 1, nodes, edges);
    }
}

function getNodeStyle(node) {
    const color =
        node.state === 'Succeeded'
            ? '#2e7d32'
            : node.state === 'Failed'
            ? '#d32f2f'
            : node.state === 'Error'
            ? '#d32f2f'
            : node.state === 'Ready' || node.state === 'Omitted'
            ? 'rgba(0, 0, 0, 0.6)'
            : '#E0701B';
    return {
        color: color,
        borderColor: color,
        backgroundColor: '#fafafa',
    };
}

function getColor(node) {
    const color =
        node.state === 'Succeeded'
            ? 'success'
            : node.state === 'Failed'
            ? 'error'
            : node.state === 'Error'
            ? 'error'
            : node.state === 'Ready' || node.state === 'Omitted'
            ? 'secondary'
            : 'warning';
    return color;
}
