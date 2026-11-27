// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useState } from 'react';
import { useRecordContext } from 'react-admin';
import { useWatch } from 'react-hook-form';
import { SpecInput } from '../../common/jsonSchema/components/SpecInput';
import { StorePathInput } from '../../common/components/storePathInput/StorePathInput';
import { useFunctionSpecSchema } from './useFunctionSpecSchema';
import { functionPathFilters } from './pathFilters';

/**
 * Spec fields of a function, shared by create and edit forms.
 *
 * The spec is rendered by SpecInput from the kind's JSON schema, except for
 * `spec.path`: when the schema declares it, it is rendered by StorePathInput
 * as a separate top-level form field (`path`), and moved back into
 * `spec.path` by `movePathIntoSpec` (see utils) before saving.
 *
 * `onDirty` reports whether spec or path differ from the current record.
 */
export const FunctionSpecFields = ({
    kind,
    onDirty,
}: {
    kind?: string;
    onDirty: (dirty: boolean) => void;
}) => {
    const record = useRecordContext();
    const { schema, uiSchema, pathSchema, pathValidators } =
        useFunctionSpecSchema(kind);
    const path = useWatch({ name: 'path' });
    const [specDirty, setSpecDirty] = useState(false);
    // The `path` field is not part of the record (it lives in record.spec.path),
    // so compare against that; an unset field means "unchanged".
    const pathDirty =
        Boolean(pathSchema) &&
        (path ?? record?.spec?.path ?? null) !== (record?.spec?.path ?? null);

    useEffect(() => {
        onDirty(specDirty || pathDirty);
    }, [specDirty, pathDirty, onDirty]);

    return (
        <>
            {schema && (
                <SpecInput
                    key={`spec-${kind}`}
                    source="spec"
                    kind={kind}
                    schema={schema}
                    uiSchema={uiSchema}
                    onDirty={setSpecDirty}
                />
            )}
            {pathSchema && (
                <StorePathInput
                    key={`path-${kind}`}
                    source="path"
                    label={pathSchema.title ?? 'fields.path.title'}
                    helperText={pathSchema.description}
                    defaultValue={record?.spec?.path}
                    filters={kind ? functionPathFilters[kind] : undefined}
                    validate={pathValidators}
                />
            )}
        </>
    );
};
