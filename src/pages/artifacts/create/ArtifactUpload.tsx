// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { JSXElementConstructor, ReactElement, useState } from 'react';
import { Step, StepperForm } from '@dslab/ra-stepper';
import { useRootSelector } from '@dslab/ra-root-selector';
import { DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
    CreateBase,
    useGetResourceLabel,
    useNotify,
    useRedirect,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { StepperToolbar } from '../../../common/components/toolbars/StepperToolbar';
import { BaseStep, ArtifactSpecStep, UploadStep } from './steps';
import { ExtensionsForm } from '../../../features/extensions/components/Form';
import { useExtensionsSteps } from '../../../features/extensions/steps';
import { useGetExtensions } from '../../../features/extensions/utils';
import { useGetSchemas } from '../../../common/jsonSchema/schemaController';
import { randomId } from '../../../common/utils/helpers';
import { UploadCoordinatorContext } from '../../../features/files/upload/UploaderContext';
import { useResourceUploader } from '../../../features/files/upload/useRecordUploader';
import { StyledDialogClasses } from '../../../common/theme/StyledDialog';
import { transformArtifactData } from './utils';

export const ArtifactUpload = ({ closeDialog, handleClose }: any) => {
    const { root } = useRootSelector();
    const resource = useResourceContext();
    const [id] = useState(randomId);
    const uploader = useResourceUploader({ id });
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const getResourceLabel = useGetResourceLabel();

    const onSettled = async (data, error) => {
        if (error) return;
        await uploader.prepare(data);
        uploader.start();
        closeDialog();
        notify('ra.notification.created', { messageArgs: { smart_count: 1 } });
        redirect('list', resource);
    };

    return (
        <CreateBase
            resource={resource}
            redirect={false}
            transform={data => transformArtifactData(data, root)}
            mutationOptions={{ onSettled }}
            record={{ id, spec: {} }}
        >
            <div className={StyledDialogClasses.header}>
                <DialogTitle
                    id="create-dialog-title"
                    className={StyledDialogClasses.title}
                >
                    {translate('ra.page.create', {
                        name: getResourceLabel(resource || '', 1),
                    })}
                </DialogTitle>
                <IconButton
                    className={StyledDialogClasses.closeButton}
                    aria-label={translate('ra.action.close')}
                    title={translate('ra.action.close')}
                    onClick={handleClose}
                    size="small"
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </div>
            <DialogContent
                sx={{ p: 0 }}
                className={StyledDialogClasses.content}
            >
                <UploadCoordinatorContext.Provider value={uploader}>
                    <ArtifactUploadForm />
                </UploadCoordinatorContext.Provider>
            </DialogContent>
        </CreateBase>
    );
};

const ArtifactUploadForm = () => {
    const resource = useResourceContext();
    const { data: kindSchemas } = useGetSchemas(resource);
    const { data: extensions } = useGetExtensions(resource);
    const contributions = useExtensionsSteps({ resource });
    const kinds =
        kindSchemas?.map(schema => ({ id: schema.kind, name: schema.kind })) ??
        [];
    const steps: ReactElement<any, JSXElementConstructor<Step>>[] = [
        <StepperForm.Step key="upload" label="actions.upload">
            <UploadStep readOnly />
        </StepperForm.Step>,
        <StepperForm.Step key="base" label="fields.base">
            <BaseStep />
        </StepperForm.Step>,
        <StepperForm.Step key="spec" label="fields.spec.title">
            <ArtifactSpecStep kinds={kinds} />
        </StepperForm.Step>,
    ];

    if (contributions && contributions.length > 0) {
        steps.push(...contributions);
    }

    if (extensions && extensions.length > 0) {
        steps.push(
            <StepperForm.Step key="extensions" label="fields.extensions.title">
                <ExtensionsForm source="extensions" />
            </StepperForm.Step>
        );
    }

    return <StepperForm toolbar={<StepperToolbar />}>{steps}</StepperForm>;
};
