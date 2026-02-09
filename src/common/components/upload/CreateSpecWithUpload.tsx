// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { FormDataConsumer, useInput, useResourceContext } from 'react-admin';
import { KindSelector } from '../KindSelector';
import { useGetSchemas } from '../../../common/jsonSchema/schemaController';
import { SpecInput } from '../../../common/jsonSchema/components/SpecInput';
import { SchemaIdPrefixes } from '../../../common/jsonSchema/schemas';
import { Uploader } from '../../../features/files/upload/types';
import { FileInput } from '../../../features/files/upload/components/FileInput';

export type CreateSpecWithUploadProps = {
    uploader?: Uploader;
    getSpecUiSchema: (kind: string | undefined) => any;
    showFileInput?: boolean;
};

export const CreateSpecWithUpload = (props: CreateSpecWithUploadProps) => {
    const { uploader, getSpecUiSchema, showFileInput = true } = props;
    const resource = useResourceContext();

    const { data: schemas } = useGetSchemas(resource || '');
    const kinds = schemas
        ? schemas.map(s => ({
              id: s.kind,
              name: s.kind,
          }))
        : [];

    //update path in spec depending on upload
    //we need to watch it here because path is nested in spec
    //also set name if empty
    const { field } = useInput({ resource, source: 'spec' });
    const { field: nameField } = useInput({ resource, source: 'name' });
    useEffect(() => {
        if (uploader && field) {
            field.onChange({ ...field.value, path: uploader.path });
        }

        if (uploader?.path && nameField && !nameField.value) {
            //set name as fileName from path
            const fileName = new URL(uploader.path).pathname.replace(
                /^.*[\\\/]/,
                ''
            );
            nameField.onChange(fileName);
        }
    }, [uploader?.path]);

    //update name in controller
    useEffect(() => {
        if (uploader && nameField.value) {
            uploader.setName(nameField.value);
        }
    }, [uploader, nameField?.value]);

    const getSpecSchema = (kind: string | undefined) => {
        return schemas
            ? schemas.find(
                  s => resource && s.id === SchemaIdPrefixes[resource] + kind
              )?.schema
            : undefined;
    };

    const getUiSchema = (kind: string | undefined) => {
        if (!kind) {
            return undefined;
        }
        let uiSchema = getSpecUiSchema(kind) as any;
        if (!uiSchema) uiSchema = {};

        if (uploader?.path != null) {
            uiSchema['path'] = { 'ui:readonly': true };
        }

        return uiSchema;
    };

    return (
        <>
            <KindSelector kinds={kinds} />
            <FormDataConsumer<{ kind: string }>>
                {({ formData }) => (
                    <>
                        <SpecInput
                            source="spec"
                            kind={formData.kind}
                            schema={getSpecSchema(formData.kind)}
                            getUiSchema={getUiSchema}
                        />

                        {formData.kind && uploader && showFileInput && (
                            <FileInput uploader={uploader} source="path" />
                        )}
                    </>
                )}
            </FormDataConsumer>
        </>
    );
};
