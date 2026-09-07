// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    DataTable,
    DateField,
    EditButton,
    FunctionField,
    ShowButton,
} from 'react-admin';
import { DeleteWithConfirmButtonByName } from '../../../common/components/buttons/delete/DeleteWithConfirmButtonByName';
import { RowButtonGroup } from '../../../common/components/buttons/RowButtonGroup';
import { ChipsField } from '../../../common/components/fields/ChipsField';
import { BulkDeleteAllVersionsButton } from '../../../common/components/buttons/delete/BulkDeleteAllVersionsButton';
import { StateChips } from '../../../common/components/StateChips';
import { IdField } from '../../../common/components/fields/IdField';
import { prettyBytes } from '../../../features/files/fileBrowser/utils';

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

export const DataTableView = (props: { storeKey?: string }) => {
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
