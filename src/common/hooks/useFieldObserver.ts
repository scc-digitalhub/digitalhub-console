// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';
import { useWatch } from 'react-hook-form';

/**
 * Watches a single RHF field and runs a side-effect lambda whenever the value changes.
 * The form is the coordinator — place this at the form level, not inside field components.
 *
 * This hook is for coordinating form-level reactions to a field change.
 * It is not for local dirty detection or comparing a value against its previous/initial state.
 * That comparison belongs to the component that owns the field value.
 *
 * @param source - RHF field name to watch
 * @param effect - callback invoked with the new value on every change
 */
export function useFieldObserver<T>(
    source: string,
    effect: (value: T) => void
): void {
    const value = useWatch({ name: source });
    const effectRef = useRef(effect);
    const previousValueRef = useRef<T | undefined>(undefined);
    effectRef.current = effect;

    useEffect(() => {
        const previousValue = previousValueRef.current;
        const hasChanged =
            previousValue === undefined || !Object.is(previousValue, value as T);

        previousValueRef.current = value as T;

        if (hasChanged) {
            effectRef.current(value as T);
        }
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
}
