import { Grid, TextField, Typography } from '@mui/material';
import { WidgetProps } from '@rjsf/utils';
import { useState, useEffect } from 'react';
import { useTranslate } from 'react-admin';

export const TextArrayWidget = function (props: WidgetProps) {
    const { id, value, readonly, options, onChange } = props;
    const translate = useTranslate();
    const initial = Array.isArray(value) ? value.join('\n') : '';
    const [inputValue, setInputValue] = useState<string>(initial);

    const handleInputChange = event => {
        const text = event.target.value;
        setInputValue(text);
        const arr = text.split('\n');
        onChange(arr);
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
                    {translate(options?.['ui:title'] ?? '')}
                </Typography>
            </Grid>

            <Grid size={12}>
                <TextField
                    id={id}
                    name={id}
                    variant="outlined"
                    fullWidth
                    disabled={readonly}
                    multiline
                    minRows={4}
                    maxRows={12}
                    value={inputValue}
                    onChange={handleInputChange}
                />
            </Grid>
        </Grid>
    );
};
