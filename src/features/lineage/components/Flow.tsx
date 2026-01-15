// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

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
    Panel,
    getViewportForBounds,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ForwardCardNode, ReverseCardNode } from './CardNode';
import { getLayoutedElements, RelationshipDirection } from '../utils';
import DownloadIcon from '@mui/icons-material/GetApp';
import { IconButtonWithTooltip, useTranslate } from 'react-admin';
import { toPng } from 'html-to-image';

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
                <Controls position="bottom-right" />
                <FlowDownloadButton />
            </ReactFlow>
        </Box>
    );
};

const imageWidth = 1024;
const imageHeight = 1500;
function downloadImage(dataUrl) {
    const a = document.createElement('a');
    a.setAttribute('download', 'reactflow.png');
    a.setAttribute('href', dataUrl);
    a.click();
}

const FlowDownloadButton = () => {
    const { getNodes, getNodesBounds } = useReactFlow();
    const translate = useTranslate();
    const theme = useTheme();

    const onClick = () => {
        // we calculate a transform for the nodes so that all nodes are visible
        // we then overwrite the transform of the `.react-flow__viewport` element
        // with the style option of the html-to-image library
        const nodesBounds = getNodesBounds(getNodes());
        const viewport = getViewportForBounds(
            nodesBounds,
            imageWidth,
            imageHeight,
            0.5,
            2,
            0
        );

        const el = document.querySelector('.react-flow__viewport');
        if (el) {
            toPng(el as HTMLElement, {
                backgroundColor: theme.palette.background.paper,
                width: imageWidth,
                height: imageHeight,
                style: {
                    width: '' + imageWidth,
                    height: '' + imageHeight,
                    transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
                },
            }).then(downloadImage);
        }
    };

    return (
        <Panel position="top-right">
            <IconButtonWithTooltip
                color="secondary"
                size="small"
                label={translate('actions.download_image')}
                onClick={onClick}
            >
                <DownloadIcon />
            </IconButtonWithTooltip>
        </Panel>
    );
};
