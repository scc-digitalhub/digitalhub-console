import {
    Chip,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { WidgetProps } from '@rjsf/utils';
import { useState, FocusEvent } from 'react';
import { useTranslate } from 'react-admin';

export const CoreResourceMemWidget = function (props: WidgetProps) {
    const {
        id,
        value,
        disabled,
        readonly,
        onBlur,
        onChange,
        onFocus,
        options,
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
                <Grid item xs={12} sm={12} md={12}>
                    <Grid container spacing={2} >
                        <Grid
                            item
                            xs={12}
                            sm={4}
                            md={4}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
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
                                inputProps={{ min: 0, step: 1 }}
                                disabled={readonly}
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
        </div>
    );
};
interface RequestType {
    value: string;
    label: string;
}
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
        formData.k8s.resources.mem.requests &&
        formData.k8s.resources.mem.limits === undefined
    )
        return true;
    if (
        getValueMem(formData.k8s.resources.mem.requests) >
        getValueMem(formData.k8s.resources.mem.limits)
    )
        return true;
    return false;
}
