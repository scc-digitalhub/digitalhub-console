import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
import { useEffect, useRef } from 'react';
import {
    CreateBase,
    CreateView,
    FormDataConsumer,
    ListButton,
    TextInput,
    TopToolbar,
    required,
    useInput,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { isAlphaNumeric, randomId } from '../../common/helper';
import { FlatCard } from '../../components/FlatCard';
import { CreatePageTitle } from '../../components/PageTitle';
import { ArtifactIcon } from './icon';
import { getArtifactSpecUiSchema } from './types';
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
import { StepperToolbar } from '../../components/StepperToolbar';
import { toYaml } from '@dslab/ra-export-record-button';
import { AceEditorField } from '@dslab/ra-ace-editor';

const CreateToolbar = () => {
    return (
        <TopToolbar>
            <ListButton />
        </TopToolbar>
    );
};

export const ArtifactCreate = () => {
    const { root } = useRootSelector();
    const translate = useTranslate();
    const id = useRef(randomId());
    const uploader = useUploadController({
        id: id.current,
    });

    const transform = async data => {
        await uploader.upload();

        //strip path tl which is a transient field
        const { path, ...rest } = data;

        return {
            ...rest,
            id: id.current,
            project: root,
            status: {
                files: uploader.files.map(f => f.info),
            },
        };
    };

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase
                transform={transform}
                redirect="list"
                record={{ id: id.current, spec: { path: null } }}
            >
                <>
                    <CreatePageTitle
                        icon={<ArtifactIcon fontSize={'large'} />}
                    />

                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <ArtifactForm uploader={uploader} />
                        </FlatCard>
                    </CreateView>
                </>
            </CreateBase>
        </Container>
    );
};

export const ArtifactForm = (props: { uploader?: UploadController }) => {
    const { uploader } = props;
    const translate = useTranslate();

    return (
        <StepperForm toolbar={<StepperToolbar />}>
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
            <StepperForm.Step label={'fields.recap'} optional>
                <FormDataConsumer>
                    {({ formData }) => {
                        //read-only view
                        const r = {
                            spec: btoa(toYaml(formData?.spec)),
                        };
                        return (
                            <AceEditorField
                                mode="yaml"
                                source="spec"
                                record={r}
                                parse={atob}
                            />
                        );
                    }}
                </FormDataConsumer>
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
            ? schemas.find(s => s.id === 'ARTIFACT:' + kind)?.schema
            : undefined;
    };

    const getUiSchema = (kind: string | undefined) => {
        if (!kind) {
            return undefined;
        }
        const uiSchema = getArtifactSpecUiSchema(kind) as any;
        if (uiSchema && uploader?.path != null) {
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
