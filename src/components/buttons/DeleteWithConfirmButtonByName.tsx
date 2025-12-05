// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Box,
    DialogContentText,
    FormControlLabel,
    Switch,
    Typography,
} from '@mui/material';
import { ReactNode, useState } from 'react';
import {
    RaRecord,
    DeleteWithConfirmButton,
    DeleteWithConfirmButtonProps,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

//TODO move to a utils file when refactoring, reuse for bulk delete
export type DeleteButtonOptions = {
    deleteAll?: boolean;
    cascade?: boolean;
    askForDeleteAll?: boolean;
    askForCascade?: boolean;
    disableDeleteAll?: boolean;
    disableCascade?: boolean;
    onDeleteAll?: (value: boolean) => void;
    onCascade?: (value: boolean) => void;
    additionalContent?: ReactNode;
};

export const DeleteWithConfirmButtonByName = <
    RecordType extends RaRecord = any
>(
    props: DeleteWithConfirmButtonProps<RecordType> & DeleteButtonOptions
) => {
    const {
        deleteAll: deleteAllFromProps = false,
        cascade: cascadeFromProps = false,
        askForDeleteAll = false,
        askForCascade = false,
        disableDeleteAll = false,
        disableCascade = false,
        additionalContent,
        onDeleteAll,
        onCascade,
        titleTranslateOptions,
        confirmContent,
        ...rest
    } = props;
    const record = useRecordContext(rest);
    const translate = useTranslate();
    const [deleteAll, setDeleteAll] = useState(deleteAllFromProps);
    const [cascade, setCascade] = useState(cascadeFromProps);

    if (!record) return <></>;

    const mutationsOptions = {
        meta: {
            deleteAll,
            name: record.name,
            cascade,
        },
    };

    const handleDeleteAllChange = (e: any) => {
        setDeleteAll(e.target.checked);
        if (onDeleteAll) onDeleteAll(e.target.checked);
    };

    const handleCascadeChange = (e: any) => {
        setCascade(e.target.checked);
        if (onCascade) onCascade(e.target.checked);
    };

    const defaultConfirmContent = (
        <Box>
            <DialogContentText>
                {translate('ra.message.delete_content', { name: 'item' })}
            </DialogContentText>
            {additionalContent}
            {askForCascade && (
                <Box>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={cascade}
                                disabled={disableCascade}
                                onChange={handleCascadeChange}
                            />
                        }
                        label={translate('actions.cascade_delete')}
                    />
                </Box>
            )}
            {askForDeleteAll && (
                <Box>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={deleteAll}
                                disabled={disableDeleteAll}
                                onChange={handleDeleteAllChange}
                            />
                        }
                        label={translate('actions.delete_all_versions')}
                    />
                </Box>
            )}
            {(deleteAll || cascade) && (
                <Typography
                    variant="body2"
                    color="error"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        ml: 2,
                    }}
                >
                    <WarningAmberIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {record.status.files !== undefined
                        ? translate('messages.cascade_warning.no_undone_files')
                        : translate('messages.cascade_warning.no_undone')}
                </Typography>
            )}
        </Box>
    );

    return (
        <DeleteWithConfirmButton
            titleTranslateOptions={titleTranslateOptions ?? { id: record.name }}
            {...rest}
            mutationOptions={mutationsOptions}
            confirmContent={confirmContent ?? defaultConfirmContent}
        />
    );
};
