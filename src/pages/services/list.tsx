// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    FunctionField,
    ListView,
    ResourceContextProvider,
    ShowButton,
    TextField,
    TopToolbar,
    useGetList,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { Box, Container, Typography } from '@mui/material';
import yamlExporter from '@dslab/ra-export-yaml';
import { useCallback } from 'react';
import { FlatCard } from '../../components/FlatCard';
import { ListPageTitle, PageTitle } from '../../components/PageTitle';
import { RowButtonGroup } from '../../components/buttons/RowButtonGroup';
import { StateChips } from '../../components/StateChips';
import { BulkDeleteAllVersionsButton } from '../../components/buttons/BulkDeleteAllVersionsButton';
import { useRootSelector } from '@dslab/ra-root-selector';
import { functionParser, taskParser } from '../../common/helper';
import { ListBaseLive } from '../../components/ListBaseLive';
import { useGetFilters } from '../../controllers/filtersController';
import { Stack } from '@mui/system';
import { ServiceIcon } from './icon';
import { LogsButton } from '../../components/buttons/LogsButton';
import { ClientButton } from './ClientButton';
import { IdField } from '../../components/IdField';

const RowActions = () => {
    return (
        <RowButtonGroup>
            <ShowButton />
            <LogsButton />
            <ClientButton />
        </RowButtonGroup>
    );
};

export const ServiceList = () => {
    const { root } = useRootSelector();
    const translate = useTranslate();
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
            <ResourceContextProvider value="runs">
                <ListBaseLive
                    exporter={yamlExporter}
                    sort={{ field: 'metadata.created', order: 'DESC' }}
                    storeKey={`${root}.services.listParams`}
                    filter={{ action: 'serve' }}
                >
                    <>
                        <PageTitle
                            text={translate('pages.services.title')}
                            secondaryText={translate(
                                'pages.services.helperText'
                            )}
                            icon={<ServiceIcon fontSize={'large'} />}
                        />

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
                                    bulkActionButtons={false}
                                >
                                    <FunctionField
                                        source="spec.function"
                                        label="fields.function.title"
                                        sortable={false}
                                        render={record => (
                                            <Stack direction={'column'} gap={1}>
                                                {record?.spec?.function && (
                                                    <Typography variant="h6">
                                                        {
                                                            functionParser(
                                                                record.spec
                                                                    .function
                                                            ).name
                                                        }
                                                    </Typography>
                                                )}
                                                <TextField
                                                    source="name"
                                                    label="fields.name"
                                                    color="info"
                                                />
                                            </Stack>
                                        )}
                                    />
                                    <FunctionField
                                        source="status.state"
                                        label="fields.status.state"
                                        sortable={false}
                                        render={record => (
                                            <>
                                                <StateChips
                                                    source="status.state"
                                                    label="fields.status.state"
                                                />
                                                {record?.status?.message && (
                                                    <Stack mt={1}>
                                                        <TextField
                                                            source="status.message"
                                                            label="fields.message"
                                                        />
                                                    </Stack>
                                                )}
                                            </>
                                        )}
                                    />

                                    <FunctionField
                                        source="kind"
                                        label="fields.kind"
                                        sortable={false}
                                        render={record => (
                                            <Stack direction={'column'} gap={1}>
                                                <TextField
                                                    source="kind"
                                                    label="fields.kind"
                                                />
                                                {record?.spec?.url && (
                                                    <TextField
                                                        source="spec.url"
                                                        label="fields.url"
                                                    />
                                                )}
                                                {record?.spec?.path && (
                                                    <TextField
                                                        source="spec.path"
                                                        label="fields.path"
                                                    />
                                                )}
                                                {record?.status?.openai && (
                                                    <Typography variant="body2">
                                                        {
                                                            record.status.openai
                                                                .model
                                                        }
                                                    </Typography>
                                                )}
                                            </Stack>
                                        )}
                                    />

                                    <IdField
                                        noWrap
                                        truncate={30}
                                        source="status.service.url"
                                        label="fields.url"
                                    />

                                    <RowActions />
                                </Datagrid>
                            </ListView>
                        </FlatCard>
                    </>
                </ListBaseLive>
            </ResourceContextProvider>
        </Container>
    );
};
