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
import { BulkDeleteAllVersionsButton } from '../../../common/components/buttons/delete/BulkDeleteAllVersionsButton';
import { StateChips } from '../../../common/components/StateChips';
import { prettyBytes } from '../../../features/files/fileBrowser/utils';
import { IdField } from '../../../common/components/fields/IdField';
import { LabelsField } from '../../../common/components/fields/LabelsField';

export const ContainerImageDataTable = (props: { storeKey?: string }) => {
    const { storeKey } = props;
    return (
        <DataTable
            storeKey={storeKey}
            rowClick="show"
            bulkActionButtons={
                <BulkDeleteAllVersionsButton
                    deleteAll
                    askForDeleteAll
                    disableDeleteAll
                />
            }
            hiddenColumns={[
                'id',
                'kind',
                'project',
                'status.digest',
                'created_by',
                'metadata.created_by',
                'metadata.updated',
                'status.state',
            ]}
        >
            <DataTable.Col
                source="name"
                label="fields.name.title"
                sx={{ fontWeight: '600' }}
            />
            <DataTable.Col source="id" label="fields.id" />
            <DataTable.Col source="kind" label="fields.kind" />
            <DataTable.Col source="project" label="fields.project.title" />

            <DataTable.Col
                source="spec.image"
                label="fields.container.image.title"
            >
                <IdField source="spec.image" truncate={35} popover={true} />
            </DataTable.Col>
            <DataTable.Col
                source="status.digest"
                label="fields.containers.digest.title"
            >
                <IdField
                    source="status.digest"
                    truncate={10}
                    popover={true}
                    copy={false}
                />
            </DataTable.Col>

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
                source="status.size"
                disableSort
                label="fields.files.size"
            >
                <FunctionField
                    render={record =>
                        record?.status?.size
                            ? prettyBytes(record.status.size)
                            : ''
                    }
                />
            </DataTable.Col>
            <DataTable.Col
                source="metadata.labels"
                disableSort
                label="fields.labels.title"
            >
                <LabelsField
                    label="fields.labels.title"
                    source="metadata.labels"
                    sortable={false}
                />
            </DataTable.Col>
            <DataTable.Col source="status.state" label="fields.status.state">
                <StateChips source="status.state" label="fields.status.state" />
            </DataTable.Col>
            <DataTable.Col>
                <RowButtonGroup>
                    <ShowButton />
                    <DeleteWithConfirmButtonByName
                        deleteAll
                        askForDeleteAll
                        disableDeleteAll
                    />
                </RowButtonGroup>
            </DataTable.Col>
        </DataTable>
    );
};
