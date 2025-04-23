import { useEffect } from 'react';
import { FormDataConsumer, useInput, useResourceContext } from 'react-admin';
import { FileInput } from '../../components/FileInput';
import { UploadController } from '../../controllers/uploadController';
import { KindSelector } from '../../components/KindSelector';
import { useGetSchemas } from '../../controllers/schemaController';
import { SpecInput } from '../../components/SpecInput';
import { SchemaIdPrefixes } from '../../common/schemas';

export type CreateSpecWithUploadProps = {
    uploader?: UploadController;
    getSpecUiSchema: (kind: string | undefined) => any;
};

export const CreateSpecWithUpload = (props: CreateSpecWithUploadProps) => {
    const { uploader, getSpecUiSchema } = props;
    const resource = useResourceContext();

    const { data: schemas } = useGetSchemas(resource);
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

    const getSpecSchema = (kind: string | undefined) => {
        return schemas
            ? schemas.find(s => s.id === SchemaIdPrefixes[resource] + kind)
                  ?.schema
            : undefined;
    };

    const getUiSchema = (kind: string | undefined) => {
        if (!kind) {
            return undefined;
        }
        let uiSchema = getSpecUiSchema(kind) as any;
        if (!uiSchema)
            uiSchema = {};

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

                        {formData.kind && uploader && (
                            <FileInput uploader={uploader} source="path" />
                        )}
                    </>
                )}
            </FormDataConsumer>
        </>
    );
};
