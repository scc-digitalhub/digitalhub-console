// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    JSXElementConstructor,
    ReactElement,
    useEffect,
    useState,
} from 'react';
import { TextInput, required, useResourceContext } from 'react-admin';
import { isValidName } from '../../../common/utils/helpers';
import { MetadataInput } from '../../../features/metadata/components/MetadataInput';
import { Step, StepperForm } from '@dslab/ra-stepper';
import { StepperToolbar } from '../../../common/components/toolbars/StepperToolbar';
import { useGetExtensions } from '../../../features/extensions/utils';
import { ExtensionsForm } from '../../../features/extensions/components/Form';
import { useGetSchemas } from '../../../common/jsonSchema/schemaController';
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
import { basename } from '../../../features/files/upload/utils';
import { useUploadCoordinator } from '../../../features/files/upload/UploaderContext';
import { useResolveUploadPath } from '../../../features/files/upload/useResolveUploadPath';
import { useExtensionsSteps } from '../../../features/extensions/steps';

export const ModelForm = (props: { onCancel?: () => void }) => {
    const { onCancel } = props;
    const resource = useResourceContext();

    const { data: kindSchemas } = useGetSchemas(resource || '');
    const { data: extensions } = useGetExtensions();
    const contributions = useExtensionsSteps();

    const kinds = kindSchemas
        ? kindSchemas.map(s => ({ id: s.kind, name: s.kind }))
        : [];

    //TODO fix stepperform handling for empty (null) children
    //we build steps outside to avoid false/null children to stepperForm
    const steps: ReactElement<any, JSXElementConstructor<Step>>[] = [
        <StepperForm.Step key="base" label={'fields.base'}>
            <ModelBaseStepContent />
        </StepperForm.Step>,
        <StepperForm.Step key="spec" label={'fields.spec.title'}>
            <ModelSpecStepContent kinds={kinds} />
        </StepperForm.Step>,
    ];

    if (contributions && contributions.length > 0) {
        steps.push(...contributions);
    }

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

    return (
        <StepperForm toolbar={<StepperToolbar onCancel={onCancel} />}>
            {steps}
        </StepperForm>
    );
};

const ModelBaseStepContent = () => {
    return (
        <>
            <TextInput source="name" validate={[required(), isValidName()]} />
            <MetadataInput kinds={['metadata.base']} />
        </>
    );
};

const ModelSpecStepContent = ({
    kinds,
}: {
    kinds: { id: string; name: string }[];
}) => {
    const [kind, setKind] = useState<string | undefined>();
    const [isSpecDirty, setIsSpecDirty] = useState(false);
    const [schema, setSchema] = useState<any>();
    const path = useWatch({ name: 'path' });
    const name = useWatch({ name: 'name' });
    const { setValue } = useFormContext();
    const uploader = useUploadCoordinator();
    const pathResolver = useResolveUploadPath({ id: uploader?.id, name });
    const schemaProvider = useSchemaProvider();
    const resource = useResourceContext();

    //a single file names the entity, unless already named
    const handleFilesChange = (selection: FileSelection) => {
        if (selection?.files.length === 1 && !name) {
            setValue('name', basename(selection.files[0].filename), {
                shouldDirty: true,
                shouldValidate: true,
            });
        }
    };

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
                onConfirm={setKind}
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
            {kind && (
                <PathInput
                    source="path"
                    pathResolver={pathResolver}
                    onChange={handleFilesChange}
                />
            )}
        </>
    );
};
