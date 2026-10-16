// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Stack } from '@mui/material';
import {
    DataTable,
    DateField,
    EditButton,
    FunctionField,
    ShowButton,
    TextField,
    useTranslate,
} from 'react-admin';
import { DeleteWithConfirmButtonByName } from '../../../common/components/buttons/delete/DeleteWithConfirmButtonByName';
import { RowButtonGroup } from '../../../common/components/buttons/RowButtonGroup';
import { BulkDeleteAllVersionsButton } from '../../../common/components/buttons/delete/BulkDeleteAllVersionsButton';
import { RunStateBadge } from '../../../common/components/RunStateBadge';
import { LabelsField } from '../../../common/components/fields/LabelsField';
import { FunctionIcon } from '../icon';
import { VersionsCount } from '../../../common/components/VersionsList';

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
    const translate = useTranslate();

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
                'metadata.created_by',
                'metadata.updated',
            ]}
        >
            <DataTable.Col source="name" label="fields.name.title">
                <Stack direction="column" gap={1}>
                    <TextField source="name" sx={{ fontWeight: '600' }} />
                    <VersionsCount />
                </Stack>
            </DataTable.Col>
            <DataTable.Col source="id" label="fields.id" />
            <DataTable.Col source="kind" label="fields.kind">
                <FunctionField
                    render={record => (
                        <Stack direction="row" gap={0.9}>
                            <FunctionIcon
                                kind={record.kind}
                                color="secondary"
                            />
                            {record.kind}
                        </Stack>
                    )}
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
                source="status.runs"
                disableSort
                label={translate('resources.runs.name', {
                    smart_count: 2,
                })}
            >
                <FunctionField
                    render={() => (
                        <Stack direction="row" spacing={0.5}>
                            <RunStateBadge />
                            <RunStateBadge state="COMPLETED" />
                            <RunStateBadge state="ERROR" />
                        </Stack>
                    )}
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

            <DataTable.Col>
                <RowActions />
            </DataTable.Col>
        </DataTable>
    );
};
