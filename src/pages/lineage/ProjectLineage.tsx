import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
import {
    RaRecord,
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
import { Edge, Node, ReactFlowProvider } from '@xyflow/react';
import { NoLineage } from '../../components/lineage/NoLineage';
import { useEffect, useState } from 'react';
import {
    getNodesAndEdges,
    RelationshipDirection,
} from '../../components/lineage/utils';
import { Flow } from '../../components/lineage/Flow';
import { set } from 'lodash';

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
                            <Lineage />
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

    //use reverse representation, we store rel on child side
    const direction = RelationshipDirection.reverse;

    const [nodesAndEdges, setNodesAndEdges] = useState<{
        nodes: Node[];
        edges: Edge[];
    }>({ nodes: [], edges: [] });

    useEffect(() => {
        if (dataProvider && project) {
            const projectResources = Object.values(project.spec).flat();
            const records = projectResources as RaRecord[];

            dataProvider
                .getProjectLineage('projects', { id: project.id })
                .then(data => {
                    if (data?.lineage) {
                        //derive translations for rels
                        const labels = {};
                        data.lineage.forEach(value =>
                            set(
                                labels,
                                value.type,
                                translate(
                                    `pages.lineage.relationships.${value.type}`
                                )
                            )
                        );

                        const { nodes, edges } = getNodesAndEdges(
                            data.lineage,
                            direction,
                            records,
                            labels,
                            false
                        );

                        setNodesAndEdges({ nodes: nodes, edges: edges });
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
    }, [dataProvider, notify, project, translate]);

    if (nodesAndEdges.nodes.length === 0) return <NoLineage />;

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <ReactFlowProvider>
                <Flow
                    nodes={nodesAndEdges.nodes}
                    edges={nodesAndEdges.edges}
                    direction={direction}
                    height="600px"
                    width="100%"
                />
            </ReactFlowProvider>
        </Box>
    );
};
