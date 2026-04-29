// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';
import {
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    FunctionField,
    ListView,
    SelectInput,
    ShowButton,
    TextField,
    TextInput,
    TopToolbar,
    useLocaleState,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { Box, Container } from '@mui/material';
import yamlExporter from '@dslab/ra-export-yaml';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { ListPageTitle } from '../../common/components/layout/PageTitle';
import { RowButtonGroup } from '../../common/components/buttons/RowButtonGroup';
import { StateChips, StateColors } from '../../common/components/StateChips';
import { TriggerIcon } from './icon';
import { BulkDeleteAllVersionsButton } from '../../common/components/buttons/delete/BulkDeleteAllVersionsButton';
import { useRootSelector } from '@dslab/ra-root-selector';
import { functionParser, taskParser } from '../../common/utils/parsers';
import { ListBaseLive } from '../../features/notifications/components/ListBaseLive';
import { useKinds } from '../../common/hooks/useKinds';
import { FILTER_INPUT_PROPS } from '../../common/theme';

const allStateChoices = Object.keys(StateColors).map(s => ({
    id: s,
    name: 'states.' + s.toLowerCase(),
}));

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
    const kinds = useKinds();
    const translate = useTranslate();
    const [localeState] = useLocaleState();
    const locale = localeState?.startsWith('it') ? 'it' : 'en';

    const sortedStateChoices = useMemo(
        () =>
            [...allStateChoices].sort((a, b) =>
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
                    <ListPageTitle icon={<TriggerIcon fontSize={'large'} />} />

                    <TopToolbar />

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
