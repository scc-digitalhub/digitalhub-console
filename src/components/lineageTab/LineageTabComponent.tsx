import { Box, Typography, alpha } from '@mui/material';
import { DataGrid, enUS, itIT } from '@mui/x-data-grid';
import {
    useDataProvider,
    useLocaleState,
    useNotify,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { useState, useCallback, useEffect } from 'react';
import {
    ReactFlow,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Controls,
    ConnectionLineType,
    useEdgesState,
    useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { useRootSelector } from '@dslab/ra-root-selector';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 172;
const nodeHeight = 36;
const getLayoutedElements = (nodes, edges, direction = 'LR') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach(node => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach(edge => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map(node => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const newNode = {
            ...node,
            targetPosition: isHorizontal ? 'left' : 'top',
            sourcePosition: isHorizontal ? 'right' : 'bottom',
            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };

        return newNode;
    });

    return { nodes: newNodes, edges };
};

export const LineageTabComponent = () => {
    const record = useRecordContext();
    const translate = useTranslate();
    if (
        !record?.metadata?.relationships ||
        record?.metadata?.relationships?.length === 0
    ) {
        return null;
    }
    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Typography variant="h6" gutterBottom>
                {translate('resources.lineage.title')}
            </Typography>
            <Flow relationships={record.metadata.relationships} />
        </Box>
    );
};

const getNodesAndEdges = (relationships: any, record: any) => {
    const nodes = [
        {
            id: record.id,
            position: {
                x: 0,
                y: 0,
            },
            data: { label: "that's me" },
        },
        ...relationships.map((relationship: any, index: number) => ({
            id: getIdFromKey(relationship.dest || relationship.source),
            position: {
                x: 0,
                y: 0,
            },
            data: { label: relationship.dest || relationship.source },
        })),
    ];

    const edges = relationships.map((relationship: any, index: number) => ({
        id: index,
        source: relationship?.dest
            ? getIdFromKey(relationship?.dest)
            : record.id,
        target: relationship?.source
            ? getIdFromKey(relationship?.source)
            : record.id,
        type: 'smoothstep',
        animated: true,
    }));
    return { nodes, edges };
};
const getIdFromKey = (key: string) => {
    return key.split(':').pop();
};
export const Flow = (props: { relationships: any }) => {
    const { relationships } = props;
    const record = useRecordContext();
    const dataProvider = useDataProvider();
    const resource = useResourceContext();
    const { root } = useRootSelector();
    const notify = useNotify();
    const { nodes: initialNodes, edges: initialEdges } = getNodesAndEdges(
        relationships,
        record
    );
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialNodes,
        initialEdges
    );
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
    useEffect(() => {
        if (dataProvider) {
            dataProvider.getLineage(
                resource,
                { id: record.id, meta: { root } }
                    ).then(data => {
                        if (data?.lineage) {
                            const { nodes: newNodes, edges: newEdges } =
                                getNodesAndEdges(data.lineage, record);
                            setNodes([...newNodes]);
                            setEdges([...newEdges]);
                        } else {
                            notify('ra.message.not_found', {
                                type: 'error',
                            });
                        }
                    })
                    .catch(error => {
                        const e =
                            typeof error === 'string'
                                ? error
                                : error.message || 'error';
                        notify(e);
                    })}
    }, [dataProvider]);
    return (
        <div style={{ height: '400px', width: '800px' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                connectionLineType={ConnectionLineType.SmoothStep}
                fitView
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
};

//     [
//         {
//             "type": "producedBy",
//             "dest": "store://prj1/model/model/testm1:585a5b5a-3cd1-4c29-8e8c-c72f50cfe223"
//           },
//           {
//             "type": "consumes",
//             "dest": "store://prj1/model/model/testm1:585a5b5a-3cd1-4c29-8e8c-c72f50cfe223"
//           },
//           {
//             "type": "producedBy",
//             "dest": "store://prj1/model/model/testm1:585a5b5a-3cd1-4c29-8e8c-c72f50cfe223"
//           }
//       ]
// const relationshipTypes = {
//     "consumes":{

//     }
// }
