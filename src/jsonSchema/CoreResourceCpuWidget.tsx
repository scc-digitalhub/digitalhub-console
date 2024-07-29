import { Grid, Typography, MenuItem, Select, TextField } from '@mui/material';
import { fontSize } from '@mui/system';
import { WidgetProps } from '@rjsf/utils';
import { useState } from 'react';

export const CoreResourceCpuWidget = function (props: WidgetProps) {
    const {
        id,
        value,
        disabled,
        readonly,
        options,
        onBlur,
        onChange,
        onFocus,
    } = props;
    const [stringValue, setStringValue] = useState<string>(value ? value : '');
    const [inputValue, setInputValue] = useState<number>(
        value ? parseInt(value) : 0
    );
    const [inputUnit, setInputUnit] = useState<string>(RequestTypes[0].value);

    const handleInputChange = event => {
        setInputValue(event.target.value);
        setStringValue(event.target.value + inputUnit);
        onChange(event.target.value + inputUnit);
    };
    const handleUnitChange = event => {
        setInputUnit(event.target.value);
        setStringValue(inputValue + event.target.value);
        onChange(inputValue + event.target.value);
    };
    return (
        <div>
            <Grid item xs={12} sm={12} md={12}>
                <Grid container spacing={2}>
                    <Grid
                        item
                        xs={4}
                        sm={4}
                        md={4}
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
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        <TextField
                            fullWidth
                            variant="outlined"
                            type="number"
                            disabled={readonly}
                            inputProps={{ min: 0, step: 1 }}
                            id={id}
                            name={id}
                            value={inputValue}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        <Select
                            labelId="type-select-label"
                            id="type-select"
                            value={inputUnit}
                            disabled={readonly}
                            type="outlined"
                            onChange={handleUnitChange}
                            defaultValue={RequestTypes[0].value}
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
        </div>
    );
};
interface RequestType {
    value: string;
    label: string;
}
const RequestTypes = [
    {
        value: 'm',
        label: 'millicpu',
    },
    {
        value: '',
        label: 'cpu',
    },
];
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
