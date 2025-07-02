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
    BulkDeleteButton,
    BulkDeleteButtonProps,
    useListContext,
    useTranslate,
} from 'react-admin';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export const BulkDeleteAllVersionsButton = (
    props: BulkDeleteButtonProps & {
        deleteAll?: boolean;
        askForCascade?: boolean;
        additionalContent?: ReactNode;
    }
) => {
    const {
        deleteAll = false,
        mutationMode = 'pessimistic',
        askForCascade = false,
        additionalContent,
        confirmContent,
        ...rest
    } = props;
    const translate = useTranslate();
    //if deleteAll, force cascade
    const [cascade, setCascade] = useState(deleteAll);
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

    const handleChange = (e: any) => {
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
                <>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={cascade}
                                onChange={handleChange}
                                disabled={deleteAll}
                            />
                        }
                        label={translate('actions.cascade_delete')}
                    />
                    {cascade && (
                        <Typography
                            variant="body2"
                            color="error"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                ml: 2,
                            }}
                        >
                            <WarningAmberIcon
                                fontSize="small"
                                sx={{ mr: 0.5 }}
                            />
                            {selectedData.some(
                                sd => sd.status?.files !== undefined
                            )
                                ? translate(
                                      'messages.cascade_warning.no_undone_files'
                                  )
                                : translate(
                                      'messages.cascade_warning.no_undone'
                                  )}
                        </Typography>
                    )}
                </>
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
