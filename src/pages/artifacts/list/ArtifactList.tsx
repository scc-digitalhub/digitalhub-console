// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import yamlExporter from '@dslab/ra-export-yaml';
import { Box, Container } from '@mui/material';
import { useMemo } from 'react';
import {
    ListView,
    SelectInput,
    TextInput,
    useLocaleState,
    useResourceContext,
    useStore,
    useTranslate,
} from 'react-admin';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { ListPageTitle } from '../../../common/components/layout/PageTitle';
import { ArtifactIcon } from '../icon';
import { useRootSelector } from '@dslab/ra-root-selector';
import { StateChips } from '../../../common/components/StateChips';
import { ListBaseLive } from '../../../features/notifications/components/ListBaseLive';
import { FILTER_INPUT_PROPS } from '../../../common/theme';
import {
    RowsViewIcon,
    TableViewIcon,
} from '../../../common/components/buttons/ViewsSelector';
import { ListToolbar } from './ListToolbar';
import { DataTableView } from './DataTableView';
import { DetailsView } from './DetailsView';

const fileStateChoices = [
    { id: 'CREATED', name: 'states.created' },
    { id: 'ERROR', name: 'states.error' },
    { id: 'READY', name: 'states.ready' },
    { id: 'UPLOADING', name: 'states.uploading' },
];

export const ArtifactList = () => {
    const resource = useResourceContext();
    const { root } = useRootSelector();
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
                storeKey={`${storeKey}.listParams`}
                queryOptions={{ meta: { root } }}
            >
                <>
                    <ListPageTitle icon={<ArtifactIcon fontSize={'large'} />} />

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
