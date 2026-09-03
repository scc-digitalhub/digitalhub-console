// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
import {
    CreateBase,
    CreateView,
    TextInput,
    required,
    useNotify,
    useRedirect,
    useResourceContext,
} from 'react-admin';
import { isAlphaNumeric, randomId } from '../../common/utils/helpers';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { CreatePageTitle } from '../../common/components/layout/PageTitle';
import { DataItemIcon } from './icon';
import { getDataItemSpecUiSchema } from './types';
import { MetadataInput } from '../../features/metadata/components/MetadataInput';
import {
    JSXElementConstructor,
    ReactElement,
    useEffect,
    useState,
} from 'react';
import { Step, StepperForm } from '@dslab/ra-stepper';
import { StepperToolbar } from '../../common/components/toolbars/StepperToolbar';
import { CreateToolbar } from '../../common/components/toolbars/CreateToolbar';
import { useStateUpdateCallbacks } from '../../common/hooks/useStateUpdateCallbacks';
import { useGetUploader } from '../../features/files/upload/useGetUploader';
import { Uploader } from '../../features/files/upload/types';
import { useUploaderNameSync } from '../../features/files/upload/useUploaderSync';
import { ExtensionsForm } from '../../features/extensions/Form';
import { useGetExtensions } from '../../features/extensions/utils';
import { useGetSchemas } from '../../common/jsonSchema/schemaController';
import {
    KindChangeGuard,
    KindSelector,
} from '../../common/components/KindSelector';
import { SpecInput } from '../../common/jsonSchema/components/SpecInput';
import { PathInput } from '../../features/files/upload/components/PathInput';
import { useSchemaProvider } from '../../common/provider/schemaProvider';
import { filterProperties } from '../../common/jsonSchema/utils';
import { useWatch } from 'react-hook-form';

export const DataItemCreate = () => {
    const { root } = useRootSelector();
    const [id, setId] = useState(randomId);
    const notify = useNotify();
    const redirect = useRedirect();
    const resource = useResourceContext();
    const { onBeforeUpload, onUploadComplete } = useStateUpdateCallbacks({
        id,
    });
    const uploader = useGetUploader({
        id,
        recordId: id,
        onBeforeUpload,
        onUploadComplete,
    });

    const transform = data => {
        //merge path into spec.path, then strip transient field
        const { path, ...rest } = data;

        return {
            ...rest,
            project: root,
            spec: { ...(rest.spec || {}), ...(path != null ? { path } : {}) },
        };
    };

    const onSuccess = () => {};

    const onSettled = (data, error) => {
        if (error) {
            //onError already handles notify
            return;
        }

        //post save we start uploading
        if (uploader.files.length > 0) {
            uploader.upload(data);
        }

        notify('ra.notification.created', { messageArgs: { smart_count: 1 } });
        setId(randomId());
        redirect('list', resource);
    };

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase
                transform={transform}
                mutationOptions={{ onSuccess, onSettled }}
                record={{ id, spec: {} }}
            >
                <>
                    <CreatePageTitle
                        icon={<DataItemIcon fontSize={'large'} />}
                    />

                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <DataItemForm uploader={uploader} />
                        </FlatCard>
                    </CreateView>
                </>
            </CreateBase>
        </Container>
    );
};

export const DataItemForm = (props: { uploader?: Uploader }) => {
    const { uploader } = props;
    const resource = useResourceContext();

    const { data: kindSchemas } = useGetSchemas(resource || '');
    const { data: extensions } = useGetExtensions();
    const kinds = kindSchemas
        ? kindSchemas.map(s => ({ id: s.kind, name: s.kind }))
        : [];

    //TODO fix stepperform handling for empty (null) children
    //we build steps outside to avoid false/null children to stepperForm
    const steps: ReactElement<any, JSXElementConstructor<Step>>[] = [
        <StepperForm.Step key="base" label={'fields.base'}>
            <DataItemBaseStepContent uploader={uploader} />
        </StepperForm.Step>,
        <StepperForm.Step key="spec" label={'fields.spec.title'}>
            <DataItemSpecStepContent uploader={uploader} kinds={kinds} />
        </StepperForm.Step>,
    ];

    if (extensions && extensions.length > 0) {
        steps.push(
            <StepperForm.Step
                key="extensions"
                label={'fields.extensions.title'}
            >
                <ExtensionsForm source="extensions" />
            </StepperForm.Step>
        );
    }

    return <StepperForm toolbar={<StepperToolbar />}>{steps}</StepperForm>;
};

const DataItemBaseStepContent = ({ uploader }: { uploader?: Uploader }) => {
    useUploaderNameSync({ uploader });
    return (
        <>
            <TextInput
                source="name"
                validate={[required(), isAlphaNumeric()]}
            />
            <MetadataInput kinds={['metadata.base']} />
        </>
    );
};

const DataItemSpecStepContent = ({
    uploader,
    kinds,
}: {
    uploader?: Uploader;
    kinds: { id: string; name: string }[];
}) => {
    const [kind, setKind] = useState<string | undefined>();
    const [isSpecDirty, setIsSpecDirty] = useState(false);
    const [specSchema, setSpecSchema] = useState<any>();
    const path = useWatch({ name: 'path' });
    const schemaProvider = useSchemaProvider();
    const resource = useResourceContext();

    useEffect(() => {
        if (!kind || !resource || !schemaProvider) {
            setSpecSchema(undefined);
            return;
        }

        schemaProvider
            .get(resource, kind)
            .then(schemaResult => {
                const nextSchema = filterProperties(schemaResult?.schema, [
                    'path',
                ]);
                setSpecSchema(nextSchema ?? undefined);
            })
            .catch(() => setSpecSchema(undefined));
    }, [kind, resource, schemaProvider]);

    return (
        <>
            <KindChangeGuard
                isDirty={Boolean(isSpecDirty || !!path)}
                onConfirm={setKind}
            />
            <KindSelector kinds={kinds} />
            <SpecInput
                source="spec"
                schema={specSchema}
                kind={kind}
                onDirty={setIsSpecDirty}
                getUiSchema={getDataItemSpecUiSchema}
            />
            {kind && <PathInput source="path" uploader={uploader} />}
        </>
    );
};
