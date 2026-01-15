// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    useRecordContext,
    FieldProps,
    RecordContextProvider,
    DatagridCell,
    DatagridClasses,
    DatagridField,
    useResourceContext,
} from 'react-admin';
import { Divider, Stack } from '@mui/material';
import { ElementType } from 'react';
import clsx from 'clsx';

export const MultiField = (props: FieldProps & { component: ElementType }) => {
    const { component: Field, cellClassName, ...rest } = props;
    const record = useRecordContext();
    const resource = useResourceContext();

    if (!record?.docs) return null;

    const field = <Field {...rest} />;

    return (
        <Stack
            sx={{ height: '100%', justifyContent: 'space-evenly' }}
            divider={<Divider />}
        >
            {record.docs.map((r, index) => (
                <RecordContextProvider
                    value={r}
                    key={'MultiField_' + rest.source + index}
                >
                    <DatagridCell
                        key={`${r.id}-${
                            (field as DatagridField).props.source || index
                        }`}
                        className={clsx(
                            `column-${(field as DatagridField).props.source}`,
                            DatagridClasses.rowCell,
                            'MultiFieldCell'
                        )}
                        record={record}
                        {...{
                            field: field as DatagridField,
                            resource,
                        }}
                    />
                </RecordContextProvider>
            ))}
        </Stack>
    );
};
