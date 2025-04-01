import { Stack, Typography } from '@mui/material';
import get from 'lodash/get';
import { MouseEvent } from 'react';

import {
    TextFieldProps,
    useRecordContext,
    sanitizeFieldRestProps,
    useNotify,
    IconButtonWithTooltip,
    useTranslate,
} from 'react-admin';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { grey } from '@mui/material/colors';

export const IdField = <
    RecordType extends Record<string, any> = Record<string, any>
>(
    props: Omit<TextFieldProps<RecordType>, 'source'> & {
        source: string;
        copy?: boolean;
        format?: (value: any) => any;
    }
) => {
    const {
        className,
        source,
        copy = true,
        format = v => v,
        label,
        ...rest
    } = props;
    const record = useRecordContext(props);
    const notify = useNotify();
    const translate = useTranslate();

    const value = get(record, source);
    if (!value) return null;

    const displayValue = format(value);
    const displayLabel =
        label && typeof label === 'string'
            ? translate(label)
            : source && typeof source === 'string'
            ? translate(source)
            : translate('content');

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        if (value) {
            navigator.clipboard.writeText(value);
            notify('messages.content_copied_x', {
                messageArgs: { x: displayLabel },
            });
        }
    };

    return (
        <Stack direction={'row'} columnGap={0} alignItems={'flex-start'}>
            <Typography
                component="span"
                variant="body2"
                className={className}
                onClick={e => {
                    if (copy) {
                        handleClick(e);
                    }
                }}
                {...sanitizeFieldRestProps(rest)}
                sx={{ '&:hover': { backgroundColor: grey[200] } }}
            >
                {displayValue}
            </Typography>
            {copy && (
                <IconButtonWithTooltip
                    label="actions.click_to_copy"
                    onClick={handleClick}
                    sx={{ py: 0 }}
                >
                    <ContentCopyIcon fontSize="small" />
                </IconButtonWithTooltip>
            )}
        </Stack>
    );
};
