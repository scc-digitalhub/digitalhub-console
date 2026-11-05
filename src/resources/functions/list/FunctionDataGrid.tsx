// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Stack, useTheme } from '@mui/material';
import {
    Button,
    DataTable,
    DateField,
    FunctionField,
    TextField,
} from 'react-admin';
import { RowButtonGroup } from '../../../common/components/buttons/RowButtonGroup';
import { LabelsField } from '../../../common/components/fields/LabelsField';
import { FunctionIcon } from '../icon';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

export const FunctionDataGrid = (props: {
    selected?: string;
    onSelect?: (record: any | undefined) => void;
}) => {
    console.log('Selected:', props.selected)
    const theme = useTheme();
    return (
        <DataTable
            rowClick={false}
            rowSx={record =>
                record.id === props.selected
                    ? { backgroundColor: theme.palette.action.selected }
                    : {}
            }
            bulkActionButtons={false}
        >
            <DataTable.Col source="name" label="fields.name.title">
                <Stack direction="column" gap={1}>
                    <TextField source="name" sx={{ fontWeight: '600' }} />
                </Stack>
            </DataTable.Col>
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
                <RowButtonGroup>
                    <FunctionField
                        render={record => (
                            <Button
                                label="actions.select"
                                color="primary"
                                onClick={() => props.onSelect?.(record)}
                                disabled={record.id === props.selected}
                            >
                                <RadioButtonCheckedIcon />
                            </Button>
                        )}
                    />
                </RowButtonGroup>
            </DataTable.Col>
        </DataTable>
    );
};
