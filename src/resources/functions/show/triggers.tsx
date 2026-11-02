// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    DeleteWithConfirmButton,
    FunctionField,
    ListView,
    ShowButton,
    TopToolbar,
    useLocaleState,
    useRecordContext,
    Datagrid,
    TextField,
    ListBase,
} from 'react-admin';
import { Box, Tooltip } from '@mui/material';
import yamlExporter from '@dslab/ra-export-yaml';
import React, { useMemo } from 'react';
import { useRootSelector } from '@dslab/ra-root-selector';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { ListPageTitle } from '../../../common/components/layout/PageTitle';
import { StateChips } from '../../../common/components/StateChips';
import { useKinds } from '../../../common/hooks/useKinds';
import { RunIcon } from '../../runs/icon';
import { InspectButton } from '@dslab/ra-inspect-button';
import { DropDownButton } from '../../../common/components/buttons/DropdownButton';
import { RowButtonGroup } from '../../../common/components/buttons/RowButtonGroup';
import { CreateInDialogButton } from '@dslab/ra-dialog-crud';
import { useGetManySchemas } from '../../../common/jsonSchema/schemaController';
import { Spacer } from '../../../common/components/layout/Spacer';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { DeactivateButton } from '../../triggers/components/DeactivateButton';
import { ActivateButton } from '../../triggers/components/ActivateButton';
import { TriggerCreateForm } from '../../triggers/create';
import InfoIcon from '@mui/icons-material/Info';

const getAction = (kind: string) => {
    const t =
        kind.indexOf(':') > 0 ? kind.substring(0, kind.indexOf(':')) : kind;
    if (t.indexOf('+') > 0) {
        return t.split('+')[1];
    }
    return t;
};

export const TriggersListView = props => {
    const { root } = useRootSelector();
    const record = useRecordContext(props);
    const [localeState] = useLocaleState();
    const locale = localeState?.startsWith('it') ? 'it' : 'en';

    const runtime = record?.kind || null;
    //use short function key without the id to mark :latest
    const functionKey = record
        ? `${record.kind}://${record.project}/${record.name}`
        : null;

    const kinds = useKinds({ resource: 'runs', runtime });
    const { data: schemas } = useGetManySchemas([
        { resource: 'tasks', runtime },
        { resource: 'runs', runtime },
    ]);

    //generate create buttons
    const buttons = useMemo(() => {
        if (record && kinds) {
            return kinds.map(kind => {
                const tk = kind.substring(0, kind.indexOf(':'));
                const task = {
                    kind: tk,
                    project: record.project,
                    spec: {},
                };

                const taskSchema = schemas?.find(s => s.kind == task.kind);
                const runSchema = schemas?.find(s => s.kind == kind);

                console.log('task:', task);
                console.log('taskSchema:', taskSchema);
                console.log('runSchema:', runSchema);
                //kind or full reference
                const taskKey = task.kind;

                const partial = {
                    project: record.project,
                    spec: {
                        function: functionKey,
                        task: taskKey,
                        template: {
                            function: functionKey,
                            task: taskKey,
                            local_execution: false,

                            //copy the task spec  (using record)
                            ...task.spec,
                        },
                    },
                };

                const prepare = (r: any) => {
                    const v = {
                        ...r,
                        project: record.project,
                        spec: {
                            task: taskKey,
                            function: functionKey,
                            //copy the task spec  (using form)
                            ...r.spec,
                        },
                    };

                    //clear values from template
                    if (v.spec.template) {
                        if (v.spec.template['function']) {
                            delete v.spec.template['function'];
                        }
                        if (v.spec.template['workflow']) {
                            delete v.spec.template['workflow'];
                        }
                        if (v.spec.template.task) {
                            delete v.spec.template.task;
                        }
                        v.spec.template.local_execution = false;
                    }

                    return v;
                };

                const label =
                    taskSchema?.uiSchema?.['ui:title@' + locale] ||
                    taskSchema?.uiSchema?.['ui:title'] ||
                    'resources.tasks.kinds.' + getAction(task.kind);
                return (
                    <CreateInDialogButton
                        resource="triggers"
                        key={task.kind}
                        record={partial}
                        fullWidth
                        maxWidth={'lg'}
                        transform={prepare}
                        closeOnClickOutside={true}
                        label={label}
                        icon={<KeyboardArrowRightIcon fontSize="small" />}
                    >
                        <TriggerCreateForm
                            runSchema={runSchema?.schema}
                            taskSchema={taskSchema?.schema}
                        />
                    </CreateInDialogButton>
                );
            });
        }
        return [];
    }, [record, kinds, functionKey, schemas, locale]);

    if (!record) {
        return null;
    }

    return (
        <Box>
            <ListBase
                resource={'triggers'}
                exporter={yamlExporter}
                sort={{ field: 'metadata.created', order: 'DESC' }}
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
                    <ListToolbar buttons={buttons} />

                    <FlatCard>
                        <ListView
                            actions={false}
                            component={Box}
                            sx={{ pb: 2 }}
                        >
                            <Datagrid
                                bulkActionButtons={false}
                                rowClick={false}
                                sx={{ marginTop: '12px' }}
                            >
                                <TextField
                                    source="name"
                                    label="fields.name.title"
                                    sortable={false}
                                />
                                <TextField
                                    source="kind"
                                    label="fields.kind"
                                    sortable={false}
                                />
                                <TextField
                                    source="spec.task"
                                    label="fields.task.title"
                                    sortable={false}
                                />                                
                                <FunctionField
                                    label="fields.status.state"
                                    sortable={false}
                                    render={record =>
                                        record.status?.message ? (
                                            <>
                                                <StateChips source="status.state" />
                                                <Tooltip
                                                    title={
                                                        record.status.message
                                                    }
                                                >
                                                    <InfoIcon
                                                        fontSize="small"
                                                        color={'disabled'}
                                                        sx={{ ml: 0.3 }}
                                                    />
                                                </Tooltip>
                                            </>
                                        ) : (
                                            <StateChips source="status.state" />
                                        )
                                    }
                                />

                                <RowButtonGroup>
                                    <DropDownButton>
                                        <ShowButton />
                                        <InspectButton fullWidth />
                                        <FunctionField
                                            render={record =>
                                                record.status?.state ==
                                                'RUNNING' ? (
                                                    <DeactivateButton
                                                        record={record}
                                                    />
                                                ) : record.status?.state ==
                                                  'STOPPED' ? (
                                                    <ActivateButton
                                                        record={record}
                                                    />
                                                ) : null
                                            }
                                        />
                                        <DeleteWithConfirmButton
                                            redirect={false}
                                        />
                                    </DropDownButton>
                                </RowButtonGroup>
                            </Datagrid>
                        </ListView>
                    </FlatCard>
                </>
            </ListBase>
        </Box>
    );
};

const ListToolbar = (props: { buttons?: React.ReactElement<any>[] }) => {
    return (
        <TopToolbar>
            {props.buttons && (
                <DropDownButton label="ra.action.create">
                    {props.buttons.map(button => button)}
                </DropDownButton>
            )}
            <Spacer />
        </TopToolbar>
    );
};
