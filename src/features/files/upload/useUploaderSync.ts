// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { useInput } from 'react-admin';
import { useFieldObserver } from '../../../common/hooks/useFieldObserver';
import { Uploader } from './types';

export type UploaderNameSyncOptions = {
    uploader?: Uploader;
    /** The RHF field name holding the record name. Defaults to 'name'. */
    nameSource?: string;
};

/**
 * Bidirectional name sync:
 * - RHF name field → uploader.setName (via useFieldObserver)
 * - uploader.path → auto-fill name if empty (extracts filename from path URL)
 */
export function useUploaderNameSync({
    uploader,
    nameSource = 'name',
}: UploaderNameSyncOptions): void {
    const { field: nameField } = useInput({ source: nameSource });

    // RHF name → uploader (field observation, useFieldObserver applies)
    useFieldObserver<string>(nameSource, name => {
        if (uploader && name) {
            uploader.setName(name);
        }
    });

    // uploader.path → auto-fill name if empty
    useEffect(() => {
        if (uploader?.path && nameField && !nameField.value) {
            try {
                const fileName = new URL(uploader.path).pathname.replace(
                    /^.*[\\/]/,
                    ''
                );
                nameField.onChange(fileName);
            } catch {
                // path is not a valid URL — skip auto-fill
            }
        }
    }, [uploader?.path]); // eslint-disable-line react-hooks/exhaustive-deps
}


