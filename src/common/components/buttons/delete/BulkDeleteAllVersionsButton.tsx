// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import {
    BulkDeleteButton,
    BulkDeleteButtonProps,
    BulkDeleteWithConfirmButtonProps,
    RaRecord,
    useListContext,
} from 'react-admin';
import { ConfirmContent } from './ConfirmContent';
import { DeleteButtonOptions } from './types';
import { extractDeleteButtonOptions, sanitizeDeleteButtonProps } from './utils';

export const BulkDeleteAllVersionsButton = <RecordType extends RaRecord = any>(
    props: BulkDeleteButtonProps &
        DeleteButtonOptions &
        Pick<BulkDeleteWithConfirmButtonProps<RecordType>, 'confirmContent'>
) => {
    const {
        mutationMode = 'pessimistic',
        deleteAll: deleteAllFromProps = false,
        cascade: cascadeFromProps = false,
        confirmContent,
        ...rest
    } = props;
    const [deleteAll, setDeleteAll] = useState(deleteAllFromProps);
    const [cascade, setCascade] = useState(cascadeFromProps);
    const { data, selectedIds } = useListContext();

    if (!data) return <></>;

    const selectedData = data.filter(d => selectedIds.includes(d.id));

    const mutationOptions = {
        meta: {
            deleteAll,
            names: selectedData.map(sd => sd.name),
            cascade,
        },
    };

    const defaultConfirmContent = (
        <ConfirmContent
            {...extractDeleteButtonOptions(rest)}
            deleteAll={deleteAll}
            cascade={cascade}
            setDeleteAll={setDeleteAll}
            setCascade={setCascade}
            records={selectedData}
        />
    );

    return (
        <BulkDeleteButton
            {...sanitizeDeleteButtonProps(rest)}
            mutationOptions={mutationOptions}
            mutationMode={mutationMode}
            confirmContent={confirmContent ?? defaultConfirmContent}
        />
    );
};
