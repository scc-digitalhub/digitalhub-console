// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    FormHelperText,
    Grid,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { WidgetProps } from '@rjsf/utils';
import Parser from 'k8s-resource-parser';
import { useEffect, useState } from 'react';
import { useTranslate } from 'react-admin';

const QuantityWidget = function (
    props: WidgetProps & { resource: 'memory' | 'disk' }
) {
    const { resource, id, label, value, readonly, onChange, options, schema } =
        props;
    const translate = useTranslate();

    const constValue = schema?.const as string | undefined;
    const enumValues = schema?.enum as string[] | undefined;
    const isConst = constValue !== undefined;
    const locked = readonly || isConst || !!schema?.readOnly;

    const initialValue = isConst
        ? constValue
        : value || (schema?.default as string | undefined);
    const initialNumber = initialValue ? Number.parseFloat(initialValue) : 0;
    const [inputValue, setInputValue] = useState<number | ''>(
        initialNumber > 0 ? initialNumber : ''
    );
    const [inputUnit, setInputUnit] = useState<string>(
        initialValue
            ? initialValue.match(/[a-zA-Z]+$/)?.[0] ?? ''
            : RequestTypes[1].value
    );
    const displayedUnit = isConst
        ? constValue.match(/[a-zA-Z]+$/)?.[0] ?? ''
        : inputUnit;
    const displayedValue = isConst
        ? Parser.memoryParser(constValue) /
          Parser.memoryParser('1' + displayedUnit)
        : inputValue;
    const maximum = schema?.['x-maximumQuantity'];
    const maxBytes =
        maximum === undefined
            ? undefined
            : Parser.memoryParser(String(maximum));
    const max =
        maxBytes === undefined
            ? undefined
            : maxBytes / Parser.memoryParser('1' + displayedUnit);

    // Const fields are not user-editable, so force the form data to match.
    useEffect(() => {
        if (isConst) {
            const next =
                Parser.memoryParser(constValue) > 0 ? constValue : undefined;
            if (value !== next) onChange(next);
        } else if (
            !isConst &&
            value != null &&
            value !== '' &&
            Parser.memoryParser(String(value)) <= 0
        ) {
            onChange(undefined);
        }
    }, [isConst, constValue, value, onChange]);

    const handleEnumChange = event => {
        const next: string = event.target.value;
        const positive = next !== '' && Parser.memoryParser(next) > 0;
        setInputValue(positive ? Number.parseFloat(next) : '');
        if (positive) setInputUnit(next.match(/[a-zA-Z]+$/)?.[0] ?? '');
        onChange(positive ? next : undefined);
    };

    const handleInputChange = event => {
        let next = event.target.value;
        if (next === '' || Number(next) <= 0) {
            setInputValue('');
            onChange(undefined);
            return;
        }
        if (max !== undefined && Number(next) > max) next = max;
        setInputValue(Number(next) > 0 ? Number(next) : '');
        onChange(Number(next) > 0 ? next + inputUnit : undefined);
    };
    const handleUnitChange = event => {
        const nextUnit = event.target.value;
        const nextMax =
            maxBytes === undefined
                ? undefined
                : maxBytes / Parser.memoryParser('1' + nextUnit);
        const nextValue =
            nextMax === undefined
                ? Number(inputValue)
                : Math.min(Number(inputValue), nextMax);
        setInputValue(nextValue > 0 ? nextValue : '');
        setInputUnit(nextUnit);
        onChange(nextValue > 0 ? nextValue + nextUnit : undefined);
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
            {enumValues && !isConst ? (
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
            ) : (
                <Grid container spacing={1} sx={{ alignItems: 'center' }}>
                    <Grid size={4}>
                        <TextField
                            variant="outlined"
                            margin="none"
                            type="number"
                            slotProps={{
                                htmlInput: { min: 0, max, step: 'any' },
                            }}
                            disabled={locked}
                            id={id}
                            name={id}
                            value={
                                Number(displayedValue) > 0 ? displayedValue : ''
                            }
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid size={7}>
                        <Select
                            labelId="type-select-label"
                            id="type-select"
                            value={displayedUnit}
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
            <FormHelperText component="div">
                {max
                    ? translate(
                          `fields.k8s.resources.${resource}.description-max-x`,
                          {
                              val: max,
                          }
                      )
                    : translate(`fields.k8s.resources.${resource}.description`)}
            </FormHelperText>
        </Stack>
    );
};

export const CoreResourceQuantityWidget = function ({
    resource,
}: {
    resource: 'memory' | 'disk';
}) {
    return function ConfiguredQuantityWidget(props: WidgetProps) {
        return <QuantityWidget {...props} resource={resource} />;
    };
};

export const CoreResourceMemWidget = CoreResourceQuantityWidget({
    resource: 'memory',
});

export const CoreResourceDiskWidget = CoreResourceQuantityWidget({
    resource: 'disk',
});

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
