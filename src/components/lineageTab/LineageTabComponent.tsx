import { Box, Typography } from '@mui/material';
import {
    useDataProvider,
    useNotify,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { useCallback, useEffect, useState } from 'react';
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
import { keyParser } from '../../common/helper';

export const NoLineage = () => {
    const translate = useTranslate();

    return (
        <Typography
            variant="body1"
            color={'gray'}
            sx={{ textAlign: 'center', pt: 5 }}
        >
            {translate('messages.lineage.noLineage')}
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

    // Callback fired when handles are clicked
    // - if handleType=target, call api with nodeId and filter on dest
    // - if handleType=source, call api with nodeId and filter on source
    const onConnectStart = useCallback((event, { nodeId, handleId, handleType }) => {
        if (dataProvider) {
            dataProvider
                .getLineage(handleId.split(':')[0], {
                    id: nodeId,
                    meta: { root },
                })
                .then(data => {
                    if (data?.lineage) {
                        const sourceOrTarget =
                            handleType == 'target' ? 'source' : 'dest';
                        const expansions = data.lineage
                            .filter(
                                rel => rel[sourceOrTarget].endsWith(nodeId)
                            )
                            .map(exp => ({ ...exp, expands: nodeId }));
                        if (expansions.length === 0) {
                            notify('messages.lineage.noExpansion', {
                                type: 'info',
                            });
                        } else {
                            setRelationships(old => [
                                ...old,
                                ...expansions,
                            ]);
                        }
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
      }, [dataProvider, notify, root]);

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Typography variant="h6" gutterBottom>
                {translate('pages.lineage.title')}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                {translate('pages.lineage.description')}
            </Typography>
            {relationships.length !== 0 ? (
                <ReactFlowProvider>
                    <Flow
                        relationships={relationships}
                        onConnectStart={onConnectStart}
                    />
                </ReactFlowProvider>
            ) : (
                <NoLineage />
            )}
        </Box>
    );
};

const getNodesAndEdges = (
    relationships: any[],
    record: any,
    translate
): { nodes: Node[]; edges: Edge[] } => {
    const nodes = [
        {
            id: record.id,
            type: 'cardNode',
            position: {
                x: 0,
                y: 0,
            },
            data: { key: record.key, current: true },
        },
        ...relationships.map((relationship: any): Node => {
            const destParsed = keyParser(relationship.dest);
            //the node that is being expanded, defaults to the current node
            const relatedNode = relationship.expands || record.id;
            //the node to create
            const nodeKey =
                destParsed.id == relatedNode ||
                destParsed.name == relatedNode
                    ? relationship.source
                    : relationship.dest;
            const keyParsed = keyParser(nodeKey);
            return {
                id: keyParsed.id || keyParsed.name || '',
                type: 'cardNode',
                position: {
                    x: 0,
                    y: 0,
                },
                data: {
                    key: nodeKey,
                },
            };
        }),
    ];

    const edges = relationships.map(
        (relationship: any, index: number): Edge => {
            //dest should always be present, source might be missing in metadata
            const destParsed = keyParser(relationship.dest);
            const sourceParsed = keyParser(relationship.source || record.key);
            return {
                id: index.toString(),
                source: destParsed.id || destParsed.name || '',
                target: sourceParsed.id || sourceParsed.name || '',
                type: 'default',
                animated: true,
                label: translate(
                    `pages.lineage.relationships.${relationship.type}`
                ),
            };
        }
    );
    return { nodes, edges };
};

const nodeTypes = {
    cardNode: CardNode,
};

export const Flow = (props: { relationships: any[]; onConnectStart: any }) => {
    const { relationships, onConnectStart } = props;
    const record = useRecordContext();
    const { fitView } = useReactFlow();
    const translate = useTranslate();

    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    useEffect(() => {
        const { nodes: newNodes, edges: newEdges } = getNodesAndEdges(
            relationships,
            record,
            translate
        );
        const { nodes: layoutedNodes, edges: layoutedEdges } =
            getLayoutedElements(newNodes, newEdges, 'LR');
        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
    }, [record, relationships, setEdges, setNodes, translate]);

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
                onConnectStart={onConnectStart}
                proOptions={{ hideAttribution: true }}
                nodesDraggable={false}
                maxZoom={1}
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
};
