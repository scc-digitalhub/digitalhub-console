// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import yamlExporter from '@dslab/ra-export-yaml';
import { Box, Container, Stack, Typography, useTheme } from '@mui/material';
import { useMemo } from 'react';
import {
    ColumnsButton,
    CreateButton,
    DataTable,
    DateField,
    EditButton,
    FunctionField,
    ListView,
    SelectInput,
    ShowButton,
    SimpleList,
    TextField,
    TextInput,
    TopToolbar,
    useGetResourceLabel,
    useListContext,
    useLocaleState,
    useResourceContext,
    useStore,
    useTranslate,
} from 'react-admin';
import { DeleteWithConfirmButtonByName } from '../../common/components/buttons/delete/DeleteWithConfirmButtonByName';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { ListPageTitle } from '../../common/components/layout/PageTitle';
import { RowButtonGroup } from '../../common/components/buttons/RowButtonGroup';
import { ModelIcon } from './icon';
import { ChipsField } from '../../common/components/fields/ChipsField';
import { BulkDeleteAllVersionsButton } from '../../common/components/buttons/delete/BulkDeleteAllVersionsButton';
import { useRootSelector } from '@dslab/ra-root-selector';
import { StateChips } from '../../common/components/StateChips';
import { ListBaseLive } from '../../features/notifications/components/ListBaseLive';
import { useKinds } from '../../common/hooks/useKinds';
import { FILTER_INPUT_PROPS } from '../../common/theme';
import { ImportButton } from '../../common/components/buttons/ImportButton';
import { UploadCreateButton } from '../../common/components/buttons/UploadCreateButton';
import {
    RowsViewIcon,
    TableViewIcon,
    View,
    ViewSelector,
} from '../../common/components/buttons/ViewsSelector';
import { IdField } from '../../common/components/fields/IdField';
import { formatDateDifference } from '../../common/utils/helpers';
import { prettyBytes } from '../../features/files/fileBrowser/utils';

const fileStateChoices = [
    { id: 'CREATED', name: 'states.created' },
    { id: 'ERROR', name: 'states.error' },
    { id: 'READY', name: 'states.ready' },
    { id: 'UPLOADING', name: 'states.uploading' },
];

const RowActions = () => (
    <RowButtonGroup>
        <ShowButton />
        <EditButton />
        <DeleteWithConfirmButtonByName
            deleteAll
            cascade
            askForDeleteAll
            askForCascade
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
            <UploadCreateButton />
            <CreateButton />
            <ImportButton />
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

export const ModelList = () => {
    const resource = useResourceContext();
    const { root } = useRootSelector();
    const kinds = useKinds();
    const translate = useTranslate();
    const [localeState] = useLocaleState();
    const locale = localeState?.startsWith('it') ? 'it' : 'en';
    const storeKey = `${root}.${resource}.list`;
    const [selectedView, setSelectedView] = useStore(
        `${storeKey}.view`,
        'dataTable'
    );

    const sortedStateChoices = useMemo(
        () =>
            [...fileStateChoices].sort((a, b) =>
                translate(a.name).localeCompare(translate(b.name), locale)
            ),
        [translate, locale]
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
                storeKey={`${root}.${resource}.listParams`}
                queryOptions={{ meta: { root } }}
            >
                <>
                    <ListPageTitle icon={<ModelIcon fontSize={'large'} />} />

                    <ListToolbar
                        storeKey={storeKey}
                        views={views}
                        selectedView={selectedView}
                        setSelectedView={setSelectedView}
                    />

                    <FlatCard>
                        <ListView
                            filters={
                                kinds
                                    ? [
                                          <TextInput
                                              label="ra.action.search"
                                              source="q"
                                              alwaysOn
                                              resettable
                                              key="q"
                                          />,
                                          <SelectInput
                                              key="kind"
                                              label="fields.kind"
                                              source="kind"
                                              choices={kinds.map(s => ({
                                                  id: s,
                                                  name: s,
                                              }))}
                                              {...FILTER_INPUT_PROPS}
                                          />,
                                          <SelectInput
                                              key="state"
                                              label="fields.status.state"
                                              source="state"
                                              choices={sortedStateChoices}
                                              optionText={choice => (
                                                  <StateChips
                                                      record={choice}
                                                      source="id"
                                                      label="name"
                                                      size="small"
                                                  />
                                              )}
                                              {...FILTER_INPUT_PROPS}
                                          />,
                                      ]
                                    : undefined
                            }
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
                            {selectedView == 'details' && (
                                <DetailsView storeKey={`${storeKey}.details`} />
                            )}
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
                    cascade
                    askForDeleteAll
                    askForCascade
                    disableDeleteAll
                />
            }
            hiddenColumns={[
                'id',
                'kind',
                'created_by',
                'spec.path',
                'metadata.created_by',
                'metadata.updated',
            ]}
        >
            <DataTable.Col source="name" label="fields.name.title" />
            <DataTable.Col source="id" label="fields.id" />
            <DataTable.Col source="kind" label="fields.kind" />
            <DataTable.Col
                source="metadata.updated"
                label="fields.updated.title"
            >
                <DateField
                    source="metadata.updated"
                    label="fields.updated.title"
                    showDate={true}
                    showTime={true}
                />
            </DataTable.Col>
            <DataTable.Col
                disableSort
                source="metadata.created_by"
                label="fields.user.title"
            />
            <DataTable.Col
                source="spec.path"
                disableSort
                label="fields.path.title"
            >
                <IdField source="spec.path" truncate={35} popover={true} />
            </DataTable.Col>

            <DataTable.Col
                source="status.files"
                disableSort
                label="fields.files.title"
            >
                <FunctionField
                    render={record => record?.status?.files?.length || ''}
                />
            </DataTable.Col>
            <DataTable.Col
                source="status.filesize"
                disableSort
                label="fields.files.size"
            >
                <FunctionField
                    render={record =>
                        record?.status?.files
                            ? prettyBytes(
                                  record.status.files
                                      .filter(f => f.size > 0)
                                      .reduce(
                                          (acc, file) => acc + (file.size || 0),
                                          0
                                      )
                              )
                            : ''
                    }
                />
            </DataTable.Col>
            <DataTable.Col
                source="metadata.labels"
                disableSort
                label="fields.labels.title"
            >
                <ChipsField
                    label="fields.labels.title"
                    source="metadata.labels"
                    sortable={false}
                />
            </DataTable.Col>
            <DataTable.Col source="status.state" label="fields.status.state">
                <StateChips source="status.state" label="fields.status.state" />
            </DataTable.Col>
            <DataTable.Col>
                <RowActions />
            </DataTable.Col>
        </DataTable>
    );
};

const DetailsView = (props: { storeKey?: string }) => {
    const { storeKey } = props;
    const translate = useTranslate();
    const theme = useTheme();
    const getResourceLabel = useGetResourceLabel();
    const resource = useResourceContext();
    const { total } = useListContext();
    const now = new Date();
    const label = resource
        ? getResourceLabel(resource, total || 1)
        : 'resources.' + resource + '.name';
    const showHeader = (total && total >= 1) || false;

    return (
        <>
            {showHeader && (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontWeight: 'medium' }}
                >
                    {translate('messages.navigation.x-elements', {
                        resource: label,
                        smart_count: total,
                    })}
                </Typography>
            )}

            <SimpleList
                primaryText={record => (
                    <Stack direction="row" gap={1} alignItems="left">
                        <Typography
                            variant="body1"
                            color="secondary"
                            sx={{ fontWeight: 'medium' }}
                        >
                            {record.name}
                        </Typography>
                        <ChipsField
                            size={'small'}
                            source="metadata.labels"
                            sortable={false}
                        />
                    </Stack>
                )}
                secondaryText={record => (
                    <Stack direction="column" gap={0.3}>
                        <Stack direction="row" gap={0.3}>
                            <TextField source="kind" />
                            {'| '}
                            {translate('fields.updated.title') +
                                ' ' +
                                formatDateDifference(
                                    new Date(record.metadata.updated),
                                    now,
                                    translate
                                )}
                        </Stack>
                        {record?.status?.files && (
                            <Typography variant="body2" color="text.primary">
                                <Stack direction="row" gap={1}>
                                    <FunctionField
                                        render={record =>
                                            record?.status?.files
                                                ? prettyBytes(
                                                      record.status.files.reduce(
                                                          (acc, file) =>
                                                              acc +
                                                              (file.size || 0),
                                                          0
                                                      )
                                                  )
                                                : ''
                                        }
                                    />
                                    {'-'}
                                    <FunctionField
                                        render={record =>
                                            `${record?.status?.files?.length} ` +
                                                translate(
                                                    'fields.files.title'
                                                ) || ''
                                        }
                                    />
                                </Stack>
                            </Typography>
                        )}

                        <Box mt={1}>
                            <StateChips
                                source="status.state"
                                label="fields.status.state"
                                size="small"
                            />
                        </Box>
                    </Stack>
                )}
                tertiaryText={() => <ShowButton size="medium" label={''} />}
                leftAvatar={record => {
                    return <ModelIcon kind={record.kind} color="secondary" />;
                }}
                rowClick={'show'}
                rowSx={() => ({
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '.MuiAvatar-root': {
                        background:
                            theme.palette.mode === 'dark'
                                ? theme.palette.grey[700]
                                : theme.palette.grey[300],
                    },
                })}
            />
        </>
    );
};
