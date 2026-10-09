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
} from '@mui/material';
import { WidgetProps } from '@rjsf/utils';
import { useEffect, useState } from 'react';
import { useTranslate } from 'react-admin';

export const CoreResourceGpuWidget = function (props: WidgetProps) {
    const { id, value, label, readonly, options, onChange, schema } = props;
    const translate = useTranslate();

    const constValue = schema?.const as string | number | undefined;
    const enumValues = schema?.enum as (string | number)[] | undefined;
    const min = Math.max(
        0,
        Math.ceil(schema?.minimum ?? schema?.exclusiveMinimum ?? 0)
    );
    const maximum = schema?.['x-maximumQuantity'];
    const max = maximum === undefined ? undefined : Math.floor(Number(maximum));
    const step = 1;
    const isConst = constValue !== undefined;

    const initial = isConst
        ? parseInt('' + constValue)
        : value
        ? parseInt(value)
        : schema?.default !== undefined
        ? parseInt('' + schema.default)
        : 0;
    const [inputValue, setInputValue] = useState<number | ''>(
        initial > 0 ? initial : ''
    );
    const displayedValue = isConst ? Number(constValue) : inputValue;

    // Const fields are not user-editable, so force the form data to match.
    useEffect(() => {
        if (isConst) {
            const next =
                Number(constValue) > 0 ? String(constValue) : undefined;
            if (value !== next) onChange(next);
        } else if (
            !isConst &&
            value != null &&
            value !== '' &&
            Number(value) <= 0
        ) {
            onChange(undefined);
        }
    }, [isConst, constValue, value, onChange]);

    const handleInputChange = event => {
        const rawValue = event.target.value;
        if (rawValue === '' || Number(rawValue) <= 0) {
            setInputValue('');
            onChange(undefined);
            return;
        }
        let next = Number(rawValue);
        if (!Number.isInteger(next)) return;
        if (max !== undefined && next > max) next = max;
        if (next < min) next = min;
        setInputValue(next > 0 ? next : '');
        onChange(next > 0 ? String(next) : undefined);
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
                {translate(label)}
            </Typography>
            <TextField
                variant="outlined"
                margin="none"
                select={!!enumValues && !isConst}
                type={enumValues && !isConst ? undefined : 'number'}
                slotProps={{ htmlInput: { min, max, step } }}
                disabled={readonly || isConst || schema?.readOnly}
                id={id}
                name={id}
                value={Number(displayedValue) > 0 ? displayedValue : ''}
                onChange={handleInputChange}
                sx={{ maxWidth: '5em' }}
            >
                {enumValues?.map(v => (
                    <MenuItem key={v} value={Number.parseInt('' + v)}>
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
