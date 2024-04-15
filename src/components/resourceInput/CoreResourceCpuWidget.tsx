import {
    Chip,
    Grid,
    Typography,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import { WidgetProps } from '@rjsf/utils';
import { useState, FocusEvent } from 'react';
import { useTranslate } from 'react-admin';

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
    const translate = useTranslate();

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
    const handleBlur = ({ target }: FocusEvent<HTMLInputElement>) =>
        onBlur(id, target.value);
    const handleFocus = ({ target }: FocusEvent<HTMLInputElement>) =>
        onFocus(id, target.value);
    return (
        <div>
            {!readonly && (
                <Grid item xs={12} sm={12} md={12}>
                    <Grid container spacing={2}>
                        <Grid
                            item
                            xs={12}
                            sm={4}
                            md={4}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                direction: 'rtl',
                            }}
                        >
                            <Typography variant="h6" color={'secondary.main'}>
                                {options['ui:title'] as string}
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={4}
                            sm={4}
                            md={4}
                            sx={{ display: 'flex', alignItems: 'center' }}
                        >
                            <TextField
                                fullWidth
                                variant="outlined"
                                type="number"
                                disabled={disabled}
                                inputProps={{ min: 0, step: 1 }}
                                id={id}
                                name={id}
                                value={inputValue}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={4}
                            sm={4}
                            md={4}
                            sx={{ display: 'flex', alignItems: 'center' }}
                        >
                            <Select
                                labelId="type-select-label"
                                id="type-select"
                                value={inputUnit}
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
            )}
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
];
