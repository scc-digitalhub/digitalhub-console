// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { SelectInput, required, useRecordContext } from 'react-admin';
import { useRef } from 'react';
import { isValidKind } from '../utils/helpers';
import { useFormContext } from 'react-hook-form';
import { FormGuard } from './FormGuard';
import { get } from 'lodash';

export const KindSelector = (props: {
    kinds?: any[] | undefined;
    readOnly?: boolean;
    source?: string;
    defaultValue?: string;
}) => {
    const {
        kinds = [],
        readOnly = false,
        source = 'kind',
        defaultValue,
    } = props;

    if (!kinds || kinds.length === 0) {
        return <></>;
    }

    return (
        <SelectInput
            readOnly={readOnly}
            source={source}
            choices={kinds}
            defaultValue={defaultValue}
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
    source = 'kind',
    field = 'spec',
}: {
    isDirty?: boolean;
    onConfirm?: (nextKind: any) => void;
    source?: string;
    field?: string;
} = {}) => {
    const { setValue } = useFormContext();
    const record = useRecordContext();
    const hasMounted = useRef(false);

    return (
        <FormGuard
            field={source}
            isDirty={isDirty}
            onConfirm={nextKind => {
                if (hasMounted.current) {
                    setValue(field, get(record, field) || {});
                }
                hasMounted.current = true;
                onConfirm?.(nextKind);
            }}
        />
    );
};
