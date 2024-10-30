import { Box, Typography } from '@mui/material';
import {
    useDataProvider,
    useNotify,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
    const onConnectStart = useMemo(() => {
        return (event, { nodeId, handleId, handleType }) => {
            if (dataProvider) {
                dataProvider
                    .getLineage(handleId.split(':')[0], {
                        id: nodeId,
                        meta: { root },
                    })
                    .then(data => {
                        if (data?.lineage) {
                            const sourceOrTarget =
                                handleType == 'target' ? 'dest' : 'source';
                            const expansions = data.lineage
                                .filter(
                                    rel => rel[sourceOrTarget] !== undefined
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
        };
    }, [dataProvider, notify, root]);

    // Callback fired when handles are clicked
    // - if handleType=target, call api with nodeId and filter on dest
    // - if handleType=source, call api with nodeId and filter on source
    // const onConnectStart = useCallback((event, { nodeId, handleId, handleType }) => {
    //     if (dataProvider) {
    //         dataProvider
    //             .getLineage(handleId.split(':')[0], {
    //                 id: nodeId,
    //                 meta: { root },
    //             })
    //             .then(data => {
    //                 if (data?.lineage) {
    //                     const sourceOrTarget =
    //                         handleType == 'target' ? 'dest' : 'source';
    //                     const expansions = data.lineage
    //                         .filter(
    //                             rel => rel[sourceOrTarget] !== undefined
    //                         )
    //                         .map(exp => ({ ...exp, expands: nodeId }));
    //                     if (expansions.length === 0) {
    //                         notify('messages.lineage.noExpansion', {
    //                             type: 'info',
    //                         });
    //                     } else {
    //                         setRelationships(old => [
    //                             ...old,
    //                             ...expansions,
    //                         ]);
    //                     }
    //                 }
    //             })
    //             .catch(error => {
    //                 const e =
    //                     typeof error === 'string'
    //                         ? error
    //                         : error.message || 'error';
    //                 notify(e);
    //             });
    //     }
    //   }, [dataProvider, notify, root]);

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

//TODO prendere da common/utils
export const getIdFromKey = (key: string) => {
    return key.split(':').pop()?.split('/').pop() || '';
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
        ...relationships.map(
            (relationship: any): Node => ({
                id: getIdFromKey(relationship.dest || relationship.source),
                type: 'cardNode',
                position: {
                    x: 0,
                    y: 0,
                },
                data: {
                    key: relationship.dest || relationship.source,
                    clickedHandle: relationship.clickedHandle,
                },
            })
        ),
    ];

    const edges = relationships.map(
        (relationship: any, index: number): Edge => ({
            id: index.toString(),
            source: relationship?.dest
                ? getIdFromKey(relationship?.dest)
                : relationship.expands
                ? relationship.expands
                : record.id,
            target: relationship?.source
                ? getIdFromKey(relationship?.source)
                : relationship.expands
                ? relationship.expands
                : record.id,
            type: 'default',
            animated: true,
            label: translate(
                `pages.lineage.relationships.${relationship.type}`
            ),
        })
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
