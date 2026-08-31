// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { CommonInputProps, TextInput } from 'react-admin';
import { Uploader } from '../types';
import { FileInput } from './FileInput';

export type PathInputProps = Omit<CommonInputProps, 'defaultValue'> & {
    uploader?: Uploader;
};

/**
 * Manages the transient top-level `path` field.
 *
 * Renders a TextInput for manual URI entry (readOnly when the uploader has set
 * a path), plus a FileInput when an uploader is provided (which handles the
 * uploader.path → field sync internally).
 *
 * The form's transform function is responsible for merging `path` back into
 * `spec.path` on submit. SpecInput filters `path` from the JSON schema so the
 * two never conflict inside the form.
 */
export const PathInput = ({ source, uploader, ...rest }: PathInputProps) => {
    const isLocked = uploader?.path != null;

    return (
        <>
            <TextInput
                source={source}
                readOnly={isLocked}
                fullWidth
                {...rest}
            />
            {uploader && <FileInput uploader={uploader} source={source} />}
        </>
    );
};
