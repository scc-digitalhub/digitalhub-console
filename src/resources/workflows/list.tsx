// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import yamlExporter from '@dslab/ra-export-yaml';
import { Box, Container } from '@mui/material';
import {
    Datagrid,
    DateField,
    EditButton,
    FunctionField,
    ListBase,
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
import { WorkflowIcon } from './icon';
import { ChipsField } from '../../components/ChipsField';
import { BulkDeleteAllVersionsButton } from '../../components/buttons/BulkDeleteAllVersionsButton';
import { useRootSelector } from '@dslab/ra-root-selector';
import { ListToolbar } from '../../components/toolbars/ListToolbar';
import { RunStateBadge } from '../../components/RunStateBadge';
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
    if (!resource || !record) return null;

    return (
        <RowButtonGroup>
            <ShowButton disabled={expanded} />
            <EditButton disabled={expanded} />
            <DeleteWithConfirmButtonByName
                deleteAll
                cascade
                disabled={expanded}
                askForDeleteAll
                askForCascade
                disableDeleteAll
            />
        </RowButtonGroup>
    );
};

export const WorkflowList = () => {
    const resource = useResourceContext();
    const { root } = useRootSelector();
    const getFilters = useGetFilters();

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ListBase
                exporter={yamlExporter}
                sort={{ field: 'metadata.updated', order: 'DESC' }}
                storeKey={`${root}.${resource}.listParams`}
            >
                <>
                    <ListPageTitle icon={<WorkflowIcon fontSize={'large'} />} />
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
                                expand={
                                    <VersionsList
                                        leftIcon={() => <RunStateBadge />}
                                    />
                                }
                                expandSingle={true}
                                bulkActionButtons={
                                    <BulkDeleteAllVersionsButton
                                        deleteAll
                                        cascade
                                        askForDeleteAll
                                        askForCascade
                                        disableDeleteAll
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
                                <FunctionField
                                    label={'fields.activeRuns'}
                                    render={() => (
                                        <RunStateBadge filterById={false} />
                                    )}
                                />
                                <RowActions />
                            </Datagrid>
                        </ListView>
                    </FlatCard>
                </>
            </ListBase>
        </Container>
    );
};
