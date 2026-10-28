// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import yamlExporter from '@dslab/ra-export-yaml';
import { Box, Container } from '@mui/material';
import {
    ColumnsButton,
    ListView,
    TextInput,
    TopToolbar,
    useResourceContext,
    useStore,
} from 'react-admin';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { ListPageTitle } from '../../common/components/layout/PageTitle';
import { ContainerImageIcon } from '../../resources/containerimages/icon';
import { useRootSelector } from '@dslab/ra-root-selector';
import { ListBaseLive } from '../../features/notifications/components/ListBaseLive';
import {
    RowsViewIcon,
    TableViewIcon,
    View,
    ViewSelector,
} from '../../common/components/buttons/ViewsSelector';
import { ContainerImageDataTable } from '../../resources/containerimages/list/ContainerImageDataTable';
import { ContainerImageDetails } from '../../resources/containerimages/list/ContainerImageDetails';

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

export const ContainerImageListView = () => {
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
        {
            name: 'details',
            label: 'messages.navigation.details',
            icon: <RowsViewIcon />,
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
                    <ListPageTitle
                        icon={<ContainerImageIcon fontSize={'large'} />}
                    />

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
                                    source="q"
                                    alwaysOn
                                    resettable
                                    key="q"
                                />,
                            ]}
                            actions={false}
                            component={Box}
                            sx={{ pb: 2 }}
                        >
                            {/* <DataGridView /> */}
                            {selectedView == 'dataTable' && (
                                <ContainerImageDataTable
                                    storeKey={`${storeKey}.dataTable`}
                                />
                            )}
                            {selectedView == 'details' && (
                                <ContainerImageDetails />
                            )}
                        </ListView>
                    </FlatCard>
                </>
            </ListBaseLive>
        </Container>
    );
};
