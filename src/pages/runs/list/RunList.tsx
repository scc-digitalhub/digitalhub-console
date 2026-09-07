// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    ListView,
    SelectInput,
    TextInput,
    useGetList,
    useLocaleState,
    useResourceContext,
    useStore,
    useTranslate,
} from 'react-admin';
import { Box, Container } from '@mui/material';
import yamlExporter from '@dslab/ra-export-yaml';
import { useCallback, useMemo } from 'react';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { ListPageTitle } from '../../../common/components/layout/PageTitle';
import { StateChips, StateColors } from '../../../common/components/StateChips';
import { RunIcon } from '../icon';
import { useRootSelector } from '@dslab/ra-root-selector';
import { FUNCTION_OR_WORKFLOW } from '../../../common/utils/helpers';
import { ListBaseLive } from '../../../features/notifications/components/ListBaseLive';
import { useKinds } from '../../../common/hooks/useKinds';
import { FILTER_INPUT_PROPS } from '../../../common/theme';
import {
    TableViewIcon,
    RowsViewIcon,
} from '../../../common/components/buttons/ViewsSelector';
import { DataTableView } from './DataTableView';
import { DetailsView } from './DetailsView';
import { ListToolbar } from './ListToolbar';

const allStateChoices = Object.keys(StateColors).map(s => ({
    id: s,
    name: 'states.' + s.toLowerCase(),
}));

export const RunList = () => {
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

    const sortedStateChoices = useMemo(
        () =>
            [...allStateChoices].sort((a, b) =>
                translate(a.name).localeCompare(translate(b.name), locale)
            ),
        [translate, locale]
    );

    const functionSelectOption = useCallback(
        d => ({
            ...d,
            data: d.data?.map(record => ({
                name: record.name,
                id: `function_${record.kind}://${record.project}/${record.name}`,
            })),
        }),
        []
    );

    const workflowSelectOption = useCallback(
        d => ({
            ...d,
            data: d.data?.map(record => ({
                name: record.name,
                id: `workflow_${record.kind}://${record.project}/${record.name}`,
            })),
        }),
        []
    );

    const { data: functions } = useGetList(
        'functions',
        { pagination: { page: 1, perPage: 100 } },
        { select: functionSelectOption }
    );
    const { data: workflows } = useGetList(
        'workflows',
        { pagination: { page: 1, perPage: 100 } },
        { select: workflowSelectOption }
    );

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ListBaseLive
                exporter={yamlExporter}
                sort={{ field: 'metadata.created', order: 'DESC' }}
                storeKey={`${root}.${resource}.listParams`}
                queryOptions={{ meta: { root } }}
            >
                <>
                    <ListPageTitle icon={<RunIcon fontSize={'large'} />} />
                    <ListToolbar
                        storeKey={storeKey}
                        views={views}
                        selectedView={selectedView}
                        setSelectedView={setSelectedView}
                    />
                    <FlatCard>
                        <ListView
                            filters={
                                kinds && functions && workflows
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
                                          <SelectInput
                                              key={FUNCTION_OR_WORKFLOW}
                                              label={`${translate(
                                                  'resources.functions.name',
                                                  { smart_count: 1 }
                                              )}/${translate(
                                                  'resources.workflows.name',
                                                  { smart_count: 1 }
                                              )}`}
                                              source={FUNCTION_OR_WORKFLOW}
                                              choices={[
                                                  ...functions,
                                                  ...workflows,
                                              ]}
                                              {...FILTER_INPUT_PROPS}
                                          />,
                                      ]
                                    : undefined
                            }
                            actions={false}
                            component={Box}
                            sx={{ pb: 2 }}
                        >
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
