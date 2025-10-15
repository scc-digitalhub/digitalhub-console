// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import { WidgetProps } from '@rjsf/utils';
import { useState } from 'react';
import { useTranslate } from 'react-admin';

export const CoreResourceMemWidget = function (props: WidgetProps) {
    const { id, value, readonly, onChange, options } = props;
    const translate = useTranslate();
    const [inputValue, setInputValue] = useState<number>(
        value ? parseInt(value) : 0
    );
    const [inputUnit, setInputUnit] = useState<string>(
        value ? value.replace(/[0-9]/g, '') : RequestTypes[1].value
    );

    const handleInputChange = event => {
        setInputValue(event.target.value);
        onChange(event.target.value + inputUnit);
    };
    const handleUnitChange = event => {
        setInputUnit(event.target.value);
        onChange(inputValue + event.target.value);
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
            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                <Grid size={4}>
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
                <Grid size={6}>
                    <Select
                        labelId="type-select-label"
                        id="type-select"
                        value={inputUnit}
                        type="outlined"
                        onChange={handleUnitChange}
                        defaultValue={RequestTypes[1].value}
                        disabled={readonly}
                    >
                        {RequestTypes.map(option => {
                            return (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </Grid>
            </Grid>
        </Grid>
    );
};

const RequestTypes = [
    {
        value: 'Ki',
        label: 'Kibibyte',
    },
    {
        value: 'Mi',
        label: 'Mebibyte',
    },
    {
        value: 'Gi',
        label: 'Gibibyte',
    },
    {
        value: 'k',
        label: 'Kilobyte',
    },
    {
        value: 'M',
        label: 'Megabyte',
    },
    {
        value: 'G',
        label: 'Gigabyte',
    },
];

function getValueMem(value: string) {
    if (!value) return 0;
    const converter = {
        Ki: 1,
        Mi: 1024,
        Gi: 1048576,
        k: 1,
        M: 1000,
        G: 1000000,
    };
    const units = Object.keys(converter);
    const numberPart = value.match(/\d+/);
    const stringPart = value.replace(/[0-9]/g, '');
    return (
        (Number(numberPart) * converter[stringPart]) /
        converter[units[units.length - 1]]
    );
}

export function checkMemRequestError(formData: any) {
    if (
        formData?.k8s?.resources?.mem?.requests &&
        formData?.k8s?.resources?.mem?.limits === undefined
    )
        return true;
    if (
        getValueMem(formData?.k8s?.resources?.mem?.requests) >
        getValueMem(formData?.k8s?.resources?.mem?.limits)
    )
        return true;
    return false;
}
