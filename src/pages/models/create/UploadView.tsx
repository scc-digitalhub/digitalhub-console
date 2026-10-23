// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { JSXElementConstructor, ReactElement, useState } from 'react';
import { Step, StepperForm } from '@dslab/ra-stepper';
import { DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
    useGetResourceLabel,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { StepperToolbar } from '../../../common/components/toolbars/StepperToolbar';
import { BaseStep, ModelSpecStep, UploadStep } from './steps';
import { ExtensionsForm } from '../../../features/extensions/components/Form';
import { useExtensionsSteps } from '../../../features/extensions/steps';
import { useGetExtensions } from '../../../features/extensions/utils';
import { useGetSchemas } from '../../../common/jsonSchema/schemaController';
import { randomId } from '../../../common/utils/helpers';
import { StyledDialogClasses } from '../../../common/theme/StyledDialog';
import { ModelCreate } from './create';

export const ModelUpload = ({ closeDialog, handleClose }: any) => {
    const resource = useResourceContext();
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    const [id] = useState(randomId);

    const onSettled = () => {
        closeDialog();
    };

    return (
        <>
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
                <ModelCreate
                    id={id}
                    redirect="list"
                    mutationOptions={{ onSettled }}
                >
                    <ModelUploadForm />
                </ModelCreate>
            </DialogContent>
        </>
    );
};

const ModelUploadForm = () => {
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
            <ModelSpecStep kinds={kinds} />
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
