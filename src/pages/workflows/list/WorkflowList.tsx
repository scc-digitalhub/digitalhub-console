// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import yamlExporter from '@dslab/ra-export-yaml';
import { Box, Container } from '@mui/material';
import {
    ListBase,
    ListView,
    SelectInput,
    TextInput,
    useResourceContext,
    useStore,
    useTranslate,
} from 'react-admin';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { ListPageTitle } from '../../../common/components/layout/PageTitle';
import { WorkflowIcon } from '../icon';
import { useRootSelector } from '@dslab/ra-root-selector';
import { useKinds } from '../../../common/hooks/useKinds';
import { FILTER_INPUT_PROPS } from '../../../common/theme';
import {
    TableViewIcon,
    RowsViewIcon,
} from '../../../common/components/buttons/ViewsSelector';
import { ListToolbar } from './ListToolbar';
import { DataTableView } from './DataTableView';
import { DetailsView } from './DetailsView';

export const WorkflowList = () => {
    const resource = useResourceContext();
    const { root } = useRootSelector();
    const kinds = useKinds();
    const translate = useTranslate();
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
            <ListBase
                exporter={yamlExporter}
                sort={{ field: 'metadata.updated', order: 'DESC' }}
                storeKey={`${root}.${resource}.listParams`}
            >
                <>
                    <ListPageTitle icon={<WorkflowIcon fontSize={'large'} />} />
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
            </ListBase>
        </Container>
    );
};
