// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    FunctionField,
    ListView,
    ShowButton,
    TextField,
    TopToolbar,
    useResourceContext,
} from 'react-admin';
import { Box, Container } from '@mui/material';
import yamlExporter from '@dslab/ra-export-yaml';
import { FlatCard } from '../../common/components/FlatCard';
import { ListPageTitle } from '../../common/components/PageTitle';
import { RowButtonGroup } from '../../common/components/buttons/RowButtonGroup';
import { StateChips } from '../../common/components/StateChips';
import { TriggerIcon } from './icon';
import { BulkDeleteAllVersionsButton } from '../../common/components/buttons/BulkDeleteAllVersionsButton';
import { useRootSelector } from '@dslab/ra-root-selector';
import { functionParser, taskParser } from '../../common/helper';
import { ListBaseLive } from '../../features/notifications/components/ListBaseLive';
import { useGetFilters } from '../../controllers/filtersController';

const RowActions = () => {
    return (
        <RowButtonGroup>
            <ShowButton />
            <DeleteWithConfirmButton redirect={false} />
        </RowButtonGroup>
    );
};

export const TriggerList = () => {
    const resource = useResourceContext();
    const { root } = useRootSelector();
    const getFilters = useGetFilters();

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ListBaseLive
                exporter={yamlExporter}
                sort={{ field: 'metadata.updated', order: 'DESC' }}
                storeKey={`${root}.${resource}.listParams`}
                queryOptions={{ meta: { root } }}
            >
                <>
                    <ListPageTitle icon={<TriggerIcon fontSize={'large'} />} />

                    <TopToolbar />

                    <FlatCard>
                        <ListView
                            filters={getFilters()}
                            actions={false}
                            component={Box}
                            sx={{ pb: 2 }}
                        >
                            <Datagrid
                                rowClick="show"
                                bulkActionButtons={
                                    <BulkDeleteAllVersionsButton />
                                }
                            >
                                <TextField
                                    source="name"
                                    label="fields.name.title"
                                />
                                <DateField
                                    source="metadata.created"
                                    label="fields.created.title"
                                    showDate
                                    showTime
                                />
                                <DateField
                                    source="metadata.updated"
                                    label="fields.updated.title"
                                    showDate
                                    showTime
                                />
                                <FunctionField
                                    source="spec.function"
                                    label="fields.function.title"
                                    sortable={false}
                                    render={record => {
                                        if (record?.spec?.function) {
                                            return (
                                                <>
                                                    {
                                                        functionParser(
                                                            record.spec.function
                                                        ).name
                                                    }
                                                </>
                                            );
                                        }

                                        if (record?.spec?.workflow) {
                                            return (
                                                <>
                                                    {
                                                        functionParser(
                                                            record.spec.workflow
                                                        ).name
                                                    }
                                                </>
                                            );
                                        }

                                        return <></>;
                                    }}
                                />
                                <TextField source="kind" label="fields.kind" />

                                <FunctionField
                                    source="spec.task"
                                    label="fields.task.title"
                                    sortable={false}
                                    render={record =>
                                        record?.spec?.task ? (
                                            <>
                                                {
                                                    taskParser(record.spec.task)
                                                        .kind
                                                }
                                            </>
                                        ) : (
                                            <></>
                                        )
                                    }
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
