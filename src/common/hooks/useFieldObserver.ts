// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';
import { useWatch } from 'react-hook-form';

/**
 * Watches a single RHF field and runs a side-effect lambda whenever the value changes.
 * The form is the coordinator — place this at the form level, not inside field components.
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
    effectRef.current = effect;

    useEffect(() => {
        effectRef.current(value as T);
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
}
