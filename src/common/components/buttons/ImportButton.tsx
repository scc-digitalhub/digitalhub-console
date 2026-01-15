// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { MouseEventHandler, ReactElement, useState } from 'react';
import {
    BooleanInput,
    Button,
    ButtonProps,
    CreateBase,
    CreateProps,
    Identifier,
    RaRecord,
    required,
    SaveButton,
    SimpleForm,
    Toolbar,
    useCreateContext,
    useGetResourceLabel,
    useNotify,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import {
    Box,
    Breakpoint,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    styled,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadIcon from '@mui/icons-material/Upload';
import { AceEditorInput } from '@dslab/ra-ace-editor';
import { toYaml } from '@dslab/ra-export-record-button';
import yaml from 'yaml';
import { useRootSelector } from '@dslab/ra-root-selector';
import { get } from 'lodash';
import { isValidAgainstSchema } from '../../helper';
import Ajv2020 from 'ajv/dist/2020';
import { customizeValidator } from '@rjsf/validator-ajv8';
import { useGetManySchemas } from '../../../features/jsonSchema/schemaController';

const ajv = customizeValidator({ AjvClass: Ajv2020 });
const defaultIcon = <UploadIcon />;

export const ImportButton = (props: ImportButtonProps) => {
    const {
        title = 'pages.importer.title',
        icon = defaultIcon,
        maxWidth = 'md',
        fullWidth = true,
        label = 'actions.import_one',
        color = 'info',
        variant,
        mutationOptions = {},
        record,
        sx,
        ...rest
    } = props;

    const resource = useResourceContext(props);
    const { root: projectId } = useRootSelector();

    const [open, setOpen] = useState(false);
    const notify = useNotify();
    const { onSuccess } = mutationOptions;

    const closeDialog = () => {
        setOpen(false);
    };

    const handleDialogOpen: MouseEventHandler<HTMLButtonElement> = e => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose: MouseEventHandler<HTMLButtonElement> = e => {
        closeDialog();
        e.stopPropagation();
    };

    return (
        <>
            <Button
                label={label}
                color={color}
                onClick={handleDialogOpen}
                className={ImportButtonClasses.button}
                variant={variant}
            >
                {icon}
            </Button>

            <ImportDialog
                maxWidth={maxWidth}
                fullWidth={fullWidth}
                onClose={handleDialogClose}
                aria-labelledby="import-dialog-title"
                open={open}
                className={ImportButtonClasses.dialog}
                scroll="paper"
                sx={sx}
            >
                <CreateBase
                    resource={resource}
                    redirect={false}
                    {...rest}
                    transform={data => {
                        //unpack record
                        const res = {
                            ...data.value,
                            project: projectId,
                        };

                        if (data.reset) {
                            //reset fields
                            delete res['id'];
                        }

                        return res;
                    }}
                    record={{
                        reset: false,
                        value: record || {
                            name: '',
                            project: projectId,
                            metadata: {},
                            spec: {},
                        },
                    }}
                    mutationOptions={{
                        ...mutationOptions,
                        onSuccess: (
                            data,
                            variables,
                            onMutateResult,
                            context
                        ) => {
                            closeDialog();

                            if (onSuccess) {
                                return onSuccess(
                                    data,
                                    variables,
                                    onMutateResult,
                                    context
                                );
                            }

                            notify('ra.notification.created', {
                                type: 'info',
                                messageArgs: { smart_count: 1 },
                            });
                        },
                    }}
                >
                    <CreateContent
                        title={title}
                        handleClose={handleDialogClose}
                    />
                </CreateBase>
            </ImportDialog>
        </>
    );
};

const CreateContent = (props: {
    title: string | false | ReactElement;
    handleClose: MouseEventHandler;
}) => {
    const { title, handleClose } = props;
    const translate = useTranslate();
    const { defaultTitle } = useCreateContext();
    const resource = useResourceContext();
    const getResourceLabel = useGetResourceLabel();
    const resourceLabel = getResourceLabel(resource || '', 1);
    const { data: schemas } = useGetManySchemas([{ resource: resource || '' }]);

    const validate = data => {
        const errors: string[] = [];
        const record = data?.value || {};

        const requiredFields = ['name', 'kind', 'project', 'spec'];

        requiredFields.forEach(field => {
            const f = get(record, field);
            if (!f) {
                errors.push(
                    translate('messages.validation.required_field', {
                        field,
                    })
                );
            }
        });

        const notNullFields = [...requiredFields, 'metadata', 'status'];
        notNullFields.forEach(field => {
            const f = get(record, field);
            if (f === null) {
                errors.push(
                    translate('messages.validation.invalid_field', {
                        field,
                        error: '',
                    })
                );
            }
        });

        //validate schema
        if (record.kind && !schemas?.find(s => s.kind == record.kind)) {
            errors.push(
                translate('messages.validation.invalid_field', {
                    field: 'kind',
                    error: 'unsupported',
                })
            );
        }
        if (
            record.kind &&
            record.spec &&
            schemas?.find(s => s.kind == record.kind)
        ) {
            const schema = schemas?.find(s => s.kind == record.kind).schema;
            const err = isValidAgainstSchema(ajv, schema)(get(record, 'spec'));
            if (err) {
                errors.push(
                    translate('messages.validation.invalid_field', {
                        field: 'spec',
                        error: err,
                    })
                );
            }
        }

        return errors.length == 0 ? {} : { value: errors.join(', ') };
    };

    return (
        <>
            <div className={ImportButtonClasses.header}>
                <DialogTitle
                    id="create-dialog-title"
                    className={ImportButtonClasses.title}
                >
                    {!title
                        ? defaultTitle
                        : typeof title === 'string'
                        ? translate(title, {
                              _: title,
                              resource: resourceLabel,
                          })
                        : title}
                </DialogTitle>

                <IconButton
                    className={ImportButtonClasses.closeButton}
                    aria-label={translate('ra.action.close')}
                    title={translate('ra.action.close')}
                    onClick={handleClose}
                    size="small"
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </div>

            <DialogContent sx={{ p: 0 }}>
                <Box p={2}>
                    <Typography variant="body2">
                        {translate('pages.importer.helperText')}
                    </Typography>
                </Box>
                <SimpleForm
                    validate={validate}
                    toolbar={
                        <Toolbar>
                            <SaveButton
                                label="actions.import_one"
                                alwaysEnable
                            />
                        </Toolbar>
                    }
                >
                    <AceEditorInput
                        mode="yaml"
                        theme="github"
                        source="value"
                        label="fields.value.title"
                        parse={toYaml}
                        format={yaml.parse}
                        validate={[required()]}
                        minLines={20}
                        width="40vw"
                    />
                    <BooleanInput
                        source="reset"
                        label="pages.importer.resetOnImport.label"
                        helperText="pages.importer.resetOnImport.helperText"
                    />
                </SimpleForm>
            </DialogContent>
        </>
    );
};

export type ImportButtonProps<
    RecordType extends Omit<RaRecord, 'id'> = any,
    MutationOptionsError = unknown,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier }
> = Omit<
    CreateProps<RecordType, MutationOptionsError, ResultRecordType>,
    | 'actions'
    | 'aside'
    | 'component'
    | 'hasEdit'
    | 'hasShow'
    | 'redirect'
    | 'className'
    | 'children'
> & {
    maxWidth?: Breakpoint | false;
    fullWidth?: boolean;
    label?: string;
    variant?: 'text' | 'outlined' | 'contained';
    icon?: ReactElement;
} & Pick<ButtonProps, 'color'>;

const PREFIX = 'RaImportButton';

export const ImportButtonClasses = {
    button: `${PREFIX}-button`,
    dialog: `${PREFIX}-dialog`,
    header: `${PREFIX}-header`,
    title: `${PREFIX}-title`,
    closeButton: `${PREFIX}-close-button`,
};

const ImportDialog = styled(Dialog, {
    name: PREFIX,
    overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${ImportButtonClasses.title}`]: {
        padding: theme.spacing(0),
    },
    [`& .${ImportButtonClasses.header}`]: {
        padding: theme.spacing(2, 2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    [`& .${ImportButtonClasses.closeButton}`]: {
        height: 'fit-content',
    },
}));
