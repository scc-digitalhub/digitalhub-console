// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Grid, TextField } from '@mui/material';
import { WidgetProps } from '@rjsf/utils';
import { useState } from 'react';
import { useTranslate } from 'react-admin';

export const TextArrayWidget = function (props: WidgetProps) {
    const { id, value, readonly, options, onChange, label } = props;
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
        <Grid size={12}>
            <TextField
                id={id}
                name={id}
                label={label || translate(options?.['ui:title'] ?? '')}
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
    );
};
