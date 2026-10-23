// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';
import { TextInput, required, useResourceContext } from 'react-admin';
import { isValidName } from '../../../common/utils/helpers';
import { MetadataInput } from '../../../features/metadata/components/MetadataInput';
import {
    KindChangeGuard,
    KindSelector,
} from '../../../common/components/KindSelector';
import { SpecInput } from '../../../common/jsonSchema/components/SpecInput';
import { PathInput } from '../../../features/files/upload/components/PathInput';
import { useSchemaProvider } from '../../../common/provider/schemaProvider';
import { filterProperties } from '../../../common/jsonSchema/utils';
import { useFormContext, useWatch } from 'react-hook-form';
import { FileSelection } from '../../../features/files/upload/types';
import {
    createPathValidator,
    nameFromFileSelection,
} from '../../../features/files/upload/utils';
import { useUploadCoordinator } from '../../../features/files/upload/UploaderContext';
import { useResolveUploadPath } from '../../../features/files/upload/useResolveUploadPath';

export const BaseStep = () => {
    return (
        <>
            <TextInput source="name" validate={[required(), isValidName()]} />
            <MetadataInput kinds={['metadata.base']} />
        </>
    );
};

export const ModelSpecStep = ({
    kinds,
    onKindChange,
    readOnlyKind,
}: {
    kinds: { id: string; name: string }[];
    onKindChange?: (kind: string | undefined) => void;
    readOnlyKind?: boolean;
}) => {
    const [kind, setKind] = useState<string | undefined>();
    const [isSpecDirty, setIsSpecDirty] = useState(false);
    const [schema, setSchema] = useState<any>();
    const path = useWatch({ name: 'path' });
    const schemaProvider = useSchemaProvider();
    const resource = useResourceContext();

    useEffect(() => {
        if (!kind || !resource || !schemaProvider) {
            setSchema(undefined);
            return;
        }

        schemaProvider
            .get(resource, kind)
            .then(schemaResult => {
                const nextSchema = filterProperties(schemaResult?.schema, [
                    'path',
                ]);
                setSchema({ ...schemaResult, schema: nextSchema ?? undefined });
            })
            .catch(() => setSchema(undefined));
    }, [kind, resource, schemaProvider]);

    return (
        <>
            <KindChangeGuard
                isDirty={Boolean(isSpecDirty || !!path)}
                onConfirm={nextKind => {
                    setKind(nextKind);
                    onKindChange?.(nextKind);
                }}
            />
            <KindSelector kinds={kinds} readOnly={readOnlyKind} />
            {schema && (
                <SpecInput
                    source="spec"
                    schema={schema?.schema}
                    uiSchema={schema?.uiSchema}
                    kind={kind}
                    onDirty={setIsSpecDirty}
                />
            )}
        </>
    );
};

export const UploadStep = ({ readOnly }: { readOnly?: boolean }) => {
    const name = useWatch({ name: 'name' });
    const kind = useWatch({ name: 'kind' });
    const { setValue } = useFormContext();
    const uploader = useUploadCoordinator();
    const pathResolver = useResolveUploadPath({ id: uploader?.id, name });
    const schemaProvider = useSchemaProvider();
    const resource = useResourceContext();
    const [schema, setSchema] = useState<
        { kind: string; schema: any } | undefined
    >();

    useEffect(() => {
        if (!kind || !resource || !schemaProvider || readOnly) {
            setSchema(undefined);
            return;
        }

        let active = true;
        schemaProvider
            .get(resource, kind)
            .then(schemaResult => {
                if (active) {
                    setSchema({
                        kind: kind,
                        schema: schemaResult?.schema?.properties?.path,
                    });
                }
            })
            .catch(() => {
                if (active) setSchema(undefined);
            });

        return () => {
            active = false;
        };
    }, [kind, resource, schemaProvider, readOnly]);

    const pathValidator = useMemo(
        () =>
            !readOnly && schema?.schema
                ? createPathValidator(schema?.schema)
                : undefined,
        [schema, readOnly]
    );

    const handleFilesChange = (selection: FileSelection) => {
        const selectedName = nameFromFileSelection(selection);
        if (selectedName && !name) {
            setValue('name', selectedName, {
                shouldDirty: true,
                shouldValidate: true,
            });
        }
    };

    if (!schema?.schema && !readOnly) return null;

    return (
        <PathInput
            source="path"
            pathResolver={pathResolver}
            onChange={handleFilesChange}
            validate={[required(), ...(pathValidator ? [pathValidator] : [])]}
            readOnly={readOnly === true ? true : undefined}
        />
    );
};
