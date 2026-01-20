// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

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
    useResourceDefinitions,
    useTranslate,
} from 'react-admin';
import { PageTitle } from '../../../common/components/layout/PageTitle';
import { LineageIcon } from '../../../features/lineage/components/icon';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { useEffect, useState } from 'react';
import { RecordLineage } from '../../../features/lineage/components/RecordLineage';
import { Relationship } from '../../../features/lineage';
import { keyParser } from '../../../common/utils/helper';
import { NoContent } from '../../../common/components/layout/NoContent';

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
    const resources = useResourceDefinitions();
    const [relationships, setRelationships] = useState<any[]>([]);

    useEffect(() => {
        if (dataProvider && project) {
            //collect project resources (except runs)
            let nodesToBe: { resource: string; record: RaRecord }[] = [];
            for (const [resource, v] of Object.entries(resources)) {
                if (Object.keys(project.spec).includes(resource)) {
                    const records = project.spec[resource] as RaRecord[];
                    records.forEach(r => {
                        nodesToBe.push({ resource: resource, record: r });
                    });
                }
            }

            //get lineage of each resource and collect responses
            let promises: Promise<{ lineage: Relationship[] }>[] =
                nodesToBe.map(n =>
                    dataProvider.getLineage(n.resource, {
                        id: n.record.id,
                        meta: { root: project.id },
                    })
                );

            //wait for results and set relationships
            Promise.all(promises)
                .then(values => {
                    let rels: Relationship[] = [];
                    let runs: any[] = [];
                    values.forEach((data, index) => {
                        //if this resource has relationships, add them avoiding duplicates
                        //otherwise add resource as disconnected node
                        if (data?.lineage && data.lineage.length !== 0) {
                            data.lineage.forEach(l => {
                                if (
                                    !rels.some(
                                        r =>
                                            r.dest == l.dest &&
                                            r.type == l.type &&
                                            r.source == l.source
                                    )
                                ) {
                                    rels.push(l);
                                }
                                //if this relationship involves a run, track it to get its lineage
                                const dest = keyParser(l.dest);
                                if (dest.resource == 'runs') {
                                    runs.push(dest);
                                }
                                if (l.source) {
                                    const source = keyParser(l.source);
                                    if (source.resource == 'runs') {
                                        runs.push(source);
                                    }
                                }
                            });
                        } else {
                            rels.push({
                                dest: nodesToBe[index].record.key,
                                type: '',
                            });
                        }
                    });

                    //get runs lineage
                    Promise.all(
                        runs.map(r =>
                            dataProvider.getLineage('runs', {
                                id: r.id,
                                meta: { root: project.id },
                            })
                        )
                    ).then(results => {
                        results.forEach(data => {
                            if (data?.lineage && data.lineage.length !== 0) {
                                data.lineage.forEach(l => {
                                    if (
                                        !rels.some(
                                            r =>
                                                r.dest == l.dest &&
                                                r.type == l.type &&
                                                r.source == l.source
                                        )
                                    ) {
                                        rels.push(l);
                                    }
                                });
                            }
                        });
                        //finally set relationships
                        setRelationships([...rels]);
                    });
                })
                .catch(error => {
                    const e =
                        typeof error === 'string'
                            ? error
                            : error.message || 'error';
                    notify(e);
                });
        }
    }, [dataProvider, notify, project, resources]);

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            {project && relationships.length !== 0 ? (
                <RecordLineage
                    relationships={relationships}
                    record={project}
                    expandable={false}
                    addRecordNode={false}
                    viewportHeight="500px"
                    filterRelationships={r => r.type !== 'run_of'}
                />
            ) : (
                <NoContent message={'messages.lineage.noLineage'} />
            )}
        </Box>
    );
};
