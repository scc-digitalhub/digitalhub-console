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
import { useState } from 'react';
import {
    BulkDeleteButton,
    BulkDeleteButtonProps,
    useListContext,
    useTranslate,
} from 'react-admin';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { DeleteButtonOptions } from './DeleteWithConfirmButtonByName';

export const BulkDeleteAllVersionsButton = (
    props: BulkDeleteButtonProps & DeleteButtonOptions
) => {
    const {
        mutationMode = 'pessimistic',
        deleteAll: deleteAllFromProps = false,
        cascade: cascadeFromProps = false,
        askForDeleteAll = false,
        askForCascade = false,
        disableDeleteAll = false,
        disableCascade = false,
        additionalContent,
        confirmContent,
        ...rest
    } = props;
    const translate = useTranslate();
    //if deleteAll, force cascade
    const [deleteAll, setDeleteAll] = useState(deleteAllFromProps);
    const [cascade, setCascade] = useState(cascadeFromProps);
    const { data, selectedIds } = useListContext();

    if (!data) return <></>;

    const selectedData = data.filter(d => selectedIds.includes(d.id));

    const mutationOptions = {
        meta: {
            deleteAll,
            names: selectedData.map(sd => sd.name),
            cascade,
        },
    };

    const handleDeleteAllChange = (e: any) => {
        setDeleteAll(e.target.checked);
    };

    const handleCascadeChange = (e: any) => {
        setCascade(e.target.checked);
    };

    const defaultConfirmContent = (
        <Box>
            <DialogContentText>
                {translate('ra.message.bulk_delete_content', {
                    name: 'item',
                    smart_count: selectedIds.length,
                })}
            </DialogContentText>
            {additionalContent}
            {askForCascade && (
                <Box>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={cascade}
                                onChange={handleCascadeChange}
                                disabled={disableCascade}
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
                                onChange={handleDeleteAllChange}
                                disabled={disableDeleteAll}
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
                    {selectedData.some(sd => sd.status?.files !== undefined)
                        ? translate('messages.cascade_warning.no_undone_files')
                        : translate('messages.cascade_warning.no_undone')}
                </Typography>
            )}
        </Box>
    );

    return (
        <BulkDeleteButton
            {...rest}
            mutationOptions={mutationOptions}
            mutationMode={mutationMode}
            confirmContent={confirmContent ?? defaultConfirmContent}
        />
    );
};
