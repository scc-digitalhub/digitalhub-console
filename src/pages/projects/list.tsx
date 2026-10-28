// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import {
    TextInput,
    ListView,
    useStore,
    useResourceContext,
    ColumnsButton,
    TopToolbar,
} from 'react-admin';
import { Box, Container } from '@mui/material';

import {
    TableViewIcon,
    View,
    ViewSelector,
} from '../../common/components/buttons/ViewsSelector';
import yamlExporter from '@dslab/ra-export-yaml';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { ListPageTitle } from '../../common/components/layout/PageTitle';
import { ListBaseLive } from '../../features/notifications/components/ListBaseLive';
import { ProjectDataTable } from '../../resources/projects/list/ProjectDataTable';
import { ProjectIcon } from '../../resources/projects/icon';

const ListToolbar = (props: {
    storeKey?: string;
    views: View[];
    selectedView?: string;
    setSelectedView?: (view: string) => void;
}) => {
    const {
        storeKey,
        views,
        selectedView = 'dataTable',
        setSelectedView,
    } = props;
    return (
        <TopToolbar>
            {selectedView === 'dataTable' && (
                <ColumnsButton
                    storeKey={`${storeKey}.dataTable`}
                    color="secondary"
                />
            )}
            {views && setSelectedView && (
                <ViewSelector
                    views={views}
                    selectedView={selectedView}
                    setSelectedView={setSelectedView}
                />
            )}
        </TopToolbar>
    );
};

export const ProjectList = () => {
    const resource = useResourceContext();
    const { root } = useRootSelector();

    const storeKey = `${root}.${resource}.list`;
    const [selectedView, setSelectedView] = useStore(
        `${storeKey}.view`,
        'dataTable'
    );

    const views = [
        {
            name: 'dataTable',
            label: 'messages.navigation.table',
            icon: <TableViewIcon />,
        },
    ];

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ListBaseLive
                exporter={yamlExporter}
                sort={{ field: 'metadata.updated', order: 'DESC' }}
                storeKey={`${storeKey}.listParams`}
                queryOptions={{ meta: { root } }}
            >
                <>
                    <ListPageTitle icon={<ProjectIcon fontSize={'large'} />} />

                    <ListToolbar
                        storeKey={storeKey}
                        views={views}
                        selectedView={selectedView}
                        setSelectedView={setSelectedView}
                    />

                    <FlatCard>
                        <ListView
                            filters={[
                                <TextInput
                                    label="ra.action.search"
                                    source="name"
                                    alwaysOn
                                    resettable
                                    key="name"
                                />,
                            ]}
                            actions={false}
                            component={Box}
                            sx={{ pb: 2 }}
                        >
                            {/* <DataGridView /> */}
                            {selectedView == 'dataTable' && (
                                <ProjectDataTable
                                    storeKey={`${storeKey}.dataTable`}
                                />
                            )}
                        </ListView>
                    </FlatCard>
                </>
            </ListBaseLive>
        </Container>
    );
};
