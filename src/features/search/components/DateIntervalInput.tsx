// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import TextField, {
    TextFieldProps,
    TextFieldPropsSizeOverrides,
} from '@mui/material/TextField';
import { OverridableStringUnion } from '@mui/types';
import { useEffect, useMemo, useState } from 'react';
import {
    CommonInputProps,
    FieldTitle,
    InputHelperText,
    sanitizeInputRestProps,
    useInput,
} from 'react-admin';
import clsx from 'clsx';

export const DateIntervalInput = (props: DateIntervalInputProps) => {
    const {
        className,
        defaultValue = ',',
        fromLabel = 'From',
        toLabel = 'To',
        format,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        label,
        name,
        source,
        resource,
        helperText,
        margin,
        onBlur,
        onChange,
        parse,
        validate,
        variant,
        disabled,
        readOnly,
        ...rest
    } = props;
    const { field, fieldState, formState, id, isRequired } = useInput({
        defaultValue,
        name,
        format,
        parse,
        onBlur,
        onChange,
        resource,
        source,
        validate,
        disabled,
        readOnly,
        ...rest,
    });

    const {
        onChange: onchangeUseInput,
        value: valueUseInput,
        ...fieldRest
    } = field;
    const { error, invalid, isTouched } = fieldState;
    const { isSubmitted, isDirty } = formState;
    const renderHelperText =
        helperText !== false || ((isTouched || isSubmitted) && invalid);

    const [range, setRange] = useState<string>(valueUseInput);

    useEffect(() => {
        if (!isDirty && range !== valueUseInput) {
            setRange(valueUseInput);
        }
    }, [isDirty]);

    useEffect(() => {
        //TODO controllare se range diverso da valueUseInput?
        onchangeUseInput(range);
    }, [range, onchangeUseInput]);

    const from = useMemo(() => {
        if (!range) {
            return null;
        }
        const dates = range.split(',');
        if (dates.length > 1) {
            return dates[0];
        } else {
            return null;
        }
    }, [range]);

    const to = useMemo(() => {
        if (!range) {
            return null;
        }
        const dates = range.split(',');
        if (dates.length > 1) {
            return dates[1];
        } else {
            return null;
        }
    }, [range]);

    const setFrom = newFrom => {
        setRange(prev => {
            const oldDates = prev.split(',');
            if (oldDates.length > 1) {
                return newFrom + ',' + oldDates[1];
            } else {
                return newFrom + ',';
            }
        });
    };

    const setTo = newTo => {
        setRange(prev => {
            const oldDates = prev.split(',');
            if (oldDates.length > 1) {
                return oldDates[0] + ',' + newTo;
            } else {
                return ',' + newTo;
            }
        });
    };

    const sharedProps = {
        className: clsx('ra-input', `ra-input-${source}`, className),
        type: 'date',
        size: 'small' as OverridableStringUnion<
            'small' | 'medium',
            TextFieldPropsSizeOverrides
        >,
        variant: variant,
        margin: margin,
        error: (isTouched || isSubmitted) && invalid,
        disabled: disabled || readOnly,
        readOnly: readOnly,
    };

    return (
        <>
            <TextField
                id={id + '_from'}
                {...fieldRest}
                value={from}
                onChange={e => setFrom(e.target.value)}
                {...sharedProps}
                label={<FieldTitle label={fromLabel} isRequired={isRequired} />}
                slotProps={{ inputLabel: { shrink: true } }}
                helperText={
                    renderHelperText ? (
                        <InputHelperText
                            error={error?.message}
                            helperText={helperText}
                        />
                    ) : null
                }
                {...sanitizeInputRestProps(rest)}
            />
            <TextField
                id={id + '_to'}
                {...fieldRest}
                value={to}
                onChange={e => setTo(e.target.value)}
                {...sharedProps}
                label={<FieldTitle label={toLabel} isRequired={isRequired} />}
                slotProps={{ inputLabel: { shrink: true } }}
                helperText={
                    renderHelperText ? (
                        <InputHelperText
                            error={error?.message}
                            helperText={helperText}
                        />
                    ) : null
                }
                {...sanitizeInputRestProps(rest)}
            />
        </>
    );
};

export type DateIntervalInputProps = Omit<CommonInputProps, 'defaultValue'> &
    Omit<TextFieldProps, 'helperText' | 'label'> & {
        defaultValue?: string;
        fromLabel?: string;
        toLabel?: string;
    };
