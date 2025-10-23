// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import yamlExporter from '@dslab/ra-export-yaml';
import { Box, Container } from '@mui/material';
import {
    Datagrid,
    DateField,
    EditButton,
    ListView,
    ShowButton,
    TextField,
    useDatagridContext,
    useExpanded,
    useRecordContext,
    useResourceContext,
} from 'react-admin';
import { DeleteWithConfirmButtonByName } from '../../components/buttons/DeleteWithConfirmButtonByName';
import { FlatCard } from '../../components/FlatCard';
import { ListPageTitle } from '../../components/PageTitle';
import { RowButtonGroup } from '../../components/buttons/RowButtonGroup';
import { VersionsList } from '../../components/VersionsList';
import { DataItemIcon } from './icon';
import { ChipsField } from '../../components/ChipsField';
import { BulkDeleteAllVersionsButton } from '../../components/buttons/BulkDeleteAllVersionsButton';
import { useRootSelector } from '@dslab/ra-root-selector';
import { ListToolbar } from '../../components/toolbars/ListToolbar';
import { StateChips } from '../../components/StateChips';
import { ListBaseLive } from '../../components/ListBaseLive';
import { useGetFilters } from '../../controllers/filtersController';

const RowActions = () => {
    const resource = useResourceContext();
    const record = useRecordContext();
    const context = useDatagridContext();
    const [expanded] = useExpanded(
        resource || '',
        record?.id || '',
        context && context.expandSingle
    );
    if (!record || !resource) return null;

    return (
        <RowButtonGroup>
            <ShowButton disabled={expanded} />
            <EditButton disabled={expanded} />
            <DeleteWithConfirmButtonByName
                deleteAll
                disabled={expanded}
                askForCascade
            />
        </RowButtonGroup>
    );
};

export const DataItemList = () => {
    const resource = useResourceContext();
    const { root } = useRootSelector();
    const getFilters = useGetFilters();

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ListBaseLive
                exporter={yamlExporter}
                sort={{ field: 'metadata.updated', order: 'DESC' }}
                storeKey={`${root}.${resource}.listParams`}
                queryOptions={{ meta: { root }}}
            >
                <>
                    <ListPageTitle icon={<DataItemIcon fontSize={'large'} />} />

                    <ListToolbar />

                    <FlatCard>
                        <ListView
                            filters={getFilters()}
                            actions={false}
                            component={Box}
                            sx={{ pb: 2 }}
                        >
                            <Datagrid
                                rowClick="show"
                                expand={<VersionsList />}
                                expandSingle={true}
                                bulkActionButtons={
                                    <BulkDeleteAllVersionsButton
                                        deleteAll
                                        askForCascade
                                    />
                                }
                            >
                                <TextField
                                    source="name"
                                    label="fields.name.title"
                                />
                                <TextField source="kind" label="fields.kind" />
                                <DateField
                                    source="metadata.updated"
                                    label="fields.updated.title"
                                    showDate={true}
                                    showTime={true}
                                />
                                <ChipsField
                                    label="fields.labels.title"
                                    source="metadata.labels"
                                    sortable={false}
                                />
                                <StateChips
                                    source="status.state"
                                    label="fields.status.state"
                                />
                                <RowActions />
                            </Datagrid>
                        </ListView>
                    </FlatCard>
                </>
            </ListBaseLive>
        </Container>
    );
};
