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
    useGetList,
    useResourceContext,
} from 'react-admin';
import { Box, Container } from '@mui/material';
import yamlExporter from '@dslab/ra-export-yaml';
import { useCallback } from 'react';
import { FlatCard } from '../../components/FlatCard';
import { ListPageTitle } from '../../components/PageTitle';
import { RowButtonGroup } from '../../components/buttons/RowButtonGroup';
import { StateChips } from '../../components/StateChips';
import { RunIcon } from './icon';
import { BulkDeleteAllVersionsButton } from '../../components/buttons/BulkDeleteAllVersionsButton';
import { useRootSelector } from '@dslab/ra-root-selector';
import { taskParser } from '../../common/helper';
import { ListBaseLive } from '../../components/ListBaseLive';
import { useGetFilters } from '../../controllers/filtersController';

const RowActions = () => {
    return (
        <RowButtonGroup>
            <ShowButton />
            <DeleteWithConfirmButton redirect={false} />
        </RowButtonGroup>
    );
};

export const RunList = () => {
    const resource = useResourceContext();
    const { root } = useRootSelector();
    const getFilters = useGetFilters();

    const selectOption = useCallback(
        d => ({
            ...d,
            data: d.data?.map(record => ({
                name: record.name,
                id: `${record.kind}://${record.project}/${record.name}`,
            })),
        }),
        []
    );

    const { data: functions } = useGetList(
        'functions',
        { pagination: { page: 1, perPage: 100 } },
        { select: selectOption }
    );
    const { data: workflows } = useGetList(
        'workflows',
        { pagination: { page: 1, perPage: 100 } },
        { select: selectOption }
    );

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ListBaseLive
                exporter={yamlExporter}
                sort={{ field: 'metadata.updated', order: 'DESC' }}
                storeKey={`${root}.${resource}.listParams`}
            >
                <>
                    <ListPageTitle icon={<RunIcon fontSize={'large'} />} />

                    <TopToolbar />

                    <FlatCard>
                        <ListView
                            filters={
                                functions && workflows
                                    ? getFilters(functions, workflows)
                                    : undefined
                            }
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
