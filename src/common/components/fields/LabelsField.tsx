// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Chip, ChipProps, Stack } from '@mui/material';
import get from 'lodash/get';

import { TextFieldProps, useRecordContext } from 'react-admin';
import { getLabelIcon } from '../Labels';

export const LabelsField = <
    RecordType extends Record<string, any> = Record<string, any>
>(
    props: Omit<TextFieldProps<RecordType>, 'source'> &
        ChipProps & {
            source: string;
            copy?: boolean;
            format?: (value: any) => any;
        }
) => {
    const { source, color, size, icon, sx, ...rest } = props;
    const record = useRecordContext(props);

    const value = get(record, source) as string | string[];
    if (!value) return null;

    return (
        <Stack
            direction={'row'}
            alignItems={'flex-start'}
            sx={{ flexWrap: 'wrap', gap: '3px' }}
        >
            {typeof value === 'string' ? (
                <Chip
                    key={value}
                    label={value}
                    color={color}
                    icon={icon}
                    size={size}
                    sx={sx}
                ></Chip>
            ) : (
                value.map(item => {
                    const separatorIndex = item.indexOf(':');
                    const label =
                        separatorIndex > 0 ? (
                            <>
                                <strong>
                                    {item.slice(0, separatorIndex).trim()}
                                </strong>{' '}
                                {item.slice(separatorIndex + 1).trim()}
                            </>
                        ) : (
                            item
                        );

                    const icon = getLabelIcon(item);

                    return (
                        <Chip
                            key={item}
                            label={label}
                            color={color}
                            icon={icon}
                            size={size}
                            sx={sx}
                        ></Chip>
                    );
                })
            )}
        </Stack>
    );
};
