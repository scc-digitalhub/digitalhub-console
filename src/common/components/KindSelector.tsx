// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { SelectInput, required, useRecordContext } from 'react-admin';
import { isValidKind } from '../utils/helpers';
import { useFormContext } from 'react-hook-form';
import { FormGuard } from './FormGuard';

export const KindSelector = (props: {
    kinds?: any[] | undefined;
    readOnly?: boolean;
}) => {
    const { kinds = [], readOnly = false } = props;

    return (
        <SelectInput
            readOnly={readOnly}
            source="kind"
            choices={kinds}
            validate={[required(), isValidKind(kinds)]}
        />
    );
};

/**
 * Thin wrapper for the common kind+spec reset workflow.
 * The form owns the field synchronization; this guard only decides whether to ask.
 */

export const KindChangeGuard = ({
    isDirty,
    onConfirm,
}: {
    isDirty?: boolean;
    onConfirm?: (nextKind: any) => void;
} = {}) => {
    const { setValue } = useFormContext();
    const record = useRecordContext();

    return (
        <FormGuard
            field="kind"
            isDirty={isDirty}
            onConfirm={nextKind => {
                setValue('spec', record?.spec || {});
                onConfirm?.(nextKind);
            }}
        />
    );
};
