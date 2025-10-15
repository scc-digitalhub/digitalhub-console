// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Grid, Typography, TextField } from '@mui/material';
import { WidgetProps } from '@rjsf/utils';
import { useState } from 'react';
import { useTranslate } from 'react-admin';

export const CoreResourceCpuWidget = function (props: WidgetProps) {
    const { id, value, readonly, options, onChange } = props;
    const translate = useTranslate();
    const [inputValue, setInputValue] = useState<number>(
        value ? parseInt(value) : 0
    );

    const handleInputChange = event => {
        setInputValue(event.target.value);
        onChange('' + event.target.value);
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
                    disabled={readonly}
                    slotProps={{ htmlInput: { min: 0, step: 1 } }}
                    id={id}
                    name={id}
                    value={inputValue}
                    onChange={handleInputChange}
                />
            </Grid>
        </Grid>
    );
};

function getValueCpu(value: string) {
    if (!value) return 0;
    const converter = {
        m: 1,
    };
    const units = Object.keys(converter);
    const numberPart = value.match(/\d+/);
    const stringPart = value.replace(/[0-9]/g, '');
    return (
        (Number(numberPart) * converter[stringPart]) /
        converter[units[units.length - 1]]
    );
}

export function checkCpuRequestError(formData: any) {
    if (
        formData?.k8s?.resources?.cpu?.requests &&
        getValueCpu(formData?.k8s?.resources?.cpu?.requests) != 0 &&
        formData?.k8s?.resources?.cpu?.limits === undefined
    )
        return true;
    if (
        getValueCpu(formData?.k8s?.resources?.cpu?.requests) >
        getValueCpu(formData?.k8s?.resources?.cpu?.limits)
    )
        return true;
    return false;
}
