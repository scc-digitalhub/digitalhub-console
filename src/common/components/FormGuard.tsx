// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRef, useState } from 'react';
import { Confirm, useTranslate } from 'react-admin';
import { useFieldObserver } from '../hooks/useFieldObserver';
import { useFormContext, useFormState } from 'react-hook-form';

const hasDirtyValue = (value: unknown): boolean => {
    if (value === true) {
        return true;
    }
    if (!value || typeof value !== 'object') {
        return false;
    }

    return Object.values(value as Record<string, unknown>).some(hasDirtyValue);
};

const defaultIsDirty = (
    dirtyFields: Record<string, any>,
    watchedField: string
): boolean => {
    return Object.keys(dirtyFields || {}).some(
        key => key !== watchedField && hasDirtyValue(dirtyFields[key])
    );
};

export const FormGuard = ({
    field,
    isDirty,
    onConfirm,
}: {
    field: string;
    isDirty?: boolean;
    onConfirm?: (value: any) => void;
}) => {
    const { dirtyFields } = useFormState();
    const { setValue, getValues } = useFormContext();
    const prevValue = useRef<any>(undefined);
    const pendingValue = useRef<any>(undefined);
    const [open, setOpen] = useState(false);
    const translate = useTranslate();

    useFieldObserver(field, nextValue => {
        if (prevValue.current === undefined) {
            prevValue.current = nextValue;
            onConfirm?.(nextValue);
            return;
        }

        if (Object.is(prevValue.current, nextValue)) {
            return;
        }

        const shouldWarn =
            isDirty ?? defaultIsDirty(dirtyFields as Record<string, any>, field);

        if (shouldWarn) {
            pendingValue.current = nextValue;
            setValue(field, prevValue.current, { shouldDirty: false });
            setOpen(true);
            return;
        }

        prevValue.current = nextValue;
        onConfirm?.(nextValue);
    });

    const handleConfirm = () => {
        const currentValue = pendingValue.current ?? getValues(field);
        setValue(field, currentValue, { shouldDirty: false });
        prevValue.current = currentValue;
        pendingValue.current = undefined;
        onConfirm?.(currentValue);
        setOpen(false);
    };

    const handleClose = () => {
        pendingValue.current = undefined;
        setValue(field, prevValue.current, { shouldDirty: false });
        setOpen(false);
    };

    return (
        <Confirm
            isOpen={open}
            title={translate('resources.common.reset.title')}
            content={translate('resources.common.reset.content')}
            onConfirm={handleConfirm}
            onClose={handleClose}
        />
    );
};


