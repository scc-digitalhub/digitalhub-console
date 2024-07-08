import { JsonSchemaInput } from '../../components/JsonSchema';
import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useEffect, useRef, useState } from 'react';
import {
    CreateActionsProps,
    CreateBase,
    CreateView,
    FormDataConsumer,
    ListButton,
    LoadingIndicator,
    SelectInput,
    SimpleForm,
    TextInput,
    TopToolbar,
    required,
    useInput,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { isAlphaNumeric, isValidKind } from '../../common/helper';
import {
    BlankSchema,
} from '../../common/schemas';
import { FlatCard } from '../../components/FlatCard';
import { FormLabel } from '../../components/FormLabel';
import { CreatePageTitle } from '../../components/PageTitle';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { ModelIcon } from './icon';
import { getModelSpecUiSchema } from './types';
import { MetadataInput } from '../../components/MetadataInput';
import { useUploadController } from '../../controllers/uploadController';
import { FileInput } from '../../components/FileInput';
import {  useForm } from 'react-hook-form';

const CreateToolbar = (props: CreateActionsProps) => {
    return (
        <TopToolbar>
            <ListButton />
        </TopToolbar>
    );
};

export const ModelCreate = () => {
    const { root } = useRootSelector();
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();
    const [schemas, setSchemas] = useState<any[]>();
    const id = useRef(crypto.randomUUID());
    const { uppy, files, upload } = useUploadController({ id: id.current });

    const transform = async data => {
        await upload();

        return {
            ...data,
            id: id.current,
            status: {
                files: files.map(f => f.info),
            },
            project: root || '',
        };
    };

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.list('models').then(res => {
                if (res) {
                    setSchemas(res);

                    const values = res.map(s => ({
                        id: s.kind,
                        name: s.kind,
                    }));

                    setKinds(values);
                }
            });
        }
    }, [schemaProvider]);

    if (!kinds) {
        return <LoadingIndicator />;
    }

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase transform={transform} redirect="list">
                <>
                    <CreatePageTitle icon={<ModelIcon fontSize={'large'} />} />

                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm>
                                <FormContent
                                    schemas={schemas}
                                    kinds={kinds}
                                    uppy={uppy}
                                    files={files}
                                />
                            </SimpleForm>
                        </FlatCard>
                    </CreateView>
                </>
            </CreateBase>
        </Container>
    );
};

const FormContent = (props: any) => {
    const { schemas, uppy, kinds, files } = props;
    const translate = useTranslate();
    const resource = useResourceContext();
    const { field } = useInput({ resource, source: 'spec' });
    const updateForm = path => {
        if (field) {
            field.onChange({ ...field.value, path: path });
        }
    };
    const path = files.length > 0 ? files[0].path : null;
    useEffect(() => {
        updateForm(path);
    }, [path]);

    const getModelSpecSchema = (kind: string | undefined) => {
        if (!kind) {
            return BlankSchema;
        }

        if (schemas) {
            return schemas.find(s => s.id === 'MODEL:' + kind)?.schema;
        }

        return BlankSchema;
    };

    const getModelUiSchema = (kind: string | undefined) => {
        if (!kind) {
            return undefined;
        }

        if (uppy.getFiles().length > 0) {
            return { path: { 'ui:readonly': true } };
        } else {
            return getModelSpecUiSchema(kind);
        }
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
                {({ formData }) => {
                    if (formData.kind)
                        return (
                            <>
                                <JsonSchemaInput
                                    source="spec"
                                    schema={{
                                        ...getModelSpecSchema(formData.kind),
                                        title: 'Spec',
                                    }}
                                    uiSchema={getModelUiSchema(formData.kind)}
                                />
                                {uppy && (
                                    <FileInput
                                        uppy={uppy}
                                    />
                                )}
                            </>
                        );
                    else
                        return (
                            <Card
                                sx={{
                                    width: 1,
                                    textAlign: 'center',
                                }}
                            >
                                <CardContent>
                                    {translate('resources.common.emptySpec')}{' '}
                                </CardContent>
                            </Card>
                        );
                }}
            </FormDataConsumer>
        </>
    );
};
const KindSelector = (props: { kinds: any[] }) => {
    const { kinds } = props;
    const resource = useResourceContext();
    const { formState } = useForm();
    const { field } = useInput({ resource, source: 'spec' });

    const reset = () => {
        console.log('form is dirty', formState.isDirty);
        field.onChange({});
    };
    return (
        <SelectInput
            source="kind"
            choices={kinds}
            validate={[required(), isValidKind(kinds)]}
            onChange={() => reset()}
        />
        
    );
};