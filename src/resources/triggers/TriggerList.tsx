// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    FunctionField,
    ShowButton,
    TextField,
} from 'react-admin';
import { RowButtonGroup } from '../../common/components/buttons/RowButtonGroup';
import { StateChips } from '../../common/components/StateChips';
import { BulkDeleteAllVersionsButton } from '../../common/components/buttons/delete/BulkDeleteAllVersionsButton';
import { functionParser, taskParser } from '../../common/utils/parsers';

export const TriggerList = () => {
    return (
        <Datagrid
            rowClick="show"
            bulkActionButtons={<BulkDeleteAllVersionsButton />}
        >
            <TextField source="name" label="fields.name.title" />
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
                        return <>{functionParser(record.spec.function).name}</>;
                    }

                    if (record?.spec?.workflow) {
                        return <>{functionParser(record.spec.workflow).name}</>;
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
                        <>{taskParser(record.spec.task).kind}</>
                    ) : (
                        <></>
                    )
                }
            />

            <StateChips source="status.state" label="fields.status.state" />

            <RowButtonGroup>
                <ShowButton />
                <DeleteWithConfirmButton redirect={false} />
            </RowButtonGroup>
        </Datagrid>
    );
};
