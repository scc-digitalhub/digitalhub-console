// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import yamlExporter from '@dslab/ra-export-yaml';
import { Box, Container } from '@mui/material';
import { useMemo } from 'react';
import {
    Datagrid,
    DateField,
    EditButton,
    ListView,
    SelectInput,
    ShowButton,
    TextField,
    TextInput,
    useLocaleState,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { DeleteWithConfirmButtonByName } from '../../common/components/buttons/delete/DeleteWithConfirmButtonByName';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { ListPageTitle } from '../../common/components/layout/PageTitle';
import { RowButtonGroup } from '../../common/components/buttons/RowButtonGroup';
import { DataItemIcon } from './icon';
import { ChipsField } from '../../common/components/fields/ChipsField';
import { BulkDeleteAllVersionsButton } from '../../common/components/buttons/delete/BulkDeleteAllVersionsButton';
import { useRootSelector } from '@dslab/ra-root-selector';
import { ListToolbar } from '../../common/components/toolbars/ListToolbar';
import { StateChips } from '../../common/components/StateChips';
import { ListBaseLive } from '../../features/notifications/components/ListBaseLive';
import { useKinds } from '../../common/hooks/useKinds';
import { FILTER_INPUT_PROPS } from '../../common/theme';

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

export const DataItemList = () => {
    const resource = useResourceContext();
    const { root } = useRootSelector();
    const kinds = useKinds();
    const translate = useTranslate();
    const [localeState] = useLocaleState();
    const locale = localeState?.startsWith('it') ? 'it' : 'en';

    const sortedStateChoices = useMemo(
        () =>
            [...fileStateChoices].sort((a, b) =>
                translate(a.name).localeCompare(translate(b.name), locale)
            ),
        [translate, locale]
    );

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ListBaseLive
                exporter={yamlExporter}
                sort={{ field: 'metadata.updated', order: 'DESC' }}
                storeKey={`${root}.${resource}.listParams`}
                queryOptions={{ meta: { root } }}
            >
                <>
                    <ListPageTitle icon={<DataItemIcon fontSize={'large'} />} />

                    <ListToolbar uploadCreate />

                    <FlatCard>
                        <ListView
                            filters={
                                kinds
                                    ? [
                                          <TextInput
                                              label="fields.name.title"
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
                            <Datagrid
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
