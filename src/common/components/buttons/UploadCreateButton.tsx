// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { CreateInDialogButtonClasses } from '@dslab/ra-dialog-crud';
import { StepperForm } from '@dslab/ra-stepper';
import { StepperToolbar } from '../toolbars/StepperToolbar';
import {
    Button,
    CreateBase,
    required,
    TextInput,
    useGetResourceLabel,
    useInput,
    useNotify,
    useRedirect,
    useResourceContext,
    useResourceDefinition,
    useTranslate,
} from 'react-admin';
import { MetadataInput } from '../../../features/metadata/components/MetadataInput';
import { isAlphaNumeric, randomId } from '../../utils/helpers';
import { useRootSelector } from '@dslab/ra-root-selector';
import {
    MouseEventHandler,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useStateUpdateCallbacks } from '../../hooks/useStateUpdateCallbacks';
import { useGetUploader } from '../../../features/files/upload/useGetUploader';
import { FileInput } from '../../../features/files/upload/components/FileInput';
import { Uploader } from '../../../features/files/upload/types';
import { CreateSpecWithUpload } from '../upload/CreateSpecWithUpload';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';

export const UploadCreateButton = () => {
    const [open, setOpen] = useState(false);

    const closeDialog = () => {
        setOpen(false);
    };

    const handleDialogOpen: MouseEventHandler<HTMLButtonElement> = e => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose: any = (e, reason) => {
        if (!reason || reason != 'backdropClick') {
            closeDialog();
        }
        e.stopPropagation();
    };

    return (
        <>
            <Button
                label="actions.upload"
                onClick={handleDialogOpen}
                className={CreateInDialogButtonClasses.button}
            >
                <NoteAddOutlinedIcon />
            </Button>
            <CreateDialog
                maxWidth={'lg'}
                fullWidth
                onClose={handleDialogClose}
                aria-labelledby="create-dialog-title"
                open={open}
                className={CreateInDialogButtonClasses.dialog}
            >
                <UploadCreateForm
                    closeDialog={closeDialog}
                    handleClose={handleDialogClose}
                />
            </CreateDialog>
        </>
    );
};

const UploadCreateForm = (props: any) => {
    const { closeDialog, handleClose } = props;
    const { root } = useRootSelector();
    const id = useRef(randomId());
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const getResourceLabel = useGetResourceLabel();
    const resource = useResourceContext();
    const definition = useResourceDefinition({ resource });
    const { onBeforeUpload, onUploadComplete } = useStateUpdateCallbacks({
        id: id.current,
    });
    const onBeforeFileAdded = useCallback(
        (file, files) => {
            //if there is more than one folder or more than one file outside folder, return false
            if (Object.keys(files).length > 0) {
                const relativePaths = Object.values(files).map((f: any) => {
                    return f.meta?.relativePath ?? f.name;
                });
                const currentPath =
                    file.meta?.relativePath?.split('/')[0] ?? file.name;
                if (relativePaths.some(p => !p.startsWith(currentPath))) {
                    notify(translate('messages.upload.single_file_allowed'), {
                        type: 'error',
                    });
                    return false;
                }
            }

            return true;
        },
        [notify, translate]
    );
    const uploader = useGetUploader({
        id: id.current,
        recordId: id.current,
        onBeforeUpload,
        onUploadComplete,
        onBeforeFileAdded,
    });

    if (!uploader || !resource) return <></>;

    const transform = data => {
        //strip path tl which is a transient field
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { path, ...rest } = data;

        return {
            ...rest,
            project: root,
        };
    };

    const onSuccess = () => {};

    const onSettled = (data, error) => {
        closeDialog();
        if (error) {
            //onError already handles notify
            return;
        }

        //post save we start uploading
        if (uploader.files.length > 0) {
            uploader.upload(data);
        }

        notify('ra.notification.created', { messageArgs: { smart_count: 1 } });
        redirect('list', resource);
    };

    return (
        <CreateBase
            resource={resource}
            redirect={false}
            transform={transform}
            mutationOptions={{ onSuccess, onSettled }}
            record={{
                id: id.current,
                spec: { path: uploader.path ?? null },
            }}
        >
            <div className={CreateInDialogButtonClasses.header}>
                <DialogTitle
                    id="create-dialog-title"
                    className={CreateInDialogButtonClasses.title}
                >
                    {translate('ra.page.create', {
                        name: getResourceLabel(resource, 1),
                    })}
                </DialogTitle>

                <IconButton
                    className={CreateInDialogButtonClasses.closeButton}
                    aria-label={translate('ra.action.close')}
                    title={translate('ra.action.close')}
                    onClick={handleClose}
                    size="small"
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </div>
            <DialogContent sx={{ p: 0 }}>
                <StepperForm
                    toolbar={<StepperToolbar disableNext={!uploader.path} />}
                >
                    <StepperForm.Step label={'actions.upload'}>
                        <FileInput uploader={uploader} source="path" />
                    </StepperForm.Step>
                    <StepperForm.Step label={'fields.base'}>
                        <BaseStep uploader={uploader} />
                    </StepperForm.Step>
                    {definition?.options?.getSpecUiSchema && (
                        <StepperForm.Step label={'fields.spec.title'}>
                            <CreateSpecWithUpload
                                uploader={uploader}
                                getSpecUiSchema={
                                    definition.options.getSpecUiSchema
                                }
                                showFileInput={false}
                            />
                        </StepperForm.Step>
                    )}
                </StepperForm>
            </DialogContent>
        </CreateBase>
    );
};

const BaseStep = ({ uploader }: { uploader: Uploader }) => {
    const resource = useResourceContext();
    const { field: nameField } = useInput({ resource, source: 'name' });

    //update name in record
    useEffect(() => {
        if (uploader.files.length > 0 && !nameField.value) {
            const fileName = uploader.files[0].info.path.split('/')[0];
            nameField.onChange(fileName);
        }
    }, [nameField, uploader.files]);

    //update name in controller
    useEffect(() => {
        if (nameField.value) {
            uploader.setName(nameField.value);
        }
    }, [uploader, nameField?.value]);

    return (
        <>
            <TextInput
                source="name"
                validate={[required(), isAlphaNumeric()]}
            />
            <MetadataInput />
        </>
    );
};

const CreateDialog = styled(Dialog, {
    name: 'RaCreateInDialogButton',
    overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${CreateInDialogButtonClasses.title}`]: {
        padding: theme.spacing(0),
    },
    [`& .${CreateInDialogButtonClasses.header}`]: {
        padding: theme.spacing(2, 2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    [`& .${CreateInDialogButtonClasses.closeButton}`]: {
        height: 'fit-content',
    },
}));
