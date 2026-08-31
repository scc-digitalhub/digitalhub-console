// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
import { JSXElementConstructor, ReactElement, useState } from 'react';
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
import { ArtifactIcon } from './icon';
import { getArtifactSpecUiSchema } from './types';
import { MetadataInput } from '../../features/metadata/components/MetadataInput';
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
import { KindSelector } from '../../common/components/KindSelector';
import { KindChangeGuard } from '../../common/components/KindChangeGuard';
import { SpecInput } from '../../common/jsonSchema/components/SpecInput';
import { PathInput } from '../../features/files/upload/components/PathInput';
import { useWatch } from 'react-hook-form';

export const ArtifactCreate = () => {
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

export const ArtifactForm = (props: { uploader?: Uploader }) => {
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
            <ArtifactBaseStepContent uploader={uploader} />
        </StepperForm.Step>,
        <StepperForm.Step key="spec" label={'fields.spec.title'}>
            <ArtifactSpecStepContent uploader={uploader} kinds={kinds} />
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

const ArtifactBaseStepContent = ({ uploader }: { uploader?: Uploader }) => {
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

const ArtifactSpecStepContent = ({
    uploader,
    kinds,
}: {
    uploader?: Uploader;
    kinds: { id: string; name: string }[];
}) => {
    const kind = useWatch({ name: 'kind' });
    return (
        <>
            <KindChangeGuard />
            <KindSelector kinds={kinds} />
            <SpecInput
                source="spec"
                kind={kind}
                getUiSchema={getArtifactSpecUiSchema}
            />
            {kind && (
                <PathInput
                    source="path"
                    uploader={uploader}
                    validate={[required()]}
                />
            )}
        </>
    );
};
