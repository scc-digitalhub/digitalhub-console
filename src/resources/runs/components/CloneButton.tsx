// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { CreateInDialogButton } from '@dslab/ra-dialog-crud';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { RunCreateForm } from '../create/RunCreateForm';
import { useRecordContext, useTranslate } from 'react-admin';
import { taskParser } from '../../../common/utils/parsers';
import { Alert } from '@mui/material';
import { useGetManySchemas } from '../../../common/jsonSchema/schemaController';
import { transformExtensionPaths } from '../../../features/extensions/utils';
import { useState } from 'react';
import { randomId } from '../../../common/utils/helpers';

export const CloneButton = props => {
    const translate = useTranslate();

    const record = useRecordContext(props);
    const task = taskParser(record?.spec?.task);
    const [id] = useState(randomId);

    //TODO remove hardcoded dereference of task/runtime
    const runtime = task?.kind?.split('+')[0] || '';

    const { data: schemas } = useGetManySchemas([
        { resource: 'tasks', runtime },
        { resource: 'runs', runtime },
    ]);

    if (record === undefined) return null;

    //filter run and task schema
    const runSchema = schemas?.find(s => s.kind == record?.kind);
    const taskSchema = schemas?.find(s => s.kind == task?.kind);

    const taskKey = `${task.kind}://${task.project}/${task.id}`;
    const taskFunction = record?.spec?.function;
    const taskWorkflow = record?.spec?.workflow;

    const defaultValues = {
        id,
        project: record?.project,
        kind: runSchema ? runSchema.kind : 'run',
        spec: record?.spec,
    } as any;

    if (record?.extensions) {
        defaultValues.extensions = record.extensions.map(e => ({
            kind: e.kind,
            name: e.name,
            spec: e.spec,
        }));
    }

    const prepare = (r: any) => {
        return {
            ...r,
            ...transformExtensionPaths(r),
            spec: {
                task: taskKey,
                function: taskFunction,
                workflow: taskWorkflow,
                local_execution: false,
                //copy the task spec  (using form)
                ...r.spec,
            },
        };
    };

    return (
        <CreateInDialogButton
            resource="runs"
            label="ra.action.clone"
            icon={<ContentCopyIcon />}
            record={defaultValues}
            fullWidth
            maxWidth={'lg'}
            transform={prepare}
            closeOnClickOutside={false}
        >
            {runSchema?.schema && taskSchema?.schema ? (
                <RunCreateForm runSchema={runSchema} taskSchema={taskSchema} />
            ) : (
                <Alert severity="error">
                    {translate('messages.invalidKind')}
                </Alert>
            )}
        </CreateInDialogButton>
    );
};
