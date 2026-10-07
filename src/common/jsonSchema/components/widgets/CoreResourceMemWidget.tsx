// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import { WidgetProps } from '@rjsf/utils';
import { useEffect, useState } from 'react';
import { useTranslate } from 'react-admin';

export const CoreResourceMemWidget = function (props: WidgetProps) {
    const { id, value, readonly, onChange, options, schema } = props;
    const translate = useTranslate();

    const constValue = schema?.const as string | undefined;
    const enumValues = schema?.enum as string[] | undefined;
    const isConst = constValue !== undefined;
    const locked = readonly || isConst || !!schema?.readOnly;

    const initialValue = isConst
        ? constValue
        : value || (schema?.default as string | undefined);
    const [inputValue, setInputValue] = useState<number>(
        initialValue ? parseInt(initialValue) : 0
    );
    const [inputUnit, setInputUnit] = useState<string>(
        initialValue
            ? initialValue.replace(/[0-9]/g, '')
            : RequestTypes[1].value
    );

    // Const fields are not user-editable, so force the form data to match.
    useEffect(() => {
        if (isConst && value !== constValue) {
            setInputValue(parseInt(constValue));
            setInputUnit(constValue.replace(/[0-9]/g, ''));
            onChange(constValue);
        }
    }, [isConst, constValue, value, onChange]);

    const handleEnumChange = event => {
        const next: string = event.target.value;
        setInputValue(parseInt(next));
        setInputUnit(next.replace(/[0-9]/g, ''));
        onChange(next);
    };

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
            {enumValues && !isConst ? (
                <Grid size={10}>
                    <Select
                        id={id}
                        value={value ?? ''}
                        onChange={handleEnumChange}
                        disabled={locked}
                    >
                        {enumValues.map(v => (
                            <MenuItem key={v} value={v}>
                                {v}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
            ) : (
                <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                    <Grid size={4}>
                        <TextField
                            variant="outlined"
                            margin="none"
                            type="number"
                            slotProps={{ htmlInput: { min: 0, step: 1 } }}
                            disabled={locked}
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
                            disabled={locked}
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
            )}
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
