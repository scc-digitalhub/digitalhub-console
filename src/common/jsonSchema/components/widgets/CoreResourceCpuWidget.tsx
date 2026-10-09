// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Grid,
    MenuItem,
    Typography,
    TextField,
    FormHelperText,
    Stack,
    Alert,
} from '@mui/material';
import {
    WidgetProps,
    FormContextType,
    RJSFSchema,
    StrictRJSFSchema,
    getTemplate,
    titleId,
} from '@rjsf/utils';
import Parser from 'k8s-resource-parser';
import { useEffect, useState } from 'react';
import { useTranslate } from 'react-admin';

export const CoreResourceCpuWidget = function <
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any
>(props: WidgetProps<T, S, F>) {
    const {
        id,
        value,
        readonly,
        options,
        onChange,
        schema,
        label,
        registry,
        help,
    } = props;
    const translate = useTranslate();

    const constValue = schema?.const as string | number | undefined;
    const enumValues = schema?.enum as (string | number)[] | undefined;
    const minimum = schema?.minimum ?? schema?.exclusiveMinimum ?? 0;
    const min = Parser.cpuParser(String(minimum));
    const maximum = schema?.['x-maximumQuantity'];
    const max =
        maximum === undefined ? undefined : Parser.cpuParser(String(maximum));
    const step = schema?.multipleOf ?? 'any';
    const isConst = constValue !== undefined;

    const initial = constValue ?? value ?? schema?.default ?? '0';
    const initialNumber =
        initial === '' ? 0 : Parser.cpuParser(String(initial));
    const [inputValue, setInputValue] = useState<number | ''>(
        initialNumber > 0 ? initialNumber : ''
    );
    const displayedValue = isConst
        ? Parser.cpuParser(String(constValue))
        : inputValue;

    // Const fields are not user-editable, so force the form data to match.
    useEffect(() => {
        if (isConst) {
            const next =
                Parser.cpuParser(String(constValue)) > 0
                    ? String(constValue)
                    : undefined;
            if (value !== next) onChange(next);
        } else if (
            !isConst &&
            value != null &&
            value !== '' &&
            Parser.cpuParser(String(value)) <= 0
        ) {
            onChange(undefined);
        }
    }, [isConst, constValue, value, onChange]);

    const handleInputChange = event => {
        const rawValue = event.target.value;
        if (enumValues && !isConst) {
            const next =
                rawValue === '' ? 0 : Parser.cpuParser(String(rawValue));
            setInputValue(next > 0 ? next : '');
            onChange(next > 0 ? String(rawValue) : undefined);
            return;
        }
        if (rawValue === '' || Number(rawValue) <= 0) {
            setInputValue('');
            onChange(undefined);
            return;
        }
        let next = Number(rawValue);
        if (max !== undefined && next > max) next = max;
        if (next < min) next = min;
        const quantity = Number.isInteger(next)
            ? String(next)
            : `${Math.round(next * 1000)}m`;
        const positive = Parser.cpuParser(quantity) > 0;
        setInputValue(positive ? next : '');
        onChange(positive ? quantity : undefined);
    };

    return (
        <Stack direction="column" spacing={1}>
            <Typography
                sx={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'grey',
                    marginBottom: '10px',
                }}
                color={'secondary.main'}
            >
                {label}
            </Typography>

            <TextField
                variant="outlined"
                margin="none"
                disabled={readonly || isConst || schema?.readOnly}
                select={!!enumValues && !isConst}
                type={enumValues && !isConst ? undefined : 'number'}
                slotProps={{ htmlInput: { min, max, step } }}
                id={id}
                name={id}
                value={
                    enumValues && !isConst
                        ? value ?? ''
                        : Number(displayedValue) > 0
                        ? displayedValue
                        : ''
                }
                onChange={handleInputChange}
                sx={{ maxWidth: '5em' }}
            >
                {enumValues?.map(v => (
                    <MenuItem key={v} value={v}>
                        {v}
                    </MenuItem>
                ))}
            </TextField>

            <FormHelperText component="div">
                {max
                    ? translate('fields.k8s.resources.cpu.description-max-x', {
                          val: max,
                      })
                    : translate('fields.k8s.resources.cpu.description')}
            </FormHelperText>
        </Stack>
    );
};
