// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Grid, Typography, TextField } from '@mui/material';
import { WidgetProps } from '@rjsf/utils';
import { useState } from 'react';
import { useTranslate } from 'react-admin';

export const CoreResourceGpuWidget = function (props: WidgetProps) {
    const { id, value, readonly, options, onChange } = props;
    const translate = useTranslate();
    const [inputValue, setInputValue] = useState<number>(
        value ? parseInt(value) : 0
    );

    const handleInputChange = event => {
        setInputValue(event.target.value);
        onChange(event.target.value);
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
                    type="number"
                    slotProps={{ htmlInput: { min: 0, step: 1 } }}
                    disabled={readonly}
                    id={id}
                    name={id}
                    value={inputValue}
                    onChange={handleInputChange}
                />
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
