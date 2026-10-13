// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useRef, useState } from 'react';
import { CommonInputProps, TextInput, useNotify } from 'react-admin';
import { useFormContext } from 'react-hook-form';
import { useUploader } from '../UploaderContext';
import { FileSelection, PathResolver } from '../types';
import { FileInput } from './FileInput';

export type PathInputProps = Omit<
    CommonInputProps,
    'defaultValue' | 'onChange'
> & {
    //computes the path for the selected files; without it the path is not set
    pathResolver?: PathResolver;
    onChange?: (selection: FileSelection) => void;
};

/**
 * Owner of the transient top-level `path` field.
 *
 * Renders a TextInput for manual URI entry, plus a FileInput when an uploader
 * is in context. When files are selected the path is computed by `pathResolver`
 * and the TextInput is locked; when the selection is cleared the field is reset
 * to its default value.
 *
 * The form's transform function is responsible for merging `path` back into
 * `spec.path` on submit. SpecInput filters `path` from the JSON schema so the
 * two never conflict inside the form.
 */
export const PathInput = ({
    source,
    pathResolver,
    onChange,
    ...rest
}: PathInputProps) => {
    const uploader = useUploader();
    const notify = useNotify();
    const { setValue, resetField } = useFormContext();
    const [selection, setSelection] = useState<FileSelection>(null);
    const hasFiles = selection != null;
    const filename = selection?.filename;

    //callers need not memoize the callback
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const handleFilesChange = useCallback(
        (next: FileSelection) => {
            setSelection(next);
            if (!next) resetField(source);
            onChangeRef.current?.(next);
        },
        [resetField, source]
    );

    useEffect(() => {
        if (!hasFiles || !pathResolver) return;

        let active = true;
        pathResolver({ filename })
            .then(path => {
                if (active) {
                    setValue(source, path, {
                        shouldDirty: true,
                        shouldValidate: true,
                    });
                }
            })
            .catch(error => {
                console.error(error);
                if (active) {
                    notify('messages.upload.path_resolution_error', {
                        type: 'error',
                    });
                }
            });

        return () => {
            active = false;
        };
    }, [hasFiles, filename, pathResolver, source, setValue, notify]);

    return (
        <>
            <TextInput
                source={source}
                readOnly={hasFiles}
                fullWidth
                {...rest}
            />
            {uploader && <FileInput onChange={handleFilesChange} />}
        </>
    );
};
