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

export const CoreResourceGpuWidget = function (props: WidgetProps) {
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

    const handleInputChange = event => {
        setInputValue(event.target.value);
        setStringValue(event.target.value);
        onChange(event.target.value);
    };

    const handleBlur = ({ target }: FocusEvent<HTMLInputElement>) =>
        onBlur(id, target.value);
    const handleFocus = ({ target }: FocusEvent<HTMLInputElement>) =>
        onFocus(id, target.value);
    return (
        <div>
            {!readonly && (
                <Grid item xs={12} sm={6} md={6}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid
                            item
                            xs={6}
                            sm={6}
                            md={6}
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
                            xs={6}
                            sm={6}
                            md={6}
                            sx={{ display: 'flex', alignItems: 'center' }}
                        >
                            <TextField
                                fullWidth
                                variant="outlined"
                                type="number"
                                inputProps={{ min: 0, step: 1 }}
                                disabled={disabled}
                                id={id}
                                name={id}
                                value={inputValue}
                                onChange={handleInputChange}
                            />
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
