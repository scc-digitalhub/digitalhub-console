// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
    CommonInputProps,
    TextInput,
    useNotify,
    useResourceContext,
    useSourceContext,
} from 'react-admin';
import { useFormContext } from 'react-hook-form';
import { useUploadCoordinator } from '../UploaderContext';
import {
    FileSelection,
    PathResolver,
    UploadSlot,
    UploadTargetContext,
} from '../types';
import { FileInput } from './FileInput';

export type PathInputProps = Omit<
    CommonInputProps,
    'defaultValue' | 'onChange'
> & {
    defaultValue?: string | null;
    //computes the path for the selected files; without it the path is not set
    pathResolver?: PathResolver;
    uploadTarget?: UploadTargetContext;
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
    uploadTarget,
    onChange,
    defaultValue,
    ...rest
}: PathInputProps) => {
    const coordinator = useUploadCoordinator();
    const registerSlot = coordinator?.registerSlot;
    const notify = useNotify();
    const resource = useResourceContext();
    const resolutionContext = pathResolver?.context;
    const resolverTarget = pathResolver?.target;
    const sourceContext = useSourceContext();
    const scopedSource = sourceContext.getSource(source);
    const slotId = useId();
    const { setValue, resetField } = useFormContext();
    const [selection, setSelection] = useState<FileSelection>(null);
    const uppyRef = useRef<UploadSlot['uppy']>();
    const hasFiles = selection != null;
    const filename =
        selection?.files.length === 1
            ? selection.files[0].relativePath
            : undefined;

    //callers need not memoize the callback
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const handleFilesChange = useCallback(
        (next: FileSelection, uppy: UploadSlot['uppy']) => {
            uppyRef.current = uppy;
            setSelection(next);
            if (!next) resetField(scopedSource);
            onChangeRef.current?.(next);
        },
        [resetField, scopedSource]
    );

    useEffect(() => {
        const uppy = uppyRef.current;
        if (!registerSlot || !uppy) return;
        registerSlot({
            id: slotId,
            uppy,
            resolutionContext,
            target: uploadTarget ?? resolverTarget ?? { resource },
        });
    }, [
        registerSlot,
        slotId,
        selection,
        resolutionContext,
        uploadTarget,
        resolverTarget,
        resource,
    ]);

    useEffect(() => {
        if (!hasFiles || !pathResolver) return;

        let active = true;
        pathResolver.resolve({ filename })
            .then(path => {
                if (active) {
                    setValue(scopedSource, path, {
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
    }, [hasFiles, filename, pathResolver, scopedSource, setValue, notify]);

    return (
        <>
            <TextInput
                source={source}
                defaultValue={defaultValue}
                readOnly={hasFiles}
                fullWidth
                {...rest}
            />
            {coordinator && <FileInput onChange={handleFilesChange} />}
        </>
    );
};
