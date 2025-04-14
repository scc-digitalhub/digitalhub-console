import { useEffect, useRef } from 'react';
import {
    FormDataConsumer,
    TextInput,
    required,
    useInput,
    useRecordContext,
    useResourceContext,
} from 'react-admin';
import { isAlphaNumeric, randomId } from '../../common/helper';
import { getReportSpecUiSchema } from './types';
import { MetadataInput } from '../../components/MetadataInput';
import { FileInput } from '../../components/FileInput';
import {
    UploadController,
    useUploadController,
} from '../../controllers/uploadController';
import { KindSelector } from '../../components/KindSelector';
import { useGetSchemas } from '../../controllers/schemaController';
import { SpecInput } from '../../components/SpecInput';
import { StepperForm } from '@dslab/ra-stepper';
import { StepperToolbar } from '../../components/toolbars/StepperToolbar';

export const ReportCreate = () => {
    const id = useRef(randomId());
    const uploader = useUploadController({
        id: id.current,
    });

    const record = useRecordContext();

    return (
        <StepperForm toolbar={<StepperToolbar />}
            record={{ id: id.current, project: record.project, spec: { path: null, entity: record.spec.entity, entity_type: record.spec.entity_type } }}>
            <StepperForm.Step label={'fields.base'}>
                <TextInput
                    source="name"
                    validate={[required(), isAlphaNumeric()]}
                />
                <MetadataInput />
            </StepperForm.Step>
            <StepperForm.Step label={'fields.spec.title'}>
                <SpecCreateStep uploader={uploader} />
            </StepperForm.Step>
        </StepperForm>
    );

};

const SpecCreateStep = (props: { uploader?: UploadController }) => {
    const { uploader } = props;
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
    useEffect(() => {
        if (uploader && field) {
            field.onChange({ ...field.value, path: uploader.path });
        }

    }, [uploader?.path]);

    console.log('spec field', field);

    const getSpecSchema = (kind: string | undefined) => {
        let s = schemas
            ? schemas.find(s => s.id === 'REPORT:' + kind)?.schema
            : undefined;
        return s;
    };

    const getUiSchema = (kind: string | undefined) => {
        if (!kind) {
            return undefined;
        }
        const uiSchema = getReportSpecUiSchema(kind) as any;
        if (uiSchema && uploader?.path != null) {
            uiSchema['path'] = { 'ui:readonly': true };
        }
        return uiSchema;
    };

    return (
        <>
            <KindSelector kinds={kinds} />
            <FormDataConsumer<{ kind: string }> >
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
