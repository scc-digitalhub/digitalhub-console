import { Box, useTheme } from '@mui/material';
import { useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    useEdgesState,
    useNodesState,
    useReactFlow,
    Node,
    Edge,
    OnConnectStart,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ForwardCardNode, ReverseCardNode } from './CardNode';
import { getLayoutedElements, RelationshipDirection } from './utils';

export const Flow = (props: {
    nodes: Node[];
    edges: Edge[];
    direction?: RelationshipDirection;
    onConnectStart?: OnConnectStart;
    height?: string;
    width?: string;
}) => {
    const {
        nodes: nodesProp,
        edges: edgesProp,
        onConnectStart,
        direction = RelationshipDirection.forward,
        height = '400px',
        width = '100%',
    } = props;
    const { fitView } = useReactFlow();
    const theme = useTheme();

    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    //compute graph layout for nodes+edges
    useEffect(() => {
        const { nodes: layoutedNodes, edges: layoutedEdges } =
            getLayoutedElements(nodesProp, edgesProp, 'LR');
        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
    }, [nodesProp, edgesProp, setEdges, setNodes]);

    useEffect(() => {
        window.requestAnimationFrame(() => {
            fitView();
        });
    }, [nodes, edges, fitView]);

    return (
        <Box
            style={{ height, width }}
            sx={{
                '.react-flow__edge-path': {
                    stroke: '#ccc',
                },
            }}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={{
                    cardNode:
                        direction == RelationshipDirection.reverse
                            ? ReverseCardNode
                            : ForwardCardNode,
                }}
                fitView
                onConnectStart={onConnectStart}
                proOptions={{ hideAttribution: true }}
                nodesDraggable={false}
                maxZoom={1}
                colorMode={theme.palette.mode}
            >
                <Background />
                <Controls />
            </ReactFlow>
        </Box>
    );
};
