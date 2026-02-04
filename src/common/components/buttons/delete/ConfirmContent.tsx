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
import { useTranslate } from 'react-admin';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { DeleteButtonOptions } from './types';

export type ConfirmContentProps = {
    setDeleteAll: (value: boolean) => void;
    setCascade: (value: boolean) => void;
    records: any[];
};

export const ConfirmContent = (
    props: DeleteButtonOptions & ConfirmContentProps
) => {
    const {
        deleteAll = false,
        cascade = false,
        setDeleteAll,
        setCascade,
        askForDeleteAll = false,
        askForCascade = false,
        disableDeleteAll = false,
        disableCascade = false,
        additionalContent,
        onDeleteAll,
        onCascade,
        records,
    } = props;
    const translate = useTranslate();

    const handleDeleteAllChange = (e: any) => {
        setDeleteAll(e.target.checked);
        if (onDeleteAll) onDeleteAll(e.target.checked);
    };

    const handleCascadeChange = (e: any) => {
        setCascade(e.target.checked);
        if (onCascade) onCascade(e.target.checked);
    };

    return (
        <Box>
            <DialogContentText>
                {translate('ra.message.bulk_delete_content', {
                    name: 'item',
                    smart_count: records.length,
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
                    {records.some(r => r.status?.files !== undefined)
                        ? translate('messages.cascade_warning.no_undone_files')
                        : translate('messages.cascade_warning.no_undone')}
                </Typography>
            )}
        </Box>
    );
};
