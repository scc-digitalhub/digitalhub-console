// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Grid, MenuItem, Typography, TextField } from '@mui/material';
import { WidgetProps } from '@rjsf/utils';
import { useEffect, useState } from 'react';
import { useTranslate } from 'react-admin';

export const CoreResourceGpuWidget = function (props: WidgetProps) {
    const { id, value, readonly, options, onChange, schema } = props;
    const translate = useTranslate();

    const constValue = schema?.const as string | number | undefined;
    const enumValues = schema?.enum as (string | number)[] | undefined;
    const min = schema?.minimum ?? schema?.exclusiveMinimum ?? 0;
    const max = schema?.maximum ?? schema?.exclusiveMaximum;
    const step = schema?.multipleOf ?? 1;
    const isConst = constValue !== undefined;

    const initial = isConst
        ? parseInt('' + constValue)
        : value
          ? parseInt(value)
          : schema?.default !== undefined
            ? parseInt('' + schema.default)
            : 0;
    const [inputValue, setInputValue] = useState<number>(initial);

    // Const fields are not user-editable, so force the form data to match.
    useEffect(() => {
        if (isConst && value !== '' + constValue) {
            setInputValue(parseInt('' + constValue));
            onChange('' + constValue);
        }
    }, [isConst, constValue, value, onChange]);

    const handleInputChange = event => {
        let next = event.target.value;
        if (next !== '' && max !== undefined && Number(next) > max) next = max;
        if (next !== '' && Number(next) < min) next = min;
        setInputValue(next);
        onChange(next);
    };

    return (
        <Grid container>
            <Grid size={12}>
                <Typography
                    sx={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: 'grey',
                        marginBottom: '10px',
                    }}
                    color={'secondary.main'}
                >
                    {translate(options['ui:title'])}
                </Typography>
            </Grid>
            <Grid size={10}>
                <TextField
                    variant="outlined"
                    margin="none"
                    select={!!enumValues && !isConst}
                    type={enumValues && !isConst ? undefined : 'number'}
                    slotProps={{ htmlInput: { min, max, step } }}
                    disabled={readonly || isConst || schema?.readOnly}
                    id={id}
                    name={id}
                    value={inputValue}
                    onChange={handleInputChange}
                >
                    {enumValues?.map(v => (
                        <MenuItem key={v} value={parseInt('' + v)}>
                            {v}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
        </Grid>
    );
};

export function checkGpuRequestError(formData: any) {
    return false;
    //     if (formData.transform_spec.k8s.resources.gpu.requests && formData.transform_spec.k8s.resources.gpu.limits ===undefined)
    //         return true
    //     if (formData.transform_spec.k8s.resources.gpu.requests > formData.transform_spec.k8s.resources.gpu.limits)
    //         return true
    //    return false;
}
