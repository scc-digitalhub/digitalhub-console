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
import { ReactNode, useEffect, useState } from 'react';
import {
    RaRecord,
    DeleteWithConfirmButton,
    DeleteWithConfirmButtonProps,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export const DeleteWithConfirmButtonByName = <
    RecordType extends RaRecord = any
>(
    props: DeleteWithConfirmButtonProps<RecordType> & {
        deleteAll?: boolean;
        askForCascade?: boolean;
        additionalContent?: ReactNode;
    }
) => {
    const {
        deleteAll = false,
        askForCascade = false,
        additionalContent,
        titleTranslateOptions,
        confirmContent,
        ...rest
    } = props;
    const record = useRecordContext(rest);
    const translate = useTranslate();
    //if deleteAll, force cascade
    const [cascade, setCascade] = useState(deleteAll);

    useEffect(() => {
        if (deleteAll) setCascade(true);
    }, [deleteAll]);

    if (!record) return <></>;

    const mutationsOptions = {
        meta: {
            deleteAll,
            name: record.name,
            cascade,
        },
    };

    const handleChange = (e: any) => {
        setCascade(e.target.checked);
    };

    const defaultConfirmContent = (
        <Box>
            <DialogContentText>
                {translate('ra.message.delete_content', { name: 'item' })}
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
                            {record.status.files !== undefined
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
        <DeleteWithConfirmButton
            titleTranslateOptions={titleTranslateOptions ?? { id: record.name }}
            {...rest}
            mutationOptions={mutationsOptions}
            confirmContent={confirmContent ?? defaultConfirmContent}
        />
    );
};
