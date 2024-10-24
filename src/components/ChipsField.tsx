import { Chip, Stack } from '@mui/material';
import get from 'lodash/get';

import { TextFieldProps, useRecordContext } from 'react-admin';

export const ChipsField = <
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
        emptyText,
        copy = true,
        format = v => v,
        label,
        ...rest
    } = props;
    const record = useRecordContext(props);

    const value = get(record, source) as string | string[];
    if (!value) return null;

    return (
        <Stack direction={'row'} columnGap={0} alignItems={'flex-start'}>
            {typeof value === 'string' ? (
                <Chip key={value} label={value} sx={{ mr: '5px' }}></Chip>
            ) : (
                value.map(label => (
                    <Chip key={label} label={label} sx={{ mr: '5px' }}></Chip>
                ))
            )}
        </Stack>
    );
};
