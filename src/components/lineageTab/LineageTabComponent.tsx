import { Box, Typography } from '@mui/material';
import {
    useDataProvider,
    useNotify,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    useEdgesState,
    useNodesState,
    useReactFlow,
    ReactFlowProvider,
    Node,
    Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { useRootSelector } from '@dslab/ra-root-selector';
import { CardNode } from './CardNode';

const NoLineage = () => {
    const translate = useTranslate();

    return (
        <Typography
            variant="body1"
            color={'gray'}
            sx={{ textAlign: 'center', pt: 5 }}
        >
            {translate('pages.lineage.noLineage')}
        </Typography>
    );
};

export const LineageTabComponent = () => {
    const record = useRecordContext();
    const translate = useTranslate();

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Typography variant="h6" gutterBottom>
                {translate('pages.lineage.title')}
            </Typography>
            {record?.metadata?.relationships &&
            record?.metadata?.relationships?.length !== 0 ? (
                <ReactFlowProvider>
                    <Flow relationships={record.metadata.relationships} />
                </ReactFlowProvider>
            ) : (
                <NoLineage />
            )}
        </Box>
    );
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 172;
const nodeHeight = 36;

const nodeTypes = {
    cardNode: CardNode,
};

const getLayoutedElements = (nodes, edges, direction = 'LR'): { nodes: Node[], edges: Edge[] } => {
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
            type: 'cardNode',
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

const getIdFromKey = (key: string) => {
    return key.split(':').pop() || '';
};

const getNodesAndEdges = (relationships: any[], record: any): { nodes: Node[], edges: Edge[] } => {
    const nodes = [
        {
            id: record.id,
            position: {
                x: 0,
                y: 0,
            },
            data: { key: record.key },
        },
        ...relationships.map((relationship: any): Node => ({
            id: getIdFromKey(relationship.dest || relationship.source),
            position: {
                x: 0,
                y: 0,
            },
            data: {
                key: relationship.dest || relationship.source,
                showButton: true,
            },
        })),
    ];

    const edges = relationships.map((relationship: any, index: number): Edge => ({
        id: index.toString(),
        source: relationship?.dest
            ? getIdFromKey(relationship?.dest)
            : record.id,
        target: relationship?.source
            ? getIdFromKey(relationship?.source)
            : record.id,
        type: 'default',
        animated: true,
    }));
    return { nodes, edges };
};

export const Flow = (props: { relationships: any }) => {
    const { relationships } = props;
    const record = useRecordContext();
    const dataProvider = useDataProvider();
    const resource = useResourceContext();
    const { root } = useRootSelector();
    const notify = useNotify();
    const { fitView } = useReactFlow();

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
            dataProvider
                .getLineage(resource, { id: record.id, meta: { root } })
                .then(data => {
                    if (data?.lineage) {
                        const { nodes: newNodes, edges: newEdges } =
                            getNodesAndEdges(data.lineage, record);
                        const {
                            nodes: newLayoutedNodes,
                            edges: newLayoutedEdges,
                        } = getLayoutedElements(newNodes, newEdges);
                        setNodes([...newLayoutedNodes]);
                        setEdges([...newLayoutedEdges]);
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
                });
        }
    }, [dataProvider]);

    useEffect(() => {
        window.requestAnimationFrame(() => {
            fitView();
        });
    }, [nodes, edges]);

    return (
        <div style={{ height: '400px', width: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
};
