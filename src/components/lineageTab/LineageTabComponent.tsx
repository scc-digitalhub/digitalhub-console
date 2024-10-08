import { Box, Typography } from '@mui/material';
import {
    useDataProvider,
    useNotify,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { useEffect, useState } from 'react';
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
import { useRootSelector } from '@dslab/ra-root-selector';
import { CardNode } from './CardNode';
import { getLayoutedElements } from './layouting';

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
    const [relationships, setRelationships] = useState<any[]>(
        record?.metadata?.relationships || []
    );
    const dataProvider = useDataProvider();
    const resource = useResourceContext();
    const { root } = useRootSelector();
    const notify = useNotify();

    useEffect(() => {
        if (dataProvider) {
            dataProvider
                .getLineage(resource, { id: record.id, meta: { root } })
                .then(data => {
                    if (data?.lineage) {
                        setRelationships([...data.lineage]);
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
    }, [dataProvider, notify, record.id, resource, root]);

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Typography variant="h6" gutterBottom>
                {translate('pages.lineage.title')}
            </Typography>
            {relationships.length !== 0 ? (
                <ReactFlowProvider>
                    <Flow relationships={relationships} />
                </ReactFlowProvider>
            ) : (
                <NoLineage />
            )}
        </Box>
    );
};

const getIdFromKey = (key: string) => {
    return key.split(':').pop() || '';
};

const getNodesAndEdges = (
    relationships: any[],
    record: any
): { nodes: Node[]; edges: Edge[] } => {
    const nodes = [
        {
            id: record.id,
            position: {
                x: 0,
                y: 0,
            },
            data: { key: record.key, current: true },
        },
        ...relationships.map(
            (relationship: any): Node => ({
                id: getIdFromKey(relationship.dest || relationship.source),
                position: {
                    x: 0,
                    y: 0,
                },
                data: {
                    key: relationship.dest || relationship.source,
                },
            })
        ),
    ];

    const edges = relationships.map(
        (relationship: any, index: number): Edge => ({
            id: index.toString(),
            target: relationship?.dest
                ? getIdFromKey(relationship?.dest)
                : record.id,
            source: relationship?.source
                ? getIdFromKey(relationship?.source)
                : record.id,
            type: 'default',
            animated: true,
            label: relationship.type,
        })
    );
    return { nodes, edges };
};

const nodeTypes = {
    cardNode: CardNode,
};

export const Flow = (props: { relationships: any[] }) => {
    const { relationships } = props;
    const record = useRecordContext();
    const { fitView } = useReactFlow();

    const { nodes: initialNodes, edges: initialEdges } = getNodesAndEdges(
        relationships,
        record
    );

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialNodes,
        initialEdges,
        'RL'
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

    useEffect(() => {
        const { nodes: newNodes, edges: newEdges } = getNodesAndEdges(
            relationships,
            record
        );
        const { nodes: newLayoutedNodes, edges: newLayoutedEdges } =
            getLayoutedElements(newNodes, newEdges, 'RL');
        setNodes([...newLayoutedNodes]);
        setEdges([...newLayoutedEdges]);
    }, [record, relationships, setEdges, setNodes]);

    useEffect(() => {
        window.requestAnimationFrame(() => {
            fitView();
        });
    }, [nodes, edges, fitView]);

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
