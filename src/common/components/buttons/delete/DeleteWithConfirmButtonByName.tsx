// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import {
    RaRecord,
    DeleteWithConfirmButton,
    DeleteWithConfirmButtonProps,
    useRecordContext,
} from 'react-admin';
import { ConfirmContent } from './ConfirmContent';
import { DeleteButtonOptions } from './types';
import { extractDeleteButtonOptions, sanitizeDeleteButtonProps } from './utils';

export const DeleteWithConfirmButtonByName = <
    RecordType extends RaRecord = any
>(
    props: DeleteWithConfirmButtonProps<RecordType> & DeleteButtonOptions
) => {
    const {
        deleteAll: deleteAllFromProps = false,
        cascade: cascadeFromProps = false,
        titleTranslateOptions,
        confirmContent,
        ...rest
    } = props;
    const record = useRecordContext(rest);
    const [deleteAll, setDeleteAll] = useState(deleteAllFromProps);
    const [cascade, setCascade] = useState(cascadeFromProps);

    if (!record) return <></>;

    const mutationsOptions = {
        meta: {
            deleteAll,
            name: record.name,
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
            records={[record]}
        />
    );

    return (
        <DeleteWithConfirmButton
            titleTranslateOptions={titleTranslateOptions ?? { id: record.name }}
            {...sanitizeDeleteButtonProps(rest)}
            mutationOptions={mutationsOptions}
            confirmContent={confirmContent ?? defaultConfirmContent}
        />
    );
};
