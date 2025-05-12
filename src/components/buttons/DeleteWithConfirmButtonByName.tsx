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

export const DeleteWithConfirmButtonByName = <
    RecordType extends RaRecord = any
>(
    props: DeleteWithConfirmButtonProps<RecordType> & {
        deleteAll?: boolean;
        askForCascade?: boolean;
        cascadeByDefault?: boolean;
        additionalContent?: ReactNode;
    }
) => {
    const {
        deleteAll = false,
        askForCascade = false,
        cascadeByDefault = false,
        additionalContent,
        translateOptions,
        confirmContent,
        ...rest
    } = props;
    const record = useRecordContext(rest);
    const translate = useTranslate();
    const [cascade, setCascade] = useState(cascadeByDefault);

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
                {translate('ra.message.delete_content')}
            </DialogContentText>
            {additionalContent}
            {askForCascade && (
                <>
                    <FormControlLabel
                        control={
                            <Switch checked={cascade} onChange={handleChange} />
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
            translateOptions={translateOptions ?? { id: record.name }}
            {...rest}
            mutationOptions={mutationsOptions}
            confirmContent={confirmContent ?? defaultConfirmContent}
        />
    );
};
