// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Grid, Typography, TextField } from '@mui/material';
import { WidgetProps } from '@rjsf/utils';
import { useState } from 'react';

export const CoreResourceGpuWidget = function (props: WidgetProps) {
    const { id, value, readonly, options, onChange } = props;
    const [stringValue, setStringValue] = useState<string>(value ? value : '');
    const [inputValue, setInputValue] = useState<number>(
        value ? parseInt(value) : 0
    );

    const handleInputChange = event => {
        setInputValue(event.target.value);
        setStringValue(event.target.value);
        onChange(event.target.value);
    };

    return (
        <div>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <Grid container spacing={2}>
                    <Grid
                        size={{ xs: 12, sm: 4, md: 4 }}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            paddingTop: readonly ? '10px' : '0px',
                            paddingBottom: readonly ? '10px' : '0px',
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: 'grey',
                                paddingTop: readonly ? '18px' : '0px',
                                paddingBottom: readonly ? '16px' : '0px',
                            }}
                            color={'secondary.main'}
                        >
                            {options['ui:title'] as string}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid
                        size={{ xs: 12, sm: 6, md: 6 }}
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        <TextField
                            fullWidth
                            variant="outlined"
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
            </Grid>
        </div>
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
