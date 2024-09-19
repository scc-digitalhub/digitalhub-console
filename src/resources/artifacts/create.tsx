import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container, Stack } from '@mui/material';
import { useEffect, useRef } from 'react';
import {
    CreateBase,
    CreateView,
    FormDataConsumer,
    ListButton,
    SimpleForm,
    TextInput,
    TopToolbar,
    required,
    regex,
    useInput,
    useResourceContext,
} from 'react-admin';
import {
    ALPHANUMERIC_REGEX,
    isAlphaNumeric,
    randomId,
} from '../../common/helper';
import { FlatCard } from '../../components/FlatCard';
import { FormLabel } from '../../components/FormLabel';
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

const CreateToolbar = () => {
    return (
        <TopToolbar>
            <ListButton />
        </TopToolbar>
    );
};

export const ArtifactCreate = () => {
    const { root } = useRootSelector();
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
                record={{ id: id.current }}
            >
                <>
                    <CreatePageTitle
                        icon={<ArtifactIcon fontSize={'large'} />}
                    />

                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm>
                                <ArtifactCreateForm uploader={uploader} />
                            </SimpleForm>
                        </FlatCard>
                    </CreateView>
                </>
            </CreateBase>
        </Container>
    );
};

const ArtifactCreateForm = (props: { uploader?: UploadController }) => {
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
            <FormLabel label="fields.base" />
            <Stack direction={'row'} spacing={3} pt={4}>
                <TextInput
                    source="name"
                    validate={[required(), isAlphaNumeric()]}
                />
                <KindSelector kinds={kinds} />
            </Stack>
            <MetadataInput />
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
