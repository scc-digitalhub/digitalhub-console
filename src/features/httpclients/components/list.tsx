// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Datagrid,
    FunctionField,
    ListView,
    ResourceContextProvider,
    ShowButton,
    TextField,
    TopToolbar,
    useTranslate,
} from 'react-admin';
import { Box, Container, Typography } from '@mui/material';
import yamlExporter from '@dslab/ra-export-yaml';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { PageTitle } from '../../../common/components/layout/PageTitle';
import { RowButtonGroup } from '../../../common/components/buttons/RowButtonGroup';
import { StateChips } from '../../../common/components/StateChips';
import { useRootSelector } from '@dslab/ra-root-selector';
import { functionParser } from '../../../common/utils/helper';
import { ListBaseLive } from '../../notifications/components/ListBaseLive';
import { Stack } from '@mui/system';
import { ServiceIcon } from './icon';
import { ClientButton } from './ClientButton';
import { IdField } from '../../../common/components/fields/IdField';
import { FunctionIcon } from '../../../pages/functions/icon';
import { LogsButton } from '../../logs/components/LogsButton';

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

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ResourceContextProvider value="runs">
                <ListBaseLive
                    exporter={yamlExporter}
                    sort={{ field: 'metadata.created', order: 'DESC' }}
                    storeKey={`${root}.services.listParams`}
                    filter={{ action: 'serve' }}
                    queryOptions={{ meta: { root } }}
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

                        <FlatCard sx={{ pt: '9px' }}>
                            <ListView
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
                                        label="fields.name.title"
                                        sortable={false}
                                        render={record => (
                                            <Stack gap={1}>
                                                <TextField
                                                    source="name"
                                                    label="fields.name"
                                                    variant="body1"
                                                />
                                                {record?.spec?.function && (
                                                    <Stack
                                                        direction="row"
                                                        gap={1}
                                                    >
                                                        <FunctionIcon
                                                            fontSize="small"
                                                            color="info"
                                                        />
                                                        <Typography
                                                            variant="body2"
                                                            color="info"
                                                        >
                                                            {
                                                                functionParser(
                                                                    record.spec
                                                                        .function
                                                                ).name
                                                            }
                                                        </Typography>
                                                    </Stack>
                                                )}
                                            </Stack>
                                        )}
                                    />
                                    <FunctionField
                                        source="status.state"
                                        label="fields.status.state"
                                        sortable={false}
                                        render={record => (
                                            <Stack
                                                gap={1}
                                                sx={{
                                                    alignItems: 'flex-start',
                                                }}
                                            >
                                                <StateChips
                                                    source="status.state"
                                                    label="fields.status.state"
                                                />
                                                {record?.status?.message && (
                                                    <IdField
                                                        noWrap
                                                        truncate={40}
                                                        source="status.message"
                                                        label="fields.events.message.title"
                                                        copy={false}
                                                    />
                                                )}
                                            </Stack>
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
