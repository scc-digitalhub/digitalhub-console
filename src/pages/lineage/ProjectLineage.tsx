import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
import {
    ResourceContextProvider,
    ShowBase,
    ShowView,
    useDataProvider,
    useNotify,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { PageTitle } from '../../components/PageTitle';
import { LineageIcon } from './icon';
import { FlatCard } from '../../components/FlatCard';
import {
    Background,
    Controls,
    Edge,
    Node,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from '@xyflow/react';
import { getIdFromKey, NoLineage } from '../../components/lineageTab/LineageTabComponent';
import { useEffect } from 'react';
import { getLayoutedElements } from '../../components/lineageTab/layouting';
import { CardNode } from '../../components/lineageTab/CardNode';

export const ProjectLineage = () => {
    const { root: projectId } = useRootSelector();
    const translate = useTranslate();

    return (
        <ResourceContextProvider value="projects">
            <Container maxWidth={false} sx={{ pb: 2 }}>
                <ShowBase id={projectId}>
                    <>
                        <PageTitle
                            text={translate('pages.lineage.projectTitle', {
                                projectId: projectId,
                            })}
                            secondaryText={translate(
                                'pages.lineage.projectDescription'
                            )}
                            icon={<LineageIcon fontSize={'large'} />}
                        />
                        <ShowView actions={false} component={FlatCard}>
                            <ReactFlowProvider>
                                <Lineage />
                            </ReactFlowProvider>
                        </ShowView>
                    </>
                </ShowBase>
            </Container>
        </ResourceContextProvider>
    );
};

const Lineage = () => {
    const project = useRecordContext();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const translate = useTranslate();
    const { fitView } = useReactFlow();

    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    useEffect(() => {
        if (dataProvider && project) {
            const projectResources = Object.values(project.spec).flat();

            const initialNodes = projectResources.map(
                (res: any): Node => ({
                    id: res.id,
                    type: 'cardNode',
                    position: {
                        x: 0,
                        y: 0,
                    },
                    data: {
                        key: res.key,
                        expandable: false,
                    },
                })
            );

            const ids: string[] = projectResources.map(
                (res: any) => res.id
            );

            dataProvider
                .getProjectLineage('projects', { data: ids })
                .then(data => {
                    if (data?.lineage) {
                        let initialEdges: Edge[] = [];
                        data.lineage.forEach(
                            (
                                relationship: any,
                                index: number
                            ) => {
                                initialEdges.push({
                                    id: index.toString(),
                                    source: getIdFromKey(relationship.dest),
                                    target: getIdFromKey(relationship.source),
                                    type: 'default',
                                    animated: true,
                                    label: translate(
                                        `pages.lineage.relationships.${relationship.type}`
                                    ),
                                });

                                if (relationship.type === 'runDiFunzione') {
                                    initialNodes.push({
                                        id: getIdFromKey(relationship.source),
                                        type: 'cardNode',
                                        position: {
                                            x: 0,
                                            y: 0,
                                        },
                                        data: {
                                            key: relationship.source,
                                            expandable: false,
                                        },
                                    })
                                }
                            }
                        );

                        const {
                            nodes: layoutedNodes,
                            edges: layoutedEdges,
                        } = getLayoutedElements(
                            initialNodes,
                            initialEdges,
                            'LR'
                        );

                        setNodes([...layoutedNodes]);
                        setEdges([...layoutedEdges]);
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
    }, [dataProvider, notify, project, setEdges, setNodes, translate]);

    useEffect(() => {
        window.requestAnimationFrame(() => {
            fitView();
        });
    }, [nodes, edges, fitView]);

    if (nodes.length === 0) return <NoLineage />;

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <div style={{ height: '400px', width: '100%' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={{ cardNode: CardNode }}
                    fitView
                    onConnectStart={() => {}}
                    proOptions={{ hideAttribution: true }}
                    nodesDraggable={false}
                    maxZoom={1}
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
        </Box>
    );
};
