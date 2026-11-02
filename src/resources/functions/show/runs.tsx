// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    ColumnsButton,
    DeleteWithConfirmButton,
    FunctionField,
    ListView,
    SelectInput,
    ShowButton,
    TextInput,
    TopToolbar,
    useLocaleState,
    useRecordContext,
    useResourceContext,
    useStore,
    useTranslate,
    useDataProvider,
} from 'react-admin';
import { Box } from '@mui/material';
import yamlExporter from '@dslab/ra-export-yaml';
import React, { useEffect, useMemo, useState } from 'react';
import { useRootSelector } from '@dslab/ra-root-selector';
import {
    TableViewIcon,
    RowsViewIcon,
    ViewSelector,
    View,
} from '../../../common/components/buttons/ViewsSelector';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { ListPageTitle } from '../../../common/components/layout/PageTitle';
import { StateColors, StateChips } from '../../../common/components/StateChips';
import { useKinds } from '../../../common/hooks/useKinds';
import { FILTER_INPUT_PROPS } from '../../../common/theme';
import { ListBaseLive } from '../../../features/notifications/components/ListBaseLive';
import { RunIcon } from '../../runs/icon';
import { RunDataTable } from '../../runs/list/RunDataTable';
import { RunDetails } from '../../runs/list/RunDetails';
import { InspectButton } from '@dslab/ra-inspect-button';
import { DropDownButton } from '../../../common/components/buttons/DropdownButton';
import { RowButtonGroup } from '../../../common/components/buttons/RowButtonGroup';
import { LogsButton } from '../../../features/logs/components/LogsButton';
import { StopButton } from '../../runs/components/StopButton';
import { CreateInDialogButton } from '@dslab/ra-dialog-crud';
import { RunCreateForm } from '../../runs/create/RunCreateForm';
import { useGetManySchemas } from '../../../common/jsonSchema/schemaController';
import { Spacer } from '../../../common/components/layout/Spacer';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { CloneButton } from '../../runs/components/CloneButton';

const allStateChoices = Object.keys(StateColors).map(s => ({
    id: s,
    name: 'states.' + s.toLowerCase(),
}));
const getAction = (kind: string) => {
    const t =
        kind.indexOf(':') > 0 ? kind.substring(0, kind.indexOf(':')) : kind;
    if (t.indexOf('+') > 0) {
        return t.split('+')[1];
    }
    return t;
};

export const RunListView = props => {
    const { root } = useRootSelector();
    const resource = useResourceContext();
    const record = useRecordContext(props);
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const [localeState] = useLocaleState();
    const locale = localeState?.startsWith('it') ? 'it' : 'en';

    const runtime = record?.kind || null;
    const functionKey = record
        ? `${record.kind}://${record.project}/${record.name}:${record.id}`
        : null;

    const [tasks, setTasks] = useState<any[]>([]);

    const kinds = useKinds({ resource: 'runs', runtime });
    const { data: schemas } = useGetManySchemas([
        { resource: 'tasks', runtime },
        { resource: 'runs', runtime },
    ]);

    useEffect(() => {
        if (record && dataProvider) {
            dataProvider
                .getList('tasks', {
                    pagination: { page: 1, perPage: 100 },
                    sort: { field: 'kind', order: 'ASC' },
                    filter: {
                        function: `${record.kind}://${record.project}/${record.name}:${record.id}`,
                    },
                })
                .then(({ data }) => setTasks(data))
                .catch(err => console.error(err));
        }
    }, [record, dataProvider]);

    const storeKey = `${root}.${resource}.function.runs`;
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

    const filters = kinds
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
                      name: getAction(s),
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
        : [];

    //generate create buttons
    const buttons = useMemo(() => {
        if (record && kinds) {
            return kinds.map(kind => {
                const tk = kind.substring(0, kind.indexOf(':'));
                const task = tasks?.find(t => t.kind == tk) || {
                    kind: tk,
                    project: record.project,
                    spec: {},
                };

                //kind or full reference
                const taskKey = task.id
                    ? `${task.kind}://${task.project}/${task.id}`
                    : task.kind;

                const partial = {
                    project: record.project,
                    kind: kind,
                    spec: {
                        function: functionKey,
                        task: taskKey,
                        local_execution: false,
                        //copy the task spec  (using record)
                        ...task.spec,
                    },
                };

                const prepare = (r: any) => {
                    return {
                        ...r,
                        project: record.project,
                        kind: task.kind + ':run',
                        spec: {
                            function: functionKey,
                            task: taskKey,
                            local_execution: false,
                            //copy the task spec  (using form)
                            ...r.spec,
                        },
                    };
                };

                const label =
                    task.uiSchema?.['ui:title@' + locale] ||
                    task.uiSchema?.['ui:title'] ||
                    'resources.tasks.kinds.' + getAction(task.kind);
                return (
                    <CreateInDialogButton
                        resource="runs"
                        key={task.kind}
                        record={partial}
                        fullWidth
                        maxWidth={'lg'}
                        transform={prepare}
                        closeOnClickOutside={true}
                        label={label}
                        icon={<KeyboardArrowRightIcon fontSize="small" />}
                    >
                        <RunCreateForm
                            runSchema={schemas?.find(s => s.kind == kind)}
                            taskSchema={schemas?.find(s => s.kind == task.kind)}
                        />
                    </CreateInDialogButton>
                );
            });
        }
        return [];
    }, [record, tasks, kinds, functionKey, schemas, locale]);

    if (!record) {
        return null;
    }

    return (
        <Box>
            <ListBaseLive
                resource={'runs'}
                exporter={yamlExporter}
                sort={{ field: 'metadata.created', order: 'DESC' }}
                storeKey={`${storeKey}.listParams`}
                queryOptions={{ meta: { root } }}
                filter={{
                    function: functionKey,
                }}
            >
                <>
                    <ListPageTitle
                        fontSize="small"
                        icon={<RunIcon fontSize={'large'} />}
                    />
                    <ListToolbar
                        storeKey={storeKey}
                        views={views}
                        selectedView={selectedView}
                        setSelectedView={setSelectedView}
                        buttons={buttons}
                    />

                    <FlatCard>
                        <ListView
                            filters={filters}
                            actions={false}
                            component={Box}
                            sx={{ pb: 2 }}
                        >
                            {selectedView == 'dataTable' && (
                                <RunDataTable
                                    hiddenColumns={[
                                        'name',
                                        'id',
                                        'metadata.updated',
                                        'metadata.labels',
                                        'spec.profile',
                                        'metrics',
                                    ]}
                                    storeKey={`${storeKey}.dataTable`}
                                    actions={<RowActions />}
                                />
                            )}
                            {selectedView == 'details' && <RunDetails />}
                        </ListView>
                    </FlatCard>
                </>
            </ListBaseLive>
        </Box>
    );
};

const RowActions = () => {
    return (
        <RowButtonGroup>
            <DropDownButton>
                <ShowButton />
                <LogsButton />
                <InspectButton fullWidth />
                <CloneButton />
                <FunctionField
                    render={record =>
                        record.status?.state == 'RUNNING' ? (
                            <StopButton record={record} />
                        ) : null
                    }
                />
                <DeleteWithConfirmButton redirect={false} />
            </DropDownButton>
        </RowButtonGroup>
    );
};

const ListToolbar = (props: {
    storeKey?: string;
    views: View[];
    selectedView?: string;
    setSelectedView?: (view: string) => void;
    buttons?: React.ReactElement<any>[];
}) => {
    const {
        storeKey,
        views,
        selectedView = 'dataTable',
        setSelectedView,
    } = props;
    return (
        <TopToolbar>
            {props.buttons && (
                <DropDownButton label="ra.action.create">
                    {props.buttons.map(button => button)}
                </DropDownButton>
            )}
            <Spacer />
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
