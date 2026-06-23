// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import yamlExporter from '@dslab/ra-export-yaml';
import { Box, Container } from '@mui/material';
import {
    ColumnsButton,
    DataTable,
    EditButton,
    ListView,
    ShowButton,
    TextInput,
    TopToolbar,
    useResourceContext,
    useStore,
} from 'react-admin';
import { DeleteWithConfirmButtonByName } from '../../common/components/buttons/delete/DeleteWithConfirmButtonByName';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { ListPageTitle } from '../../common/components/layout/PageTitle';
import { RowButtonGroup } from '../../common/components/buttons/RowButtonGroup';
import { FolderIcon } from './icon';
import { BulkDeleteAllVersionsButton } from '../../common/components/buttons/delete/BulkDeleteAllVersionsButton';
import { useRootSelector } from '@dslab/ra-root-selector';
import { ListBaseLive } from '../../features/notifications/components/ListBaseLive';
import {
    RowsViewIcon,
    TableViewIcon,
    View,
    ViewSelector,
} from '../../common/components/buttons/ViewsSelector';
import { InspectButton } from '@dslab/ra-inspect-button';

const RowActions = () => (
    <RowButtonGroup>
        <InspectButton />
        <ShowButton />
        <EditButton />
        <DeleteWithConfirmButtonByName
            deleteAll
            askForDeleteAll
            disableDeleteAll
        />
    </RowButtonGroup>
);

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

export const FolderList = () => {
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
                    <ListPageTitle icon={<FolderIcon fontSize={'large'} />} />

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
                                <DataTableView
                                    storeKey={`${storeKey}.dataTable`}
                                />
                            )}
                            {selectedView == 'details' && <></>}
                        </ListView>
                    </FlatCard>
                </>
            </ListBaseLive>
        </Container>
    );
};

const DataTableView = (props: { storeKey?: string }) => {
    const { storeKey } = props;
    return (
        <DataTable
            storeKey={storeKey}
            rowClick="show"
            bulkActionButtons={
                <BulkDeleteAllVersionsButton
                    deleteAll
                    askForDeleteAll
                    disableDeleteAll
                />
            }
            hiddenColumns={['id']}
        >
            <DataTable.Col source="name" label="fields.name.title" />
            <DataTable.Col source="id" label="fields.id" />
            <DataTable.Col source="kind" label="fields.kind" />

            <DataTable.Col>
                <RowActions />
            </DataTable.Col>
        </DataTable>
    );
};
