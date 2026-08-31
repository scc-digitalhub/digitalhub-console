// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef, useState } from 'react';
import { Confirm, useRecordContext, useTranslate } from 'react-admin';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';

/**
 * Form-level coordinator that watches the 'kind' field and, when spec is dirty,
 * prompts the user to confirm before accepting the new kind.
 *
 * On confirm: resets spec to the record's original value.
 * On cancel: reverts kind to the previously accepted value.
 *
 * Invariant: prevKind.current always holds the last *accepted* kind value.
 * The guard `if (kind === prevKind.current) return` makes the effect idempotent —
 * the revert setValue echo re-enters the effect but exits immediately.
 */
export const KindChangeGuard = () => {
    const kind = useWatch({ name: 'kind' });
    const { dirtyFields } = useFormState();
    const { setValue } = useFormContext();
    const record = useRecordContext();
    const translate = useTranslate();

    const prevKind = useRef<string | undefined>(kind);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Guard: revert echo or initial render with same value — skip entirely
        if (kind === prevKind.current) return;

        if (dirtyFields.spec) {
            setOpen(true);
            // Do NOT update prevKind.current yet — wait for user decision
        } else {
            prevKind.current = kind;
        }
    }, [kind]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleConfirm = () => {
        prevKind.current = kind;
        setValue('spec', record?.spec || {});
        setOpen(false);
    };

    const handleClose = () => {
        // Revert kind — triggers useWatch again, but guard catches it (kind === prevKind.current)
        setValue('kind', prevKind.current, { shouldDirty: false });
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
