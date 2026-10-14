// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
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
import { nameFromFileSelection } from '../../../features/files/upload/utils';
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

export const DataItemSpecStep = ({
    kinds,
    onKindChange,
}: {
    kinds: { id: string; name: string }[];
    onKindChange?: (kind: string | undefined) => void;
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
            <KindSelector kinds={kinds} />
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
    const { setValue } = useFormContext();
    const uploader = useUploadCoordinator();
    const pathResolver = useResolveUploadPath({ id: uploader?.id, name });

    const handleFilesChange = (selection: FileSelection) => {
        const selectedName = nameFromFileSelection(selection);
        if (selectedName && !name) {
            setValue('name', selectedName, {
                shouldDirty: true,
                shouldValidate: true,
            });
        }
    };

    return (
        <PathInput
            source="path"
            pathResolver={pathResolver}
            onChange={handleFilesChange}
            validate={[required()]}
            readOnly={readOnly === true ? true : undefined}
        />
    );
};
